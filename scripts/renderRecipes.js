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
function filterRecipesWithForLoop() {
    const searchQuery = document.getElementById('main-search').value.toLowerCase();
    const filteredRecipes = [];

    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        let matchesSearch = false;

        if (searchQuery.length < 3) {
            matchesSearch = true;
        } else {
            if (recipe.name.toLowerCase().includes(searchQuery)) matchesSearch = true;
            if (recipe.description.toLowerCase().includes(searchQuery)) matchesSearch = true;
            for (let j = 0; j < recipe.ingredients.length; j++) {
                if (recipe.ingredients[j].ingredient.toLowerCase().includes(searchQuery)) {
                    matchesSearch = true;
                    break;
                }
            }
        }

        let matchesTags = true;

        for (const [type, tags] of Object.entries(activeTags)) {
            if (tags.length === 0) continue;
            if (type === 'ingredients') {
                for (let k = 0; k < tags.length; k++) {
                    const tag = tags[k];
                    let found = false;
                    for (let l = 0; l < recipe.ingredients.length; l++) {
                        if (recipe.ingredients[l].ingredient.toLowerCase() === tag) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        matchesTags = false;
                        break;
                    }
                }
            } else if (type === 'appliances') {
                for (let k = 0; k < tags.length; k++) {
                    if (recipe.appliance.toLowerCase() !== tags[k]) {
                        matchesTags = false;
                        break;
                    }
                }
            } else if (type === 'utensils') {
                for (let k = 0; k < tags.length; k++) {
                    const tag = tags[k];
                    let found = false;
                    for (let l = 0; l < recipe.ustensils.length; l++) {
                        if (recipe.ustensils[l].toLowerCase() === tag) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        matchesTags = false;
                        break;
                    }
                }
            }
            if (!matchesTags) break;
        }

        if (matchesSearch && matchesTags) filteredRecipes.push(recipe);
    }

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
        }))
        .filter(recipe => 
            (searchQuery.length < 3 ||
            recipe.name.toLowerCase().includes(searchQuery) ||
            recipe.description.toLowerCase().includes(searchQuery) ||
            recipe.ingredientsText.includes(searchQuery))
            &&
            Object.entries(activeTags).every(([type, tags]) => {
                if (tags.length === 0) return true;

                if (type === 'ingredients') {
                    return tags.every(tag => recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === tag));
                } else if (type === 'appliances') {
                    return tags.every(tag => recipe.appliance.toLowerCase() === tag);
                } else if (type === 'utensils') {
                    return tags.every(tag => recipe.ustensils.some(ut => ut.toLowerCase() === tag));
                }
                return true;
            })
        );
        updateRecipeCount(filteredRecipes.length);
        displayRecipes(filteredRecipes);
}

// 🔄 CHOISIR QUELLE MÉTHODE UTILISER
function applySearch() {
    const useFunctionalMethod = true; // ⬅ Change à `false` pour tester la première méthode
    if (useFunctionalMethod) {
        filterRecipesFunctional();
    } else {
        filterRecipesWithForLoop();
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

export { filterRecipesWithForLoop, filterRecipesFunctional, activeTags };
init();