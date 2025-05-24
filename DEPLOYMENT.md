# 🚀 Instrukcje wdrożenia TaskFlow na GitHub

## Przygotowanie repozytorium GitHub

### 1. Stwórz nowe repozytorium na GitHub
- Zaloguj się na GitHub.com
- Kliknij "New repository"
- Nazwa: `taskflow-frontend`
- Opis: `Aplikacja do zarządzania projektami z kalendarzem timeline`
- Ustaw jako publiczne (lub prywatne według potrzeb)
- **NIE** dodawaj README, .gitignore ani licencji (już je mamy)

### 2. Przesyłanie kodu na GitHub

```bash
# W folderze z aplikacją
git init
git add .
git commit -m "Initial commit - TaskFlow aplikacja z kalendarzem timeline"
git branch -M main
git remote add origin https://github.com/[twoja-nazwa]/taskflow-frontend.git
git push -u origin main
```

## Wdrożenie na GitHub Pages

### Opcja 1: GitHub Pages (statyczna strona)
1. W repozytorium idź do Settings > Pages
2. Source: "Deploy from a branch"
3. Branch: `main` / `(root)`
4. Zapisz ustawienia

### Opcja 2: Vercel (zalecane)
1. Idź na vercel.com
2. Połącz z kontem GitHub
3. Importuj repozytorium `taskflow-frontend`
4. Framework: `React`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Deploy!

### Opcja 3: Netlify
1. Idź na netlify.com
2. "New site from Git"
3. Wybierz GitHub i swoje repozytorium
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy site

## Konfiguracja z bazą danych

Jeśli masz bazę danych na GitHub (prawdopodobnie jako backend):

### 1. Skonfiguruj zmienne środowiskowe
```bash
# W pliku .env.production
VITE_API_URL=https://twoja-baza-danych-url.com/api
VITE_APP_NAME=TaskFlow
```

### 2. Aktualizuj plik konfiguracyjny
Sprawdź czy w `client/src/lib/queryClient.ts` masz:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

## 🔗 Połączenie z bazą danych GitHub

Jeśli Twoja baza danych jest hostowana osobno:

1. **Backend API**: Upewnij się, że backend ma włączone CORS dla Twojej domeny
2. **URL API**: Ustaw prawidłowy URL w zmiennych środowiskowych
3. **Uwierzytelnianie**: Skonfiguruj tokeny/klucze API jeśli potrzebne

## Przykładowa struktura wdrożenia:
```
Frontend (GitHub Pages/Vercel): taskflow-frontend.vercel.app
Backend/Database (GitHub): github.com/twoja-nazwa/taskflow-backend
```

## 📝 Następne kroki po wdrożeniu:
1. Przetestuj wszystkie funkcje aplikacji
2. Sprawdź czy kalendarz timeline działa poprawnie
3. Zweryfikuj połączenie z bazą danych
4. Skonfiguruj niestandardową domenę (opcjonalnie)

## 🆘 Pomoc
Jeśli napotkasz problemy:
- Sprawdź logi konsoli przeglądarki (F12)
- Zweryfikuj ustawienia CORS na backendzie
- Upewnij się, że zmienne środowiskowe są prawidłowo skonfigurowane