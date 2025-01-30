import { createElement } from './factory.js';
import { tags } from '../data/tags.js';
import { filterRecipesFunctional, activeTags } from './renderRecipes.js';

export function setupFilterSearch(type) {
    const searchInput = document.querySelector(`#${type}DropdownSearch`);
    const dropdownMenu = document.querySelector(`#${type}DropdownMenu`);
    updateDropdownMenu(type, tags[type], dropdownMenu);

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredTags = tags[type].filter(tag => tag.includes(query));
        updateDropdownMenu(type, filteredTags, dropdownMenu);
    });
}

function updateDropdownMenu(type, items, dropdownMenu) {
    dropdownMenu.innerHTML = ''; 
    items.forEach(item => {
        const listItem = createElement('li', {}, [
            createElement('button', { class: 'dropdown-item', type: 'button' }, [
                document.createTextNode(item),
            ]),
        ]);
        listItem.addEventListener('click', () => {
            handleTagSelection(type, item);
        });
        dropdownMenu.appendChild(listItem);
    });
}

function handleTagSelection(type, value) {
    if (!activeTags[type].includes(value)) {
        activeTags[type].push(value);
        addTag(type, value);
        filterRecipesFunctional();
    }
}

function addTag(type, value) {
    const tagContainer = document.querySelector('.tag-container');
    const tag = createElement('span', { class: 'badge bg-warning text-dark me-2' }, [
        document.createTextNode(value),
        createElement('button', { class: 'btn-close ms-2', 'aria-label': 'Remove' }, [])
    ]);
    tag.querySelector('.btn-close').addEventListener('click', () => {
        removeTag(type, value, tag);
    });
    tagContainer.appendChild(tag);
}
function removeTag(type, value, tagElement) {
    activeTags[type] = activeTags[type].filter(tag => tag !== value);
    tagElement.remove();
    filterRecipesFunctional();
}
