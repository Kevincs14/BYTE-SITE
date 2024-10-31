from flask import Flask, render_template, request, redirect, session, url_for, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from wtforms.validators import ValidationError
import os
from dotenv import load_dotenv
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer

# Load environment variables from a .env file, allowing sensitive data to be stored securely
load_dotenv()

# Create Flask app instance
app = Flask(__name__)

# Secret key for session management and CSRF protection, loaded from environment variables
app.secret_key = os.getenv('SECRET_KEY', 'hacker')  # Default key used if none provided in .env

# Configure SQLAlchemy for database integration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"  # SQLite database path
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # Disables unnecessary modification tracking
db = SQLAlchemy(app)  # Initialize SQLAlchemy instance

# Flask-Mail configuration for sending emails
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')  # Mail server URL from .env
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))  # Mail server port, defaults to 587
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True').lower() in ['true', '1', 'yes']  # TLS usage setting
app.config['MAIL_USE_SSL'] = os.environ.get('MAIL_USE_SSL', 'False').lower() in ['true', '1', 'yes']  # SSL usage setting
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')  # Sender email from .env
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')  # Sender email password

# Initialize Flask-Mail instance for handling email functions
mail = Mail(app)

# Serializer for generating and validating timed tokens (for secure password reset links)
serializer = URLSafeTimedSerializer(app.secret_key)

# Define User model for database, representing a table with user records
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each user
    username = db.Column(db.String(25), unique=True, nullable=False)  # Unique username
    email = db.Column(db.String(25), unique=True, nullable=False)  # Unique email
    password = db.Column(db.String(150), nullable=False)  # Password hash

    def set_password(self, password):
        self.password = generate_password_hash(password)  # Hash and set user password
    
    def check_password(self, password):
        return check_password_hash(self.password, password)  # Verify password hash matches input


# Home route handling login and registration requests
@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':  # If the form is submitted
        action = request.form.get('action')  # Action (login or register)
        if action == 'login':
            return login()  # Redirect to login function
        elif action == 'register':
            return register()  # Redirect to register function
    
    if 'username' in session:  # If user is already logged in
        return redirect(url_for('dashboard'))  # Redirect to dashboard
    
    return render_template('index.html')  # Render home page if not logged in


# Dashboard route only accessible if logged in
@app.route('/dashboard')
def dashboard():
    if 'username' not in session:  # If not logged in
        return redirect(url_for('home'))  # Redirect to home page
    return render_template('dashboard.html')  # Show dashboard


# Login function, checks user credentials and starts session
def login():
    username = request.form['username']
    password = request.form['password']
    user = User.query.filter_by(username=username).first()  # Query user by username
    if user and user.check_password(password):  # If user exists and password is correct
        session['username'] = username  # Set session with username
        return redirect(url_for('dashboard'))  # Redirect to dashboard
    else:
        return render_template('index.html', error="Invalid credentials")


# Register function, creates a new user if username and email are unique
def register():
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']
    user = User.query.filter_by(username=username).first()  # Check if username exists
    if user:
        return render_template('index.html', error="Username already exists")
    else:
        existing_email = User.query.filter_by(email=email).first()  # Check if email exists
        if existing_email:
            return render_template('index.html', error="Email already registered")
        new_user = User(username=username, email=email)  # Create new user instance
        new_user.set_password(password)  # Hash and set password
        db.session.add(new_user)  # Add user to database
        db.session.commit()  # Save changes
        session['username'] = username  # Set session with username
        return redirect(url_for('dashboard'))  # Redirect to dashboard
    

# Simple route to render a recipes page
@app.route('/recipes')
def recipes():
    return render_template('recipes.html')


# Logout route, removes user from session and redirects to home
@app.route('/logout')
def logout():
    session.pop('username', None)  # Remove username from session
    return redirect(url_for('home'))  # Redirect to home page


# Password reset request route, handles email sending for password reset
@app.route('/reset-password-request', methods=['POST', 'GET'])
def reset_password_request():
    if request.method == 'POST':
        email = request.form.get('forgotPass')  # Get email from form
        user = User.query.filter_by(email=email).first()  # Find user by email
        if user:
            token = serializer.dumps(user.email, salt='password-reset-salt')  # Generate secure token
            reset_url = url_for('reset_password', token=token, _external=True)  # Password reset URL
            
            # Email content
            subject = "Password Reset Requested"
            sender = app.config['MAIL_USERNAME']
            recipients = [user.email]
            body = f'''Hi {user.username}, click here to reset your password: {reset_url}'''

            # Attempt to send email
            try:
                msg = Message(subject=subject, sender=sender, recipients=recipients, body=body)
                mail.send(msg)
                flash('If your email is registered, a password reset link has been sent.', 'info')
            except Exception as e:
                app.logger.error(f"Failed to send email: {e}")  # Log email error

    return render_template('reset_password.html')  # Render reset password request page


# Password reset route, handles token verification and password updating
@app.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    try:
        email = serializer.loads(token, salt='password-reset-salt', max_age=1800)  # Verify token
    except:
        return render_template('reset_password.html', error="Invalid or expired token")
    
    if request.method == 'POST':
        new_password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        if new_password != confirm_password:
            return render_template('reset_password.html', error="Passwords do not match")
        
        user = User.query.filter_by(email=email).first()  # Find user by email
        if user:
            user.set_password(new_password)  # Update password
            db.session.commit()  # Save changes

    return render_template('reset_password.html')  # Render password reset form


# Route to reset the app, renders login page
@app.route('/reset')
def reset():
    return render_template('index.html')


# Run the Flask app in debug mode for development
if __name__ == '__main__':
    with app.app_context():  # Ensure app context is created for database access
        app.run(debug=True)
