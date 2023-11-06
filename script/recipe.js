const SubmitButton = document.querySelector("form");
const Search_Text = document.querySelector("#Input_Search");
const DietFilter = document.querySelector("#diet");
const ListOfRecipes = document.querySelector(".list_of_recipes");
const $errorField = document.querySelector(".js-error");
const API = `https://api.spoonacular.com/recipes/`;

SubmitButton.addEventListener("submit", async (event) => {
  event.preventDefault();
  ListOfRecipes.innerHTML = "";
  let value = Search_Text.value.trim();
  if (value.length > 0) {
    $errorField.innerHTML = "";
    if (DietFilter.value == "yes") {
      value += `&diet=vegan|vegetarian`;
    }

    try {
      const data = await fetch(
        `${API}complexSearch?query=${value}&apiKey=${API_KEY}`
      );
      if (!data.ok) {
        throw new Error("Error during the request");
      }
      const response = await data.json();

      if (Array.isArray(response.results) && response.results.length > 0) {
        renderRecipe(response.results);
      } else {
        $errorField.innerHTML = "No results found.";
      }
    } catch (error) {
      console.error(error);
      $errorField.innerHTML = "An error occurred during the search.";
    }
  } else {
    $errorField.innerHTML = "Empty search input.";
  }
});

async function renderRecipe(results) {
  let html = "";

  for (let meal of results) {
    const MoreDetails = await fetch(
      `${API}${meal.id}/information?apiKey=${API_KEY}`
    );

    if (!MoreDetails.ok) {
      throw new Error("Error during the request");
    }

    const infos = await MoreDetails.json();

    let price = infos.cheap ? "cheap" : "expensive";

    html += `
    <section class="meal" id="${meal.id}">
      <img 
        src="${meal.image}"
        alt="${meal.title}"
        class="meal-thumbnail-img" />
      <h3 class="meal-title">${meal.title}</h3>
      <div class="attribs">
        <div class="meal-time">
        <img
            src="/pic/hourglass.png"
            class="icon"
            alt"hourglass_icon"
        />
          ${infos.readyInMinutes} minutes
        </div>
        <div class="meal-portion"> 
        <img
            src="/pic/cooker.png"
            class="icon"
            alt"cooker_icon"
        />
          ${infos.servings} servings
        </div>
        <div class="meal-price"> 
        <img
            src="/pic/wallet.png"
            class="icon"
            alt"wallet_icon"
        />
          ${price}
        </div>
      </div>
    </section>
    `;
  }

  if (html.length > 0) {
    ListOfRecipes.innerHTML = html;
    const meals = document.querySelectorAll(".meal");

    meals.forEach((meal) => {
      meal.addEventListener("click", () => renderFullRecipe(meal));
    });

    function renderFullRecipe(meal) {
      let ingredientString = "Ingredients:\n";
      let instructions = "How to make the revipe:\n";
      fetch(`${API}${meal.id}/information?apiKey=${API_KEY}`).then((data) =>
        data.json().then((DetailedData) => {
          for (let Ingredients of DetailedData.extendedIngredients) {
            ingredientString += `${Ingredients.originalName}\n`;
          }
          console.log(ingredientString);
        })
      );
      fetch(`${API}${meal.id}/analyzedInstructions?apiKey=${API_KEY}`).then(
        (data) =>
          data.json().then((instructions) => {
            for (let nextStep of instructions[0].steps) {
              instructions += `${nextStep.step}\n`;
            }
            console.log(instructions);
          })
      );
    }
  } else {
    $errorField.innerHTML = "No results found.";
  }
}
