// Select DOM elements for later use
const helloElements = document.querySelectorAll('.hello');
const introScreen = document.querySelector('.intro-container');
const loginPage = document.querySelector('.loginPage'); 
const signInDiv = document.querySelector('.SignIn');
const loginBoxDiv = document.querySelector('.loginBox');
const SignInSW = document.querySelector('.SignInSwitch');
const SignUpSW = document.querySelector('.SignUpSwitch');
const errMessage = document.querySelector('.error-message');
const FormForgot = document.querySelector('.forgotForm');
const Rmessage = document.querySelector('.ResetMessage');

let index = 0; // Initialize index for intro animation

// Intro page animations on document load
document.addEventListener('DOMContentLoaded', () => {
    // Check the saved state from local storage to determine which view to show
    const savedState = localStorage.getItem('pageState');

    // If the saved state is 'login', show the sign-in view
    if (savedState === 'login') {
        signInDiv.style.display = 'flex';
        loginBoxDiv.style.display = 'none';
        SignInSW.classList.add("show");
        SignInSW.classList.remove("hide");
        SignUpSW.classList.add("hide");
        SignUpSW.classList.remove("show");
        console.log("YESS");
    } 
    // If the saved state is 'register', show the sign-up view
    else if (savedState === 'register') {
        signInDiv.style.display = 'none';
        loginBoxDiv.style.display = 'flex';
        SignUpSW.classList.add("show");
        SignUpSW.classList.remove("hide");
        SignInSW.classList.add("hide");
        SignInSW.classList.remove("show");
    }

    // Uncomment below to keep showing the intro every time
    /*
    if (localStorage.getItem('introShown') === "true") {
        // Optionally hide the intro screen and show login page directly
        introScreen.style.display = 'none';
        loginPage.style.top = '0';
        loginPage.style.transition = 'none';
    } else {
    */
        // Show intro animation and set the state
        console.log("burh");
        localStorage.setItem("introShown", "true");
        intro(index);
        screenUp();
    // }

    // Function to run intro animation
    function intro(index) {
        // Base case: If index exceeds length, stop the animation
        if (index === helloElements.length) {
            console.log("asdad");
            return;
        }

        // Remove active and fade classes from all elements
        helloElements.forEach((element) => { 
            element.classList.remove("active", "fade");
        });

        // Add 'active' class to the current element
        helloElements[index].classList.add("active");

        // Set timeout to transition to fade
        setTimeout(() => { 
            helloElements[index].classList.remove("active");
            helloElements[index].classList.add("fade");
        }, 1000); // Duration for fade transition

        // Set timeout for next element in the sequence
        setTimeout(() => {
            index = index + 1;
            intro(index);
        }, 1000); // Time delay before showing the next element
    }

    // Function to move the intro screen out of view
    function screenUp() {
        setTimeout(() => {
            if (introScreen) {
                introScreen.style.top = '-100vh'; // Move intro screen out of view
            }
            if (loginPage) {
                setTimeout(() => {
                    loginPage.classList.add('show'); // Show the login page
                }, 0); // Delay before showing login page
            }
            SignUpSW.classList.add("show");
        }, 4000); // Duration before intro screen moves up
    }
});

// Event listener for "Already have an account?" link
document.querySelector(".loginLink").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default action for the link

    if (errMessage) {
        errMessage.style.display = 'none'; // Hide the error message if present
    }

    // Show the SignIn div and hide the loginBox div
    if (signInDiv) {
        signInDiv.style.display = 'flex'; 
    }
    if (loginBoxDiv) {
        loginBoxDiv.style.display = 'none'; 
    }

    // Update the visibility of the switch elements
    SignInSW.classList.add("show");
    SignInSW.classList.remove("hide");
    SignUpSW.classList.add("hide");
    SignUpSW.classList.remove("show");

    // Save the current state to local storage
    localStorage.setItem('pageState', 'login');
});

// Event listener for "Don't have an account?" link
document.querySelector(".SignUpLink").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default action for the link
    
    // Hide SignIn div and show loginBox div
    if (signInDiv) {
        signInDiv.style.display = 'none'; 
    }
    if (loginBoxDiv) {
        loginBoxDiv.style.display = 'flex'; 
    }

    // Update visibility of switch elements
    SignUpSW.classList.add("show");
    SignUpSW.classList.remove("hide");
    SignInSW.classList.add("hide");
    SignInSW.classList.remove("show");

    // Save the current state to local storage
    localStorage.setItem('pageState', 'register');
});

// Event listener for SignUp switch
document.querySelector(".SignUpSwitch").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default action for the link
    
    // Hide SignIn div and show loginBox div
    if (signInDiv) {
        signInDiv.style.display = 'none'; 
    }
    if (loginBoxDiv) {
        loginBoxDiv.style.display = 'flex'; 
    }

    // Hide error message and update visibility of switch elements
    
    SignUpSW.classList.add("show");
    SignUpSW.classList.remove("hide");
    SignInSW.classList.add("hide");
    SignInSW.classList.remove("show");
  
    // Save the current state to local storage
    localStorage.setItem('pageState', 'register');
});

// Event listener for SignIn switch
document.querySelector(".SignInSwitch").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default action for the link
    
    // Show SignIn div and hide loginBox div
    if (signInDiv) {
        signInDiv.style.display = 'flex'; 
    }
    if (loginBoxDiv) {
        loginBoxDiv.style.display = 'none'; 
    }

    // Update visibility of switch elements
    SignUpSW.classList.add("hide");
    SignUpSW.classList.remove("show");
    SignInSW.classList.add("show");
    SignInSW.classList.remove("hide");

    // Save the current state to local storage
    localStorage.setItem('pageState', 'login');
});


document.querySelector(".forgotPass").addEventListener("click", (event)=>{
    event.preventDefault();
    loginBoxDiv.style.display = 'none';
    signInDiv.style.display = 'none';
    FormForgot.style.display = 'flex';
    SignInSW.style.display = 'none';
    SignUpSW.style.display = 'none';

});

document.querySelector(".ForgotSubmit").addEventListener("click", (event) => {
    // No event.preventDefault() to let the form submit normally
    // Optionally, add validation here (e.g., check if email is provided)

    // Programmatically submit the form
    FormForgot.submit();

    // Hide the form and show the success message
    FormForgot.style.display = 'none';
    Rmessage.style.display = 'flex';
});