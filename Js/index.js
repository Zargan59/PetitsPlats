const allRecip = document.querySelector(".recetteContent");
let ingredientsTab;
let menuIngredientOpen = false;
const menuIngredient = document.querySelector("#ingredientFilter ");
const ingredientsSet = new Set();
const ingredientSelectedSet = new Set();
let tagSet =[]

const mainSearchBar = document.getElementById("mainSearchBar");
const deleteText = document.querySelector(".deleteText");

const ingredientSearch = document.getElementById("ingredientSearch");

init();

function init() {
  mainSearchBar.value = "";
  ingredientSearch.value = "";
  displayRecip(recipes);
  ingredientsTab = Array.from(ingredientsSet);
  allIngredient(ingredientsTab);
}
function quantityRecip(array){
 const quantity = document.getElementById("recipQuantity")
 quantity.innerHTML = `${array.length} recettes`
}

function displayRecip(array) {
  quantityRecip(array)
  array.forEach((element) => {
    //Création de la partie haute de la card
    const recipCard = document.createElement("div");
    recipCard.classList.add("recetteCard");

    const img = document.createElement("img");
    img.setAttribute("src", `../Plat_Photo/${element.image}`);
    img.setAttribute("alt", element.name);

    const recipTimeContent = document.createElement("div");
    recipTimeContent.classList.add("timeContent");
    const recipTime = document.createElement("p");
    recipTime.innerHTML = `${element.time}min`;

    allRecip.appendChild(recipCard);
    recipCard.appendChild(img);
    recipCard.appendChild(recipTimeContent);
    recipTimeContent.appendChild(recipTime);

    //Création de la partie description de la card
    const description = document.createElement("div");
    description.classList.add("recette");
    const recipTitle = document.createElement("h2");
    recipTitle.innerHTML = element.name;
    const recip = document.createElement("h3");
    recip.innerHTML = "Recette";
    const instruction = document.createElement("p");
    instruction.innerHTML = element.description;
    const ingredients = document.createElement("h3");
    ingredients.innerHTML = "Ingrédients";
    const ingredientContent = document.createElement("div");
    ingredientContent.classList.add("ingredientContent");

    element.ingredients.forEach((ingredient) => {
      const listIngredient = document.createElement("div");
      listIngredient.classList.add("ingredient");
      const ingredientName = document.createElement("p");
      ingredientName.classList.add("ingredientName");
      ingredientName.innerHTML = ingredient.ingredient;
      const ingredientQuantity = document.createElement("p");
      ingredientQuantity.classList.add("ingredientQuantity");
      if (ingredient.quantity === undefined && ingredient.unit === undefined) {
      } else if (ingredient.unit === undefined) {
        ingredientQuantity.innerHTML = `${ingredient.quantity}`;
      }
      //Si les deux unités sont présentes
      else {
        ingredientQuantity.innerHTML = `${ingredient.quantity} ${ingredient.unit}`;
      }

      ingredientContent.appendChild(listIngredient);
      listIngredient.appendChild(ingredientName);
      listIngredient.appendChild(ingredientQuantity);

      ingredientsSet.add(ingredient.ingredient.toLowerCase());
    });

    recipCard.appendChild(description);
    description.appendChild(recipTitle);
    description.appendChild(recip);
    description.appendChild(instruction);
    description.appendChild(ingredients);
    description.appendChild(ingredientContent);
  });
}

document
  .querySelector("#ingredientFilter .topFiltre")
  .addEventListener("click", openMenuIngredient);
  
ingredientSearch.addEventListener("input", mainSearch);
ingredientSearch.addEventListener("keydown", (e) => {
  const closestList = e.target.closest(".filterOpen");
  pressEnterFilter(e, closestList);
});

mainSearchBar.addEventListener("input", mainSearch);
deleteText.addEventListener("click", () => {
  mainSearchBar.value = "";
});

function pressEnterFilter(e, closestList) {
  if (e.key === "Enter") {
    //Si le mot chercher par l'utilisateur est dans la liste alors on prend le premier mot
    const filterContent = closestList.querySelector(".elementSelectContent");
    const firstElement = document.querySelector(".elementList p").textContent;
    if(tagSet.find(element=> element == firstElementSearch)){
    }
    else{
      tagSet.push(firstElement)
      addElementSelected(firstElement, filterContent);
    }
  }
}

function addElementSelected(input, filterContent) {
  //Je créé un tableau pour regroup tous les éléments sélectionnés
  console.log(input);
  console.log(filterContent);
  filterContent.style.display = "flex";
  const elementSelected = document.createElement("div");
  elementSelected.classList.add("elementSelect");
  const element = document.createElement("p");
  element.innerHTML = input.replace(/^./, input[0].toUpperCase());
  elementSelected.appendChild(element);
  filterContent.appendChild(elementSelected);
  const deleteContent = document.createElement("div")
  deleteContent.classList.add("deleteFilterContent")
  const deleteFilter = document.createElement("img")
  deleteFilter.setAttribute("src","assets/images/FilterQuit.png")
  deleteFilter.setAttribute("alt", "Supprimer le filtre")
  elementSelected.appendChild(deleteContent)
  deleteContent.appendChild(deleteFilter)

  elementSelected.addEventListener("mouseenter", () =>{
    element.style.fontWeight = 700
    deleteContent.style.display = "flex"
  })
  elementSelected.addEventListener("mouseleave", () =>{
    element.style.fontWeight = 400
    deleteContent.style.display = "none"
  })
  deleteContent.addEventListener("click", ()=>{
    // tagSet = tagSet.filter(element => element !== elementSelected.childNodes[0].textContent)
    majTagTab(elementSelected.childNodes[0].textContent)
    elementSelected.remove()
  } )
  tagCreation()
}

