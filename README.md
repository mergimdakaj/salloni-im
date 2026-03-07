# Salloni Im - Aplikacion për Rezervime

Ky është një aplikacion për menaxhimin e rezervimeve në sallon, i ndërtuar me React, Vite, Tailwind CSS dhe Firebase.

## Karakteristikat

- 📅 Rezervim online i takimeve
- 💇‍♀️ Zgjedhja e shërbimeve dhe stafit
- 📱 Dizajn i përshtatshëm për celularë (Responsive)
- 🔥 Ruajtja e të dhënave në kohë reale me Firebase

## Si ta filloni projektin

1.  **Instaloni varësitë:**
    ```bash
    npm install
    ```

2.  **Konfiguroni Firebase:**
    - Krijoni një projekt në [Firebase Console](https://console.firebase.google.com/).
    - Aktivizoni **Firestore Database**.
    - Merrni konfigurimet e projektit dhe vendosini në skedarin `.env` (shihni `.env.example`).

3.  **Nisni serverin e zhvillimit:**
    ```bash
    npm run dev
    ```

## Vendosja në GitHub

1.  Krijoni një repo të re në GitHub.
2.  Ndiqni komandat:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/EMRI_JUAJ/EMRI_REPOZITORIT.git
    git push -u origin main
    ```

## Vendosja në Vercel

1.  Lidhni llogarinë tuaj GitHub me Vercel.
2.  Importoni projektin.
3.  Shtoni variablat e mjedisit (Environment Variables) nga `.env`.
4.  Klikoni **Deploy**.
