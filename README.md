## Bonus

 - interceptor
 - websockets
 - détection auto langue/thème

# 🎮 Gamer Profile

Une application web complète pour **gérer et partager votre collection de jeux vidéo**, vos **codes amis** et **suivre votre progression**.

---

## 📚 Sommaire

- [✨ Fonctionnalités](#-fonctionnalités)
  - [🎮 Gestion des jeux](#-gestion-des-jeux)
  - [🤝 Codes amis](#-codes-amis)
  - [🔐 Authentification](#-authentification)
  - [🖥️ Interface utilisateur](#️-interface-utilisateur)
- [🛠️ Technologies utilisées](#-technologies-utilisées)
  - [🧩 Frontend](#-frontend)
  - [🧪 Backend](#-backend)
- [⚙️ Installation](#-installation)

---

## ✨ Fonctionnalités

### 🎮 Gestion des jeux
- 📚 **Catalogue complet** : Parcourez une base de données de jeux avec images, descriptions et métadonnées.
- ✅ **Suivi de progression** : Marquez vos jeux comme "Fini", "En cours", ou "Fini, joue encore".
- 🎒 **Collection personnelle** : Créez et gérez votre propre bibliothèque de jeux.
- 🔍 **Recherche avancée** : Recherchez par nom, console, ou année de sortie.
- 📊 **Statistiques** : Visualisez votre activité avec des graphiques interactifs.

### 🤝 Codes amis
- 🎮 **Gestion centralisée** : Stockez vos codes pour Switch, PSN, Xbox Live, Steam, etc.
- 🔍 **Recherche & filtrage** : Trouvez facilement vos amis selon les jeux ou plateformes.
- 📱 **Support multi-plateformes** : Interface fluide adaptée aux différents supports.

### 🔐 Authentification
- 📝 **Inscription & Connexion** : Système sécurisé basé sur JWT.
- 👤 **Profils utilisateurs** : Personnalisation des comptes.
- 🛡️ **Sécurité** : Middleware d’authentification pour protéger les routes sensibles.

### 🖥️ Interface utilisateur
- 📱 **Responsive design** : Adaptée aux mobiles, tablettes et ordinateurs.
- 🌗 **Thème clair/sombre** : Bascule entre les modes selon votre préférence.
- 🌍 **Multilingue** : Support du Français et de l’Anglais (via i18next).
- 🔔 **Notifications toast** : Feedback visuel des actions utilisateur.

---

## 🛠️ Technologies utilisées

### 🧩 Frontend
- **React 18** — Interfaces dynamiques
- **Vite** — Bundler ultra-rapide
- **React Router DOM** — Navigation et routage
- **Axios** — Requêtes API
- **React Icons** — Bibliothèque d’icônes SVG
- **React Select** — Menus de sélection personnalisables
- **React Toastify** — Notifications toast
- **Recharts** — Graphiques et visualisation
- **Socket.io Client** — Communication en temps réel
- **i18next** — Internationalisation

---

## ⚙️ Installation

```bash
git clone https://github.com/votre-utilisateur/gamer-profile.git
cd gamer-profile
npm install
npm run dev