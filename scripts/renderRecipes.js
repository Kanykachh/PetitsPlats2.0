import { createElement } from './factory.js';
import { setupFilterSearch } from './filterSearch.js';
import { tags } from '../data/tags.js';
import { recipes } from '../data/recipes.js';

let activeTags = { ingredients: [], appliances: [], utensils: [] };


function updateRecipeCount(count) {
    const recipeCountElement = document.getElementById('recipe-count');
    recipeCountElement.textContent = `${count} recette${count > 1 ? 's' : ''}`;
}

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

function displayRecipes(recipesList) {
    const recipesContainer = document.getElementById('recipes-container');
    recipesContainer.innerHTML = ''; 
    recipesList.forEach(recipe => {
        const recipeCard = createRecipeCard(recipe);
        recipesContainer.appendChild(recipeCard);
    });
    updateFilters(recipesList); 
    updateRecipeCount(recipesList.length); 
}

function updateFilters(recipesList) {
    const ingredientsSet = new Set();
    const appliancesSet = new Set();
    const utensilsSet = new Set();

    recipesList.forEach(recipe => {
        recipe.ingredients.forEach(ing => ingredientsSet.add(ing.ingredient.toLowerCase()));
        appliancesSet.add(recipe.appliance.toLowerCase());
        recipe.ustensils.forEach(ut => utensilsSet.add(ut.toLowerCase()));
    });

    tags.ingredients = Array.from(ingredientsSet);
    tags.appliances = Array.from(appliancesSet);
    tags.utensils = Array.from(utensilsSet);

    setupFilterSearch('ingredients');
    setupFilterSearch('appliances');
    setupFilterSearch('utensils');
}

function filterRecipes() {
    const searchQuery = document.getElementById('main-search').value.toLowerCase();

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch =
            searchQuery.length < 3 || // Ignore search if fewer than 3 characters
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

    if (filteredRecipes.length === 0) {
        document.getElementById('recipes-container').innerHTML = `<p class="text-center">Aucune recette ne correspond à votre recherche.</p>`;
    }
}


function setupMainSearch() {
    const searchInput = document.getElementById('main-search');
    const searchButton = document.querySelector('.search-button');

    searchInput.addEventListener('input', () => {
        filterRecipes();
    });

 
    searchButton.addEventListener('click', () => {
        filterRecipes();
    });
}


function init() {
    setupMainSearch(); 
    displayRecipes(recipes); 
}

export { filterRecipes, activeTags };
init();
