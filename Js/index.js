const allRecip = document.querySelector(".recetteContent");
let ingredientsTab;

const ingredientsSet = new Set();
const ustensilsSet = new Set();
const appareilsSet = new Set();
let tagSet = [];

const mainSearchBar = document.getElementById("mainSearchBar");
const deleteText = document.querySelector(".deleteText");

const menuSearch = document.querySelectorAll(".searchFilter");

init();

function init() {
  mainSearchBar.value = "";
  displayRecip(recipes);
  ingredientsTab = Array.from(ingredientsSet);
  appareilTab = Array.from(appareilsSet);
  ustensilTab = Array.from(ustensilsSet);
  fillMenu(ingredientsSet, appareilsSet, ustensilsSet);
}

function quantityRecip(array) {
  const quantity = document.getElementById("recipQuantity");
  quantity.innerHTML = `${array.length} recettes`;
}

function displayRecip(array) {
  quantityRecip(array);
  array.forEach((element) => {
    //Création de la partie haute de la card
    const recipCard = document.createElement("div");
    recipCard.classList.add("recetteCard");

    const img = document.createElement("img");
    img.setAttribute("src", `./Plat_Photo/${element.image}`);
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

    element.ustensils.forEach((ustensil) => {
      ustensilsSet.add(ustensil.toLowerCase());
    });
    appareilsSet.add(element.appliance.toLowerCase());

    recipCard.appendChild(description);
    description.appendChild(recipTitle);
    description.appendChild(recip);
    description.appendChild(instruction);
    description.appendChild(ingredients);
    description.appendChild(ingredientContent);
  });
}
function fillMenu(ingredientsSet, appareilsSet) {
  const menu = document.querySelectorAll(".topFiltre");
  menu.forEach((element) => {
    element.addEventListener("click", () => {
      let array = [];
      const chevron = element.children[1];
      const IsOpen = element.parentElement;
      const content = element.nextElementSibling;
      openMenu(chevron, IsOpen, content);
      switch (IsOpen.id) {
        case "ingredientFilter":
          array = ingredientsTab;
          break;
        case "appareilFilter":
          array = appareilTab;
          break;
        case "ustensileFilter":
          array = ustensilTab;
          break;
        default:
          console.log("Pas de menu ouvert reconnu");
      }
      const listContent = IsOpen.children[1].children[2];
      listElementMenu(array, listContent);
    });
  });
}

menuSearch.forEach((menu) => {
  menu.addEventListener("input", menusSearch);
  menu.addEventListener("keydown", (e) => {
    const closestList = e.target.closest(".filterOpen");
    pressEnterFilter(e, closestList);
  });
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
    if (tagSet.find((element) => element == firstElement)) {
    } else {
      tagSet.push(firstElement);
      addElementSelected(firstElement, filterContent);
    }
  }
}

function addElementSelected(input, filterContent) {
  //Je créé un tableau pour regroup tous les éléments sélectionnés
  filterContent.style.display = "flex";
  const elementSelected = document.createElement("div");
  elementSelected.classList.add("elementSelect");
  const element = document.createElement("p");
  element.innerHTML = input.replace(/^./, input[0].toUpperCase());
  elementSelected.appendChild(element);
  filterContent.appendChild(elementSelected);
  const deleteContent = document.createElement("div");
  deleteContent.classList.add("deleteFilterContent");
  const deleteFilter = document.createElement("img");
  deleteFilter.setAttribute("src", "assets/images/FilterQuit.png");
  deleteFilter.setAttribute("alt", "Supprimer le filtre");
  elementSelected.appendChild(deleteContent);
  deleteContent.appendChild(deleteFilter);

  elementSelected.addEventListener("mouseenter", () => {
    element.style.fontWeight = 700;
    deleteContent.style.display = "flex";
  });
  elementSelected.addEventListener("mouseleave", () => {
    element.style.fontWeight = 400;
    deleteContent.style.display = "none";
  });
  deleteContent.addEventListener("click", () => {
    majTagTab(elementSelected.childNodes[0].textContent);
    elementSelected.remove();
  });
  tagCreation();
}

function openMenu(chevron, IsOpen, content) {
  if (IsOpen.classList[1] == "open") {
    chevron.style.transform = "rotate(0deg)";
    IsOpen.classList.remove("open");
    content.style.display = "none";
  } else {
    chevron.style.transform = "rotate(180deg)";
    IsOpen.classList.add("open");
    content.style.display = "block";
    content.children[0].children[0].value = "";
  }
}

function mainSearch(e) {
  const parent = e.target.parentElement;
  const croix = parent.querySelector(".croix");

  if (e.target.textLength >= 3) {
    croix.style.display = "block";
    // searchMain(e.target, searchMainBar);
    searchMain(e.target, searchMainBarAlternate);
  } else {
    croix.style.display = "none";
    const recipContent = document.querySelector(".recetteContent");
    recipContent.innerHTML = "";
    displayRecip(recipes);
    eraseEmptyMessage();
  }
}

function menusSearch(e) {
  const parent = e.target.parentElement;
  const croix = parent.querySelector(".croix");
  const listContentParent = parent.closest(".filtre");
  //Si l'user à taper plus de 2 lettres dans la barre de recherche
  //J'affiche la croix et je lance la recherche
  if (e.target.textLength >= 3) {
    croix.style.display = "block";
    searchFilter(e.target, listContentParent);
    //S'il sagit de l'input ingrédient, j'appelle sa fonction.
    //Je regarde ce que l'user à écrit et je compare avec ce qui est présent dans le tableau
  } else {
    let menuTab;
    NameMenu = listContentParent.id;
    switch (NameMenu) {
      case "ingredientFilter":
        menuTab = ingredientsTab;
        break;
      case "appareilFilter":
        menuTab = appareilTab;
        break;
      case "ustensileFilter":
        menuTab = ustensilTab;
      default:
        console.log("Pas de menu trouvé");
    }

    const listContent = listContentParent.querySelector(".elementList");
    listElementMenu(menuTab, listContent);
    croix.style.display = "none";
    displayRecip(recipes);
    eraseEmptyMessage();
  }
}

function searchFilter(search, listContentParent) {
  const listContent = listContentParent.querySelector(".elementList");
  let menuTab;
  if (search.id != "mainSearchBar") {
    NameMenu = listContentParent.id;
    switch (NameMenu) {
      case "ingredientFilter":
        menuTab = ingredientsTab;
        break;
      case "appareilFilter":
        menuTab = appareilTab;
        break;
      case "ustensileFilter":
        menuTab = ustensilTab;
      default:
        console.log("Pas de menu trouvé");
    }

    const filter = menuTab.filter((ingredient) => {
      return ingredient.indexOf(search.value.toLowerCase()) !== -1;
    });
    listElementMenu(filter, listContent);
  }
}

function searchMain(search, filterMethod) {
  const recipContent = document.querySelector(".recetteContent");
  recipContent.innerHTML = "";

  const searchResult = filterMethod(search.value, recipes);

  displayRecip(searchResult);
  if (searchResult.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.innerHTML = `« Aucune recette ne contient ${search.value} vous pouvez chercher «
    tarte aux pommes », « poisson », etc.`;
    emptyMessage.classList.add("emptyMessage");
    allRecip.classList.add("emptySearch");
    allRecip.appendChild(emptyMessage);
  }
}
function searchWithFilter(filterMethod) {
  const recipContent = document.querySelector(".recetteContent");
  recipContent.innerHTML = "";
  //Besoin de créer une boucle pour chaque tag de la liste
  const search = document.querySelectorAll(".tag");
  let searchResult;
  if(search.length == 0){
    const recipContent = document.querySelector(".recetteContent");
    recipContent.innerHTML = "";
    displayRecip(recipes);
    eraseEmptyMessage();

  }
  else{
    eraseEmptyMessage();
    searchResult = filterMethod(search[0].firstChild.textContent, recipes);
  
    //Je filtre mais à partir des résultats précédent et non plus à partir de toutes les recettes
    if (search.length > 1) {
      search.forEach((element) => {
      searchResult = filterMethod(element.textContent, searchResult);
      });
    }
    displayRecip(searchResult);
    if (searchResult.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.innerHTML = `« Aucune recette ne contient ${search.value} vous pouvez chercher «
      tarte aux pommes », « poisson », etc.`;
      emptyMessage.classList.add("emptyMessage");
      allRecip.classList.add("emptySearch");
      allRecip.appendChild(emptyMessage);
    }
  }

}

