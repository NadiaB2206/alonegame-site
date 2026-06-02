# AZUR IMMO — Site vitrine

Intégration HTML/CSS/JS pur de la page d'accueil AZUR IMMO (projet portfolio).
Destiné à être hébergé sur `azur-immo.nadiaui.fr` puis intégré dans le portfolio WordPress/Elementor.

## Structure

```
azur-immo/
├── index.html      → page d'accueil
├── style.css       → styles (palette blanc / bleu ciel / noir)
├── script.js       → menu mobile, apparition au scroll, formulaires
└── assets/         → images (à déposer)
```

## Assets à déposer dans `assets/`

Le site fonctionne **sans assets** (logo en SVG inline + placeholders bleus).
Pour la version finale, dépose les fichiers suivants en gardant ces noms :

| Fichier | Usage |
|---|---|
| `agence-nantes.jpg` | Carte agence Nantes (photo maison) |
| `agence-paris.jpg`  | Carte agence Paris |
| `agence-lyon.jpg`   | Carte agence Lyon |
| `carte-france.svg`  | Carte interactive des régions |
| `maison-1.jpg` … `maison-5.jpg` | Bande d'images en bas de page |
| `logo.svg` *(optionnel)* | Logo officiel si tu veux remplacer le SVG inline |

> Les images manquantes affichent automatiquement un dégradé bleu (placeholder),
> donc rien ne casse tant que tu n'as pas les visuels.

## Personnalisation rapide

- **Couleurs** : variables CSS en haut de `style.css` (`:root`).
- **Typo** : actuellement *Poppins* (placeholder). À remplacer par la typo Figma
  (ligne `<link>` dans `index.html` + variable `--font`).
- **Forme « maison »** : `clip-path` sur `.agency-photo` et `.house-shape`.

## À faire une fois le Figma reçu

- [ ] Confirmer la typo exacte
- [ ] Récupérer les couleurs/espacements précis (via MCP Figma)
- [ ] Intégrer les vraies photos + le logo officiel
- [ ] Brancher la carte de France cliquable (SVG régions)
- [ ] Pages secondaires (À propos, Nos biens, Contact, Connexion)
