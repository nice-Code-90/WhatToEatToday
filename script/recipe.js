const SubmitButton = document.querySelector(".submit");
const Search_Text = document.querySelector("#Input_Search");
const DietFilter = document.querySelector("#diet");
const ListOfRecipes = document.querySelector(".list_of_recipes");

const API = `https://api.spoonacular.com/recipes/`;
let IsDiet = "";
SubmitButton.addEventListener("click", async () => {
  debugger;

  if ((DietFilter.value = "yes")) {
    IsDiet = `&diet=vegan|vegetarian`;
  }
  const data = await fetch(
    `${API}complexSearch?query=${Search_Text.value}${IsDiet}&apiKey=${API_KEY}`
  );

  const response = await data.json();

  ListOfRecipes.innerHTML = `
  <div>
  ${response.results}
  </div>
  `;
});
