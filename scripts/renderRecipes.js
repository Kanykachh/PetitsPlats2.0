import { createElement } from './factory.js';
import { setupFilterSearch } from './filterSearch.js';
import { tags } from '../data/tags.js';
import { recipes } from '../data/recipes.js';

let activeTags = { ingredients: [], appliances: [], utensils: [] };

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

function init() {
    displayRecipes(recipes);
}

init();
