import { createElement } from './factory.js';
import { setupFilterSearch } from './filterSearch.js';
import { tags } from '../data/tags.js';
import { recipes } from '../data/recipes.js';

let activeTags = { ingredients: [], appliances: [], utensils: [] };

function updateRecipeCount(count) {
    const recipeCountElement = document.getElementById('recipe-count');
    recipeCountElement.textContent = `${count} recette${count > 1 ? 's' : ''}`;
}


function createIngredientsList(ingredients) {
    const ingredientsContainer = createElement('ul', { class: 'list-unstyled' });
    ingredients.forEach(ing => {
        const ingredientItem = createElement('li', {});
        const ingredientName = createElement('span', { class: 'ingredient-item' }, [document.createTextNode(ing.ingredient)]);
        ingredientItem.appendChild(ingredientName);
        if (ing.quantity) {
            ingredientItem.appendChild(document.createElement('br'));
            const quantitySpan = createElement('span', { class: 'quantity-unit' }, [document.createTextNode(ing.quantity)]);
            ingredientItem.appendChild(quantitySpan);
        }
        if (ing.unit) {
            ingredientItem.appendChild(document.createTextNode(' '));
            const unitSpan = createElement('span', { class: 'quantity-unit' }, [document.createTextNode(ing.unit)]);
            ingredientItem.appendChild(unitSpan);
        }
        ingredientsContainer.appendChild(ingredientItem);
    });
    return ingredientsContainer;
}


function createRecipeCard(recipe) {
    return createElement('div', { class: 'col-md-4 mb-4' }, [
        createElement('div', { class: 'card' }, [
            createElement('img', { src: `../assets/jsonrecipes/${recipe.image}`, alt: recipe.name, class: 'card-img-top' }, []),
            createElement('div', { class: 'card-body' }, [
                createElement('h5', { class: 'card-title' }, [document.createTextNode(recipe.name)]),
                createElement('div', { class: 'recipe-section' }, [
                    createElement('h6', { class: 'section-title' }, [document.createTextNode('Recette')]),
                    createElement('p', { class: 'recipe-description' }, [document.createTextNode(recipe.description)])
                ]),
                createElement('div', { class: 'ingredients-section' }, [
                    createElement('h6', { class: 'section-title' }, [document.createTextNode('Ingrédients')]),
                    createIngredientsList(recipe.ingredients)
                ])
            ]),
            createElement('span', { class: 'time-badge' }, [document.createTextNode(`${recipe.time} min`)]),
        ])
    ]);
}


function displayRecipes(recipesList) {
    const recipesContainer = document.getElementById('recipes-container');
    recipesContainer.innerHTML = ''; 

    recipesList.forEach(recipe => {
        recipesContainer.appendChild(createRecipeCard(recipe));
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

/*  
--------------------------------------------------------
🔵 MÉTHODE 1 : Version avec boucles classiques
--------------------------------------------------------
*/
function filterRecipes() {
    const searchQuery = document.getElementById('main-search').value.toLowerCase();

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch =
            searchQuery.length < 3 ||
            recipe.name.toLowerCase().includes(searchQuery) ||
            recipe.description.toLowerCase().includes(searchQuery) ||
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(searchQuery));

        const matchesTags = Object.entries(activeTags).every(([type, tags]) => {
            if (tags.length === 0) return true;
            if (type === 'ingredients') return tags.every(tag => recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === tag));
            if (type === 'appliances') return tags.every(tag => recipe.appliance.toLowerCase() === tag);
            if (type === 'utensils') return tags.every(tag => recipe.ustensils.some(ut => ut.toLowerCase() === tag));
            return true;
        });

        return matchesSearch && matchesTags;
    });

    displayRecipes(filteredRecipes);

    if (filteredRecipes.length === 0) {
        document.getElementById('recipes-container').innerHTML = `<p class="text-center">Aucune recette ne correspond à votre recherche.</p>`;
    }
}

/*  
--------------------------------------------------------
🔴 MÉTHODE 2 
--------------------------------------------------------
*/
function filterRecipesFunctional() {
    const searchQuery = document.getElementById('main-search').value.toLowerCase();

    const filteredRecipes = recipes
        .map(recipe => ({
            ...recipe,
            ingredientsText: recipe.ingredients.map(ing => ing.ingredient.toLowerCase()).join(' ')
        })) // 🔹 Transforme les recettes pour inclure un texte contenant tous les ingrédients
        .filter(recipe => 
            searchQuery.length < 3 ||
            recipe.name.toLowerCase().includes(searchQuery) ||
            recipe.description.toLowerCase().includes(searchQuery) ||
            recipe.ingredientsText.includes(searchQuery)
        ); // 🔹 Filtre les recettes avec `filter()`

    displayRecipes(filteredRecipes);
}

// 🔄 CHOISIR QUELLE MÉTHODE UTILISER
function applySearch() {
    const useFunctionalMethod = false; // ⬅ Change à `false` pour tester la première méthode
    if (useFunctionalMethod) {
        filterRecipesFunctional();
    } else {
        filterRecipes();
    }
}

function setupMainSearch() {
    const searchInput = document.getElementById('main-search');
    const searchButton = document.querySelector('.search-button');

    searchInput.addEventListener('input', applySearch);
    searchButton.addEventListener('click', applySearch);
}


function init() {
    setupMainSearch();
    displayRecipes(recipes); 
}

export { filterRecipes, filterRecipesFunctional, activeTags };
init();
