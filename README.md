📌 Les Petits Plats - Documentation Back-End

🔍 Présentation

Ce projet est une refonte du moteur de recherche de "Les Petits Plats", un site de recettes de cuisine. L’objectif était d’optimiser la recherche et le filtrage des recettes pour une meilleure expérience utilisateur.

🛠️ Fonctionnalités implémentées

Affichage dynamique des recettes depuis un fichier JSON.
Moteur de recherche performant (filtrage sur nom, description et ingrédients).
Filtres avancés par ingrédients, appareils et ustensiles.
Affichage du nombre de recettes en temps réel.


⚙️ Implémentation technique

🔹 Structure du projet

data/recipes.js → Contient les recettes sous forme de tableau JSON.
scripts/renderRecipes.js → Gère l’affichage des recettes et la mise à jour des filtres.
scripts/filterSearch.js → Gère la recherche et les filtres.
scripts/factory.js → Contient des fonctions utilitaires pour générer les éléments HTML.
🔹 Fonctionnement de la recherche
J’ai développé deux méthodes pour la recherche :

Méthode avec boucles classiques (for, while)

Méthode fonctionnelle (filter, map, reduce)

Après test, la méthode fonctionnelle a été retenue pour sa lisibilité et sa facilité de maintenance.

📂 Ce que vous devez adapter côté Back-End

🔹 Remplacer le fichier recipes.js
Actuellement, les recettes sont stockées dans un fichier JS. Il faudra : 

✅ Remplacer cette source par une API REST (exemple : /api/recipes).
✅ Adapter le format de réponse pour correspondre à la structure actuelle.

🔹 Optimiser la recherche côté serveur
Actuellement, la recherche est 100% front-end. Pour une meilleure performance :
✅ Implémenter une recherche full-text en base de données.

🔹 Gestion des filtres
Le filtrage (ingrédients, appareils, ustensiles) est géré en front.
✅ Possibilité de passer ces critères en paramètres d’API.

📌 Points à vérifier
🔎 Assurer que l’API renvoie des données dans le même format que recipes.js.
🔎 Tester la rapidité de la requête côté serveur.
🔎 Vérifier la compatibilité avec les filtres actuels du front.

🚀 Conclusion
Le projet est prêt à être connecté au back-end. L’API devra être optimisée pour offrir une recherche rapide et pertinente aux utilisateurs.
