# Božkov E-shop Website

Moderní e-shop webová stránka pro značku Božkov rum s plnou funkcionalitou přihlašování, nákupního košíku a administrace.

## Funkce

### Uživatelské funkce
- **Registrace a přihlášení** - Email/heslo autentizace pomocí Supabase
- **Katalog produktů** - 6 produktů Božkov s detailními informacemi
- **Nákupní košík** - Přidávání produktů, správa množství, perzistence v databázi
- **Historie objednávek** - Zobrazení všech dokončených objednávek
- **Responzivní design** - Funguje na všech zařízeních
- **Hero sekce** - S profilovou fotkou

### Admin funkce
- **Admin panel** - Přístup jen pro administrátory
- **Správa produktů** - CRUD operace (Create, Read, Update, Delete)
- **Přehled objednávek** - Zobrazení všech objednávek v systému
- **Správa skladu** - Sledování množství na skladě

### Historie značky
- Časová osa vývoje značky od roku 1948
- Informace o tradici tuzemského rumu

## Technologie

- **Frontend:**
  - React 18 + Vite
  - React Router DOM (navigace)
  - Zustand (state management)
  - React Hot Toast (notifikace)

- **Backend/Databáze:**
  - Supabase (autentizace + PostgreSQL databáze)
  - Row Level Security (RLS) politiky

## Instalace a nastavení

### 1. Klonování repozitáře
```bash
git clone https://github.com/sochor2285/-bozkov.git
cd bozkov-website
```

### 2. Instalace závislostí
```bash
npm install
```

### 3. Nastavení Supabase

#### A. Vytvoření projektu
1. Přihlaste se na [supabase.com](https://supabase.com)
2. Vytvořte nový projekt
3. Zkopírujte **Project URL** a **anon public** API klíč

#### B. Konfigurace prostředí
1. Vytvořte soubor `.env` v root složce:
```bash
cp .env.example .env
```

2. Vyplňte své Supabase údaje v `.env`:
```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### C. Vytvoření databázového schématu
1. Otevřete Supabase SQL Editor
2. Zkopírujte a spusťte celý obsah souboru `supabase-schema.sql`
3. Schéma vytvoří:
   - Tabulky: products, profiles, orders, order_items, cart_items
   - RLS politiky pro zabezpečení
   - Trigger pro automatické vytváření profilů
   - Ukázková data (6 produktů Božkov)

### 4. Vytvoření admin uživatele

Po registraci prvního uživatele v aplikaci:

1. Otevřete Supabase Table Editor
2. Najděte tabulku `profiles`
3. Najděte svůj profil a změňte `is_admin` na `true`

Nebo použijte SQL:
```sql
UPDATE profiles
SET is_admin = true
WHERE id = 'your-user-id-here';
```

### 5. Spuštění aplikace

```bash
npm run dev
```

Aplikace poběží na `http://localhost:5173`

## Databázové schéma

### Tabulky

**products**
- Produkty v obchodě (název, popis, cena, skladem)

**profiles**
- Uživatelské profily (rozšíření auth.users)
- Určuje, zda je uživatel admin

**orders**
- Objednávky uživatelů (celková cena, status)

**order_items**
- Položky v objednávkách (produkt, množství, cena)

**cart_items**
- Nákupní košík uživatelů (perzistentní)

## Struktura projektu

```
bozkov-website/
├── public/
│   └── hero-photo.jpg        # Fotka v hero sekci
├── src/
│   ├── components/
│   │   ├── Admin/            # Admin panel
│   │   ├── Auth/             # Login/Register
│   │   ├── Cart/             # Košík
│   │   ├── Hero/             # Hero sekce
│   │   ├── Navbar/           # Navigace
│   │   ├── Orders/           # Historie objednávek
│   │   ├── Products/         # Produkty
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   └── Homepage.jsx      # Hlavní stránka
│   ├── stores/
│   │   ├── authStore.js      # Autentizace state
│   │   ├── cartStore.js      # Košík state
│   │   └── productStore.js   # Produkty state
│   ├── lib/
│   │   └── supabase.js       # Supabase konfigurace
│   ├── App.jsx               # Router a route
│   ├── App.css               # Globální styly
│   └── main.jsx              # Entry point
├── supabase-schema.sql       # SQL schéma
├── .env.example              # Příklad env proměnných
└── README.md                 # Dokumentace
```

## Použití

### Uživatelský flow
1. Registrace/Přihlášení na `/register` nebo `/login`
2. Prohlížení produktů na domovské stránce
3. Přidání produktů do košíku (tlačítko 🛒 v navigaci)
4. Dokončení objednávky v košíku
5. Zobrazení historie na `/orders`

### Admin flow
1. Přihlásit se jako admin
2. Navigovat na `/admin`
3. Přepínat mezi záložkami **Produkty** a **Objednávky**
4. Přidávat/upravovat/mazat produkty
5. Sledovat všechny objednávky

## Bezpečnost

- **Row Level Security (RLS)** - Všechny tabulky mají RLS politiky
- **Protected Routes** - Citlivé stránky vyžadují přihlášení
- **Admin kontrola** - Admin panel přístupný jen s `is_admin = true`
- **Environment variables** - Credentials v .env (ne v Gitu)

## Build pro produkci

```bash
npm run build
```

Výsledné soubory budou v `dist/` složce.

## Design a barvy

- **Primární:** Zlatá (#daa520) - kvalita a tradice
- **Sekundární:** Tmavě hnědá (#2d1810) - barva rumu
- **Pozadí:** Tmavé odstíny (#0a0a0a, #1a1a1a)
- **Animace:** Fade-in efekty, hover transitions
- **Typografie:** Sans-serif, důraz na čitelnost

## Licence

© 2024 STOCK Plzeň-Božkov s.r.o.

---

**Varování:** Konzumujte alkohol zodpovědně. Pouze pro osoby 18+
