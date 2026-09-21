# Architecture Front-End - Guide de l'Équipe

Ce document définit l'architecture, les conventions et les bonnes pratiques à respecter par toute l'équipe front-end pour garantir un code propre, maintenable et évolutif.

## 🛠️ Stack Technique
* **Framework :** Next.js (App Router)
* **Langage :** TypeScript (Strict mode)
* **Stylisation :** Tailwind CSS **v4** (Pur)
* **Formatage :** Prettier (avec `prettier-plugin-tailwindcss`)
* **Gestionnaire de paquets :** npm (avec `package-lock.json`)

---

## 🚀 Installation et Lancement

### 1. Cloner le projet
Clonez le dépôt distant et placez-vous dans le répertoire du projet :
```bash
git clone https://github.com/Vivien-Pain/frontSAE.git
cd frontSAE
```

### 2. Installer les dépendances
Installez l'ensemble des modules requis via `npm` :
```bash
npm install
```
*(ou `npm ci` pour une installation strictement alignée avec le `package-lock.json`)*

### 3. Variables d'environnement *(si applicable)*
Si votre configuration requiert des variables locales (connexion à l'API Symfony, etc.) :
```bash
cp .env.example .env.local
```
Pensez à adapter les valeurs dans `.env.local`.

### 4. Démarrer en développement
Lancez le serveur de développement :
```bash
npm run dev
```
L'application est disponible à l'adresse : [http://localhost:3000](http://localhost:3000).

### 5. Scripts disponibles
* `npm run dev` : Démarre le serveur de développement.
* `npm run build` : Compile le projet pour la production.
* `npm run start` : Démarre le serveur Next.js en mode production après le build.
* `npm run lint` : Exécute ESLint pour vérifier la conformité du code.

---

## 📂 Arborescence du Projet

L'application est structurée selon les conventions de l'App Router de Next.js dans le répertoire `src/` :

```text
frontSAE/
├── public/                 # Fichiers statiques publics (logos, icônes, images)
├── src/
│   ├── app/                # Routage App Router (Pages, Layouts, CSS global)
│   │   ├── globals.css     # Configuration du thème Tailwind v4 (@theme)
│   │   ├── layout.tsx      # Layout racine de l'application
│   │   ├── page.tsx        # Page d'accueil
│   │   ├── login/          # Authentification / Connexion
│   │   ├── signup/         # Tunnel d'inscription (step1 à step4)
│   │   ├── profile/        # Espace profil utilisateur
│   │   ├── salle/          # Module de consultation / réservation de salles
│   │   └── subvention/     # Module des demandes de subventions
│   ├── components/         # Composants UI
│   │   ├── layout/         # Éléments structuraux (Header, Sidebar)
│   │   ├── shared/         # Composants composés transverses (Stepper, HelpSidebar)
│   │   └── ui/             # Éléments atomiques réutilisables (Button, FormField, Modales)
│   ├── lib/                # Utilitaires globaux (fetcher, API helpers, formatters)
│   ├── hooks/              # Hooks React sur-mesure
│   └── types/              # Définitions TypeScript partagées
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## 🎨 Tailwind CSS v4 - Bonnes Pratiques

**ATTENTION :** Ce projet utilise Tailwind CSS v4.
1. **Pas de fichier `tailwind.config.ts` :** La configuration (variables de couleurs, polices, tokens) s'effectue **exclusivement** via la directive `@theme` dans `src/app/globals.css`.
2. **Composants UI réutilisables :** Évitez de dupliquer des listes étendues de classes utilitaires. Si un composant graphique (bouton, champ, modal) est présent à plusieurs endroits, utilisez ou enrichissez `src/components/ui/`.
3. **Formatage automatique :** Utilisez l'extension Prettier avec le plugin `prettier-plugin-tailwindcss` activé dans votre éditeur (VS Code, PhpStorm...) afin d'ordonner automatiquement les classes lors de l'enregistrement.

---

## 🏗️ Conventions de Développement

### 1. Server Components vs Client Components
* Par défaut, tous les composants Next.js sous `app/` sont des **React Server Components (RSC)**.
* N'ajoutez la directive `"use client";` en tête de fichier **que** lorsque le composant nécessite :
  * Des hooks d'état ou d'effet (`useState`, `useEffect`, `useReducer`).
  * Des gestionnaires d'événements utilisateur (`onClick`, `onChange`, `onSubmit`).
  * Des API du navigateur (`window`, `localStorage`, etc.).
* **Règle d'or :** Découpez au plus fin l'interactivité. Gardez les conteneurs et les pages en RSC, et isolez uniquement les widgets interactifs en composants clients.

### 2. Communication avec le Backend (Symfony)
* Tous les appels réseau vers l'API Symfony doivent être centralisés dans `src/lib/api.ts` ou dans un sous-dossier de services dédié.
* Aucun appel direct `fetch()` ne doit être codé dans les composants d'affichage sans abstraction.
* Tous les schémas de réponse doivent être typés avec des interfaces TypeScript claires.

### 3. Règles de Nommage
* **Composants & Fichiers React :** `PascalCase` (ex: `Button.tsx`, `Header.tsx`).
* **Dossiers :** `kebab-case` (ex: `components/ui/`, `features/user-profile/`).
* **Fonctions & Variables :** `camelCase` (ex: `formatDate()`, `isLoading`).