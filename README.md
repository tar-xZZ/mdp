# 🔐 Générateur de Mot de Passe

Générateur de mots de passe sécurisé avec analyse d'entropie en temps réel.

**Live** → [tar-xzz.github.io/mdp](https://tar-xzz.github.io/mdp/)

---

## Fonctionnalités

- Génération cryptographique (`crypto.getRandomValues`)
- Choix du jeu de caractères (majuscules, minuscules, chiffres, symboles, latin-1…)
- Caractères custom libres
- Longueur variable de 4 à 64 caractères
- Analyse de sécurité en temps réel :
  - Entropie en bits
  - Taille de l'alphabet
  - Nombre de combinaisons possibles
  - Temps estimé de crack (brute force GPU)

---

## Structure

```
mdp/
├── index.html        → structure HTML
├── css/
│   └── style.css     → thème sombre, layout, composants
├── js/
│   └── app.js        → génération, analyse, listeners
└── README.md
```

---

## Stack

HTML · CSS · JavaScript vanilla — aucune dépendance, aucun framework.
