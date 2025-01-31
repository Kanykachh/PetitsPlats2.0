# PetitsPlats2.0
P7 JS 2.0 Les petits plats
Deux options sont présentes pour la focntionnalité de recherche, voici comment basucler sur l'option 2 :
// 🔄 CHOISIR QUELLE MÉTHODE UTILISER

function applySearch() {
    const useFunctionalMethod = true; // ⬅ Change à `true` pour tester la deuxieme méthode
    if (useFunctionalMethod) {
        filterRecipesFunctional();
    } else {
        filterRecipes();
    }
}

Ici, nous sommes bien sur la deuxieme méthode, qui utilise des methodes fonctionnelles.
Pour utiliser la première méthode, basculez sur la branche search-with-loops avec la commande suivante :
git checkout search-with-loops