#  Quiz Culture Générale

Une application web de quiz interactive développée avec React et TypeScript.

---

##  Description

Quiz Culture Générale est une application qui permet de tester ses connaissances sur une variété de sujets. Les questions sont récupérées dynamiquement depuis l'API **Open Trivia DB**. Le joueur peut choisir sa catégorie et son niveau de difficulté avant de commencer.

---

##  Fonctionnalités


- Choix de la **difficulté** (Facile, Moyen, Difficile)
- Choix de la **catégorie** (Culture générale, Sport, Histoire, Science, Films, Musique, Jeux vidéo)
- Feedback visuel **vert/rouge** sur les réponses pour correct et incorrect
- Barre de progression en temps réel
- Confettis si score **≥ 7/10**
- Bouton **Rejouer** pour recommencer
- Bouton **Quitter** pour revenir à l'accueil
- Design **responsive** (mobile & desktop)
- Animations de transition entre les questions

---

## Technologies utilisées

| Technologie | Rôle |
|-------------|------|
| React 19 | Framework front-end |
| TypeScript | Typage statique |
| Vite | Bundler et serveur de développement |
| CSS | Styles et animations |
| Open Trivia DB | API des questions |
| canvas-confetti | Animation confettis |

---

## Comment lancer le projet

### Prérequis
- Node.js installé sur votre machine

### Installation
```bash
# Cloner le dépôt
git clone https://github.com/fatouka929-cmd/quiz-culture-generale

# Aller dans le dossier
cd quiz-culture-generale

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur **http://localhost:5173**

---

## Structure du projet
```
src/
├── App.tsx       # Composant principal + logique du quiz
├── Api.tsx       # Appels API + utilitaires
├── App.css       # Styles et animations
├── main.tsx      # Point d'entrée React
└── index.css     # Styles globaux
```