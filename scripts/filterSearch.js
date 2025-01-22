import { createElement } from './factory.js';
import { tags } from '../data/tags.js';

export function setupFilterSearch(type) {
    const searchInput = document.querySelector(`#${type}DropdownSearch`);
    const dropdownMenu = document.querySelector(`#${type}DropdownMenu`);

    // Affiche tous les tags initiaux au chargement
    updateDropdownMenu(type, tags[type], dropdownMenu);

    // Ajoute un gestionnaire d'événement pour la recherche
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();

        const filteredTags = tags[type].filter(tag => tag.includes(query));

        updateDropdownMenu(type, filteredTags, dropdownMenu);
    });
}

function updateDropdownMenu(type, items, dropdownMenu) {
    dropdownMenu.innerHTML = ''; // Vide le menu

    items.forEach(item => {
        const listItem = createElement('li', {}, [
            createElement('button', { class: 'dropdown-item', type: 'button' }, [
                document.createTextNode(item),
            ]),
        ]);

        // Ajoute un événement au clic pour gérer la sélection
        listItem.addEventListener('click', () => {
            handleTagSelection(type, item);
        });

        dropdownMenu.appendChild(listItem);
    });
}

function handleTagSelection(type, value) {
    console.log(`${value} sélectionné dans ${type}`);
}
