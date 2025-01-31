# PetitsPlats2.0
P7 JS 2.0 Les petits plats
Deux options sont présentes pour la focntionnalité de recherche, voici comment basucler sur l'option 1 :
// 🔄 CHOISIR QUELLE MÉTHODE UTILISER

function applySearch() {
    const useFunctionalMethod = false; // ⬅ Change à `false` pour tester la première méthode
    if (useFunctionalMethod) {
        filterRecipesFunctional();
    } else {
        filterRecipes();
    }
}

Ici, nous sommes bien sur la première méthode, qui utilise des boucles classiques.
Pour utiliser la deuxième méthode, basculez sur la branche search-with-functional avec la commande suivante :
git checkout search-with-functional