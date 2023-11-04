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
    console.log(infos); // Detailed recipe information

    let price = infos.cheap ? "cheap" : "expensive";

    html += `
    <section class="meal">
      <img 
        src="${meal.image}"
        alt="${meal.title}"
        class="meal-thumbnail-img" />
      <h3>${meal.title}</h3>
      <div class="attribs">
        <div class="meal-time">
          ${infos.readyInMinutes} minutes
        </div>
        <div class="meal-portion"> 
          ${infos.servings} servings
        </div>
        <div class="meal-price"> 
          ${price}
        </div>
      </div>
    </section>
    `;
  }

  if (html.length > 0) {
    ListOfRecipes.innerHTML = html;
  } else {
    $errorField.innerHTML = "No results found.";
  }
}
