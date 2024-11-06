const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
      if (entry.isIntersecting) {
          entry.target.classList.add('show');
      }
  });
});

async function getRecipes() {
  try {
    const response = await fetch("static/recipes.json");
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const recipes = await response.json();
      renderRecipes(recipes);
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  }
}

function renderRecipes(recipes) {
  const container = document.getElementById('recipe-container');
  recipes.forEach(recipe => {
      const section = document.createElement('section');
      section.className = 'recipe hidden';

      // Create an image element
      const images = document.createElement('div');
      const img = document.createElement('img')
      img.classList.add("picture"); // Create the image element
      img.src = recipe.images; // Set the source to the image string
      images.appendChild(img); // Append the img to the images container
      section.appendChild(images); // Append the images container to the section
      const title = document.createElement('h2');
      title.textContent = recipe.name;
      section.appendChild(title); // Append title to the section

      // Create a container for the ingredient list and instructions
      const textContainer = document.createElement('div');
      textContainer.className = 'text-container'; // Add class for flex layout

      // Ingredient list
      const ingredients = document.createElement('ul');
      recipe.ingredients.forEach(ingredient => {
          const li = document.createElement('li');
          li.textContent = ingredient;
          ingredients.appendChild(li);
      });
      textContainer.appendChild(ingredients); // Append to the text container

      // Instructions list
      const instructions = document.createElement('ol');
      recipe.instructions.forEach(step => {
          const li = document.createElement('li');
          li.textContent = step;
          instructions.appendChild(li);
      });
      textContainer.appendChild(instructions); // Append to the text container

      section.appendChild(textContainer); // Append the text container to the section
      container.appendChild(section); // Append the complete section to the container

      // Observe the newly created section
      observer.observe(section);
  });
}


getRecipes();