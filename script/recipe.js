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

    const data = await fetch(
      `${API}complexSearch?query=${value}&apiKey=${API_KEY}`
    );
    const response = await data.json();

    renderRecipe(response);
  } else {
    $errorField.innerHTML = "Empty Search Input";
  }

  function renderRecipe(response) {
    let html = "";
    if (!Array.isArray(response.results)) {
      $errorField.innerHTML = "Nincs találat.";
      return;
    }
    for (let meal of response.results) {
      html += `
      <section class="meal">
        <h3>${meal.title}</h3>
        <img 
        src="${meal.image}"
        alt="${meal.title}"
        class="meal-thumbnail-img" />

      </section>
      `;
    }
    if (html.length > 0) {
      ListOfRecipes.innerHTML = html;
    } else {
      $errorField.innerHTML = "Nincs találat";
    }
  }
});