function mainSearch(e) {
  const parent = e.target.parentElement;
  const croix = parent.querySelector(".croix");
  if (e.target.textLength >= 3) {
    croix.style.display = "block";
    searchFilter(e.target);
    //S'il sagit de l'input ingrédient, j'appelle sa fonction.
    //Je regarde ce que l'user à écrit et je compare avec ce qui est présent dans le tableau
  } else {
    croix.style.display = "none";
    allIngredient(ingredientsTab);
    displayRecip(recipes);
    eraseEmptyMessage()
  }
}
function searchFilter(search) {
  if (search.id != "mainSearchBar") {
    const filter = ingredientsTab.filter((ingredient) => {
      return ingredient.indexOf(search.value.toLowerCase()) !== -1;
    });
    allIngredient(filter);
  } else {
    //J'efface les anciennes recette
    const recipContent = document.querySelector(".recetteContent");
    recipContent.innerHTML = "";
    //Je récupère le mot dans le titre, la description et dans les ingrédients
    let filter = recipes.filter((recip) => {
      return (
        recip.name.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
      );
    });
    filter = recipes.filter((recip) => {
      return (
        recip.description.toLowerCase().indexOf(search.value.toLowerCase()) !==
        -1
      );
    });
    const ingredientInrecip = new Set();
    recipes.forEach((element) => {
      element.ingredients.filter((recip) => {
        // console.log(recip.ingredient.toLowerCase());
        // console.log(recip.ingredient.toLowerCase().indexOf(search.value.toLowerCase()) !=-1);
        if (
          recip.ingredient.toLowerCase().indexOf(search.value.toLowerCase()) !=
          -1
        ) {
          return ingredientInrecip.add(element);
          //    return filter.push(element)
        }
      });
    });

    if (filter.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.innerHTML = `« Aucune recette ne contient ${search.value} vous pouvez chercher «
      tarte aux pommes », « poisson », etc.`;
      emptyMessage.classList.add("emptyMessage")
      allRecip.classList.add("emptySearch")
      allRecip.appendChild(emptyMessage);
    }
    displayRecip(filter);
  }
}
function eraseEmptyMessage(){
  if(allRecip.querySelector(".emptyMessage"))
  allRecip.querySelector(".emptyMessage").remove()
  allRecip.classList.remove("emptySearch")
}
function openMenuIngredient() {
  const chevron = document.querySelector("#ingredientFilter img");
  menuIngredientOpen = !menuIngredientOpen;
  if (menuIngredientOpen === true) {
    chevron.style.transform = "rotate(180deg)";
    menuIngredient.classList.add("open");
    const content = document.querySelector("#ingredientFilter .filterOpen");
    content.style.display = "block";
  } else {
    chevron.style.transform = "rotate(0deg)";
    menuIngredient.classList.remove("open");
    const content = document.querySelector("#ingredientFilter .filterOpen");
    content.style.display = "none";
  }
}

function allIngredient(Array) {
  const listContent = document.querySelector("#ingredientFilter .elementList");
  listContent.innerHTML = "";
  const tab = Array.sort((a, b)=>{
    if(a<b){
      return -1
    }else{
      return 1
    }
  })
  tab.forEach((element) => {
    const ingredient = document.createElement("p");
    //Permet de push les élements du tableau dans la page html en rajoutant une majuscule
    ingredient.innerHTML = element.replace(/^./, element[0].toUpperCase());
    listContent.appendChild(ingredient);
    ingredient.addEventListener("click", (e) => {
      const closestList = e.target.closest(".filterOpen");
      const filterContent = closestList.querySelector(".elementSelectContent");
      if(tagSet.find(element=> element == e.target.textContent)){
      }
      else{
        tagSet.push(e.target.textContent)
        addElementSelected(e.target.textContent, filterContent);
      }
    });
  });
}

tagCreation()

function tagCreation(){
  const tagContent = document.getElementById("tagContent")
  tagContent.innerHTML = ""
  tagSet.forEach(element => {
    const tag = document.createElement("div")
    tag.classList.add("tag")
    const tagText = document.createElement("p")
    tagText.innerHTML = element
    const tagDelete = document.createElement("img")
    tagDelete.setAttribute("src", "assets/images/Vector(4).png")
    tagDelete.setAttribute("alt", "Supprimer le tag")

    tag.appendChild(tagText)
    tag.appendChild(tagDelete)
    tagContent.appendChild(tag)

    tagDelete.addEventListener("click",(e)=>{
      // tagSet = tagSet.filter(element => element !== elementSelected.childNodes[0].textContent)

      majTagTab(tagText.textContent)
      tag.remove()
    })

  });

}

function majTagTab(tagDelete){
  tagSet = tagSet.filter(element => element !== tagDelete)
  allIngredient(tagSet)
}