function searchMainBarAlternate(searchText, array) {
  //Inverse le filter .map et les autres, le but est d'obtenir d'abord
  //les recettes filtrer dans la desc et le titre pour ensuite .map les recettes restantes
  let filter = [];
  let recipFiltered = array.map((recette) => {
    return {
      ...recette,
      ingredientFlattened: recette.ingredients
        .map((ingredient) => ingredient.ingredient)
        .join(", "),
    };
  });

  filter.push(
    recipFiltered.filter((recip) => {
      return recip.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
    })
  );

  filter.push(
    recipFiltered.filter((recip) => {
      return (
        recip.description.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
      );
    })
  );

  filter.push(
    recipFiltered.filter((recette) => {
      return recette.ingredientFlattened
        .toLowerCase()
        .includes(searchText.toLowerCase());
    })
  );
  filter = filter.flat(Infinity);
  filter = new Set(filter);

  return Array.from(filter);
}

function pushInArray(array, set) {
  array.forEach((element) => {
    set.add(element);
  });
  return set;
}

function searchMainBar(searchText) {
  let recipFiltered = new Set();

  //Je regarde dans toutes les recettes, quelle recette à le mot dans son nom.
  let filter = recipes.filter((recip) => {
    return recip.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
  });
  pushInArray(filter, recipFiltered);

  filter = recipes.filter((recip) => {
    return (
      recip.description.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    );
  });
  pushInArray(filter, recipFiltered);

  recipes.forEach((element) => {
    element.ingredients.forEach((recip) => {
      if (
        recip.ingredient.toLowerCase().indexOf(searchText.toLowerCase()) != -1
      ) {
        return filter.push(element);
      }
    });
  });
  pushInArray(filter, recipFiltered);

  return Array.from(recipFiltered);
}

function eraseEmptyMessage() {
  if (allRecip.querySelector(".emptyMessage"))
    allRecip.querySelector(".emptyMessage").remove();
  allRecip.classList.remove("emptySearch");
}

function listElementMenu(Array, listContent) {
  listContent.innerHTML = "";
  const tab = Array.sort((a, b) => {
    if (a > b) {
      return 1;
    }
  });
  tab.forEach((element) => {
    const ingredient = document.createElement("p");
    //Permet de push les élements du tableau dans la page html en rajoutant une majuscule
    ingredient.innerHTML = element.replace(/^./, element[0].toUpperCase());
    listContent.appendChild(ingredient);
    ingredient.addEventListener("click", (e) => {
      const closestList = e.target.closest(".filterOpen");
      const filterContent = closestList.querySelector(".elementSelectContent");
      if (tagSet.find((element) => element == e.target.textContent)) {
      } else {
        tagSet.push(e.target.textContent);
        addElementSelected(e.target.textContent, filterContent);
      }
      searchWithFilter(searchMainBarAlternate);
    });
  });
}

tagCreation();

function tagCreation() {
  const tagContent = document.getElementById("tagContent");
  tagContent.innerHTML = "";
  tagSet.forEach((element) => {
    const tag = document.createElement("div");
    tag.classList.add("tag");
    const tagText = document.createElement("p");
    tagText.innerHTML = element;
    const tagDelete = document.createElement("img");
    tagDelete.setAttribute("src", "assets/images/Vector(4).png");
    tagDelete.setAttribute("alt", "Supprimer le tag");

    tag.appendChild(tagText);
    tag.appendChild(tagDelete);
    tagContent.appendChild(tag);

    tagDelete.addEventListener("click", (e) => {

      majTagTab(tagText.textContent);
      deleteTag(e.target.previousElementSibling.textContent);
      tag.remove();
    });
  });
}

function deleteTag(tag) {
  const filtreTab = document.querySelectorAll(".elementSelect");
  filtreTab.forEach((element) => {
    if (element.firstChild.textContent == tag) {
      element.remove();
    }
   
  });
}

function majTagTab(tagDelete) {
  tagSet = tagSet.filter((element) => element !== tagDelete);
  tagCreation();
  searchWithFilter(searchMainBarAlternate)
}
