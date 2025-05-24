# 📁 Instrukcje przesłania TaskFlow na GitHub

## Krok 1: Przygotowanie lokalnego środowiska

1. **Pobierz wszystkie pliki z tego projektu**
   - Skopiuj całą zawartość folderu do swojego komputera
   - Struktura powinna wyglądać tak:
   ```
   taskflow-frontend/
   ├── src/
   │   ├── components/
   │   ├── pages/
   │   ├── hooks/
   │   ├── lib/
   │   └── ...
   ├── index.html
   ├── package.json (jeśli jest)
   ├── README.md
   └── inne pliki...
   ```

## Krok 2: Instalacja zależności (na Twoim komputerze)

```bash
# Przejdź do folderu projektu
cd taskflow-frontend

# Jeśli nie masz package.json, stwórz go:
npm init -y

# Zainstaluj potrzebne pakiety
npm install react react-dom
npm install @types/react @types/react-dom --save-dev
npm install vite @vitejs/plugin-react --save-dev
npm install typescript tailwindcss postcss autoprefixer --save-dev
npm install @tanstack/react-query wouter
npm install react-dnd react-dnd-html5-backend
npm install date-fns lucide-react
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
npm install tailwindcss-animate

# Zbuduj projekt
npm run build
```

## Krok 3: Utworzenie repozytorium GitHub

1. **Idź na GitHub.com i zaloguj się**
2. **Kliknij "New repository"**
3. **Wypełnij dane:**
   - Repository name: `taskflow-frontend`
   - Description: `Aplikacja do zarządzania projektami z kalendarzem timeline`
   - Ustaw jako Public lub Private (według preferencji)
   - **NIE** zaznaczaj "Add a README file" (już mamy)

## Krok 4: Przesłanie kodu na GitHub

```bash
# W folderze projektu wykonaj:
git init
git add .
git commit -m "Initial commit - TaskFlow aplikacja z kalendarzem timeline"
git branch -M main
git remote add origin https://github.com/TWOJA-NAZWA/taskflow-frontend.git
git push -u origin main
```

## Krok 5: Wdrożenie na Vercel (zalecane)

1. **Idź na vercel.com**
2. **Zaloguj się przez GitHub**
3. **Kliknij "New Project"**
4. **Importuj swoje repozytorium taskflow-frontend**
5. **Vercel automatycznie wykryje ustawienia:**
   - Framework Preset: React
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Kliknij "Deploy"**

## Krok 6: Połączenie z bazą danych

Jeśli masz bazę danych na GitHub:

1. **W Vercel, idź do Settings → Environment Variables**
2. **Dodaj:**
   ```
   VITE_API_URL = https://twoja-baza-danych-url.com/api
   ```
3. **Redeploy projekt**

## Alternatywne opcje wdrożenia:

### Netlify:
1. Przeciągnij folder `dist` na netlify.com
2. Lub połącz z repozytorium GitHub

### GitHub Pages:
1. W repozytorium: Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / (root)

## 🔗 Twoja aplikacja będzie dostępna pod adresem:
- Vercel: `https://taskflow-frontend-[hash].vercel.app`
- Netlify: `https://[nazwa].netlify.app`
- GitHub Pages: `https://[twoja-nazwa].github.io/taskflow-frontend`

## ✅ Co otrzymujesz:
- ✅ Pełnoprawną aplikację TaskFlow
- ✅ Kalendarz timeline z zadaniami
- ✅ Interfejs w języku polskim
- ✅ Responsywny design
- ✅ Drag & drop funkcjonalność
- ✅ Gotowość do połączenia z bazą danych