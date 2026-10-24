# Shopy.tn

Prototype frontend d'une boutique de déstockage tunisienne, réalisé avec React 19 et React Router. Les produits et prix sont des données locales fictives ; aucune API, commande réelle ni fonctionnalité de paiement n'est utilisée.

## Démarrer

```bash
npm install
npm start
```

L'application est disponible sur http://localhost:3000. Pour créer la version de production : `npm run build`.

## Fonctionnalités

- Accueil, catalogue filtrable, recherche instantanée, fiches produit, favoris, panier et formulaire de checkout de démonstration.
- 32 produits de démonstration dans six catégories, avec prix en DT, marques fictives ou indicatives, réductions calculées et stocks indicatifs. La sélection « populaires » est éditoriale et ne repose pas sur des données de ventes.
- Panier, favoris, langue et thème mémorisés dans le stockage local du navigateur.
- Interface française, anglaise et arabe (RTL), thème clair/sombre respectant le système à la première visite.
- Mise en page responsive, navigation clavier, formulaires accessibles et états vides.

Les photos utilisent des URL d'images Unsplash et nécessitent une connexion internet. Le formulaire de checkout ne sauvegarde ni ne transmet les coordonnées saisies.
