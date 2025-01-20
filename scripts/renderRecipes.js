import { createElement } from './factory.js';
import { recipes } from '../data/recipes.js';

// Variables globales
let activeTags = { ingredients: [], appliances: [], utensils: [] };

// Fonction pour générer les cartes HTML des recettes
function createRecipeCard(recipe) {
  const ingredientsList = recipe.ingredients.map(ingredient => {
    return createElement('li', {}, [
      document.createTextNode(`${ingredient.ingredient}${ingredient.quantity ? ': ' + ingredient.quantity : ''}${ingredient.unit ? ' ' + ingredient.unit : ''}`)
    ]);
  });

  const card = createElement('div', { class: 'col-md-4 mb-4' }, [
    createElement('div', { class: 'card' }, [
      createElement('img', { src: `../assets/jsonrecipes/${recipe.image}`, alt: recipe.name, class: 'card-img-top' }, []),
      createElement('div', { class: 'card-body' }, [
        createElement('h5', { class: 'card-title' }, [document.createTextNode(recipe.name)]),
        createElement('p', { class: 'card-text' }, [document.createTextNode(recipe.description)]),
        createElement('ul', { class: 'list-unstyled' }, ingredientsList)
      ]),
      createElement('span', { class: 'time-badge' }, [document.createTextNode(`${recipe.time} min`)]),
    ])
  ]);

  return card;
}

// Fonction pour afficher les recettes dans le conteneur
function displayRecipes(recipesList) {
  const recipesContainer = document.getElementById('recipes-container');
  recipesContainer.innerHTML = ''; // Vider le conteneur avant d'ajouter les recettes
  recipesList.forEach(recipe => {
    const recipeCard = createRecipeCard(recipe);
    recipesContainer.appendChild(recipeCard);
  });
  updateFilters(recipesList);
}

// Fonction pour mettre à jour les filtres dynamiques
function updateFilters(recipesList) {
  const ingredientsSet = new Set();
  const appliancesSet = new Set();
  const utensilsSet = new Set();

  recipesList.forEach(recipe => {
    recipe.ingredients.forEach(ing => ingredientsSet.add(ing.ingredient.toLowerCase()));
    appliancesSet.add(recipe.appliance.toLowerCase());
    recipe.ustensils.forEach(ut => utensilsSet.add(ut.toLowerCase()));
  });

  populateDropdown('ingredientsDropdown', Array.from(ingredientsSet));
  populateDropdown('appliancesDropdown', Array.from(appliancesSet));
  populateDropdown('utensilsDropdown', Array.from(utensilsSet));
}

// Fonction pour remplir un dropdown
function populateDropdown(dropdownId, items) {
  const dropdownMenu = document.getElementById(dropdownId).nextElementSibling;
  dropdownMenu.innerHTML = '';
  items.forEach(item => {
    const li = createElement('li', {}, [
      createElement('button', { class: 'dropdown-item', type: 'button' }, [document.createTextNode(item)])
    ]);
    li.addEventListener('click', () => handleTagSelection(dropdownId, item));
    dropdownMenu.appendChild(li);
  });
}

// Fonction pour gérer la sélection d'un tag
function handleTagSelection(type, value) {
  const tagType = type.replace('Dropdown', '').toLowerCase();
  if (!activeTags[tagType].includes(value)) {
    activeTags[tagType].push(value);
    addTag(tagType, value);
    filterRecipes();
  }
}

// Fonction pour ajouter un tag visuel
function addTag(type, value) {
  const tagContainer = document.querySelector('.tag-container');
  const tag = createElement('span', { class: 'badge bg-primary me-2' }, [
    document.createTextNode(value),
    createElement('button', { class: 'btn-close ms-2', 'aria-label': 'Remove' }, [])
  ]);
  tag.querySelector('.btn-close').addEventListener('click', () => removeTag(type, value, tag));
  tagContainer.appendChild(tag);
}

// Fonction pour retirer un tag
function removeTag(type, value, tagElement) {
  activeTags[type] = activeTags[type].filter(tag => tag !== value);
  tagElement.remove();
  filterRecipes();
}

// Fonction pour filtrer les recettes en fonction des tags et de la recherche
function filterRecipes() {
  const searchQuery = document.getElementById('main-search').value.toLowerCase();
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = searchQuery.length < 3 ||
      recipe.name.toLowerCase().includes(searchQuery) ||
      recipe.description.toLowerCase().includes(searchQuery) ||
      recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(searchQuery));

    const matchesTags = Object.entries(activeTags).every(([type, tags]) => {
      if (tags.length === 0) return true;
      if (type === 'ingredients') {
        return tags.every(tag => recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === tag));
      } else if (type === 'appliances') {
        return tags.every(tag => recipe.appliance.toLowerCase() === tag);
      } else if (type === 'utensils') {
        return tags.every(tag => recipe.ustensils.some(ut => ut.toLowerCase() === tag));
      }
      return true;
    });

    return matchesSearch && matchesTags;
  });

  displayRecipes(filteredRecipes);
}

// Initialisation avec gestion de la recherche
function init() {
  const searchInput = document.getElementById('main-search');
  const tagContainer = document.createElement('div');
  tagContainer.classList.add('tag-container', 'mb-3');
  searchInput.parentNode.insertBefore(tagContainer, searchInput.nextSibling);

  // Écouteur d'événements pour la barre de recherche
  searchInput.addEventListener('input', (e) => {
    filterRecipes();
  });

  // Affichage initial des recettes
  displayRecipes(recipes);
}

init();
