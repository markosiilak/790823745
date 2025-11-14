# Kvartalitööplaneerija

Kaasaegne täisfunktsionaalne Next.js rakendus ülesannete visualiseerimiseks ja haldamiseks kvartalite ajakavadel. Ehitatud TypeScript, React 19 ja styled-components abil, mis sisaldab rahvusvahelistamist ja reageerivat disaini.

## Ülevaade

See rakendus pakub täielikku ülesannete haldussüsteemi, kus kasutajad saavad:
- Visualiseerida ülesandeid kvartalite ajakavadel nädalate kaupa
- Luua, muuta ja kustutada ülesandeid algus-/lõppkuupäevadega
- Lisada alaülesandeid ülesannetele koos konkreetsete kuupäevade ja kellaaegadega
- Liikuda sujuvalt kvartalite vahel
- Vahetada tabeli- ja kompaktvaate režiime
- Mitmekeelne adminliides (inglise, eesti)

## Tehnoloogilised vahendid

- **Raamistik**: Next.js 16 (App Router)
- **Jooksva keskkonna**: React 19
- **Keel**: TypeScript 5.7
- **Stiilimine**: styled-components 6.1
- **Oleku haldamine**: React Hooks (useState, useEffect, useCallback, useMemo)
- **Andmete säilimine**: JSON-failipõhine salvestamine (API marsruutide kaudu)
- **Rahvusvahelistamine**: Kohandatud i18n implementatsioon JSON tõlke failidega

## Projekti struktuur

```
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API routes (REST endpoints)
│   │   │   └── tasks/
│   │   │       ├── route.ts          # GET, POST, PUT for tasks
│   │   │       └── [taskId]/
│   │   │           └── subtasks/
│   │   │               └── route.ts  # POST, PUT for subtasks
│   │   ├── calendar/                 # Calendar routes
│   │   │   └── [year]/[quarter]/
│   │   │       ├── page.tsx          # Main quarter view
│   │   │       └── tasks/
│   │   │           ├── new/
│   │   │           │   └── page.tsx  # Task creation page
│   │   │           └── [taskId]/
│   │   │               └── edit/
│   │   │                   └── page.tsx # Task editing page
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home (redirects to current quarter)
│   │
│   ├── components/                   # React components
│   │   ├── AppShell.tsx              # Application shell/layout wrapper
│   │   ├── Tooltip.tsx               # Tooltip component
│   │   │
│   │   ├── QuarterPlanner/           # Main feature module
│   │   │   ├── index.tsx             # Main planner orchestrator
│   │   │   ├── types.ts              # TypeScript type definitions
│   │   │   │
│   │   │   ├── QuarterTable/         # Table visualization module
│   │   │   │   ├── index.tsx         # Table container component
│   │   │   │   ├── constants.ts      # Table constants (widths, formatters)
│   │   │   │   ├── styles.ts         # Loading indicator styles
│   │   │   │   ├── LoadingIndicator.tsx
│   │   │   │   ├── TableHeaderSection.tsx
│   │   │   │   ├── TableHead.tsx     # Table header (<thead>)
│   │   │   │   ├── TableBody.tsx     # Table body (<tbody>)
│   │   │   │   ├── TaskRow.tsx       # Individual task row
│   │   │   │   ├── WeekCell.tsx      # Week cell with subtasks
│   │   │   │   └── hooks/
│   │   │   │       ├── useViewMode.ts       # View mode state (table/compact)
│   │   │   │       └── useTableData.ts      # Data processing/transformations
│   │   │   │
│   │   │   ├── hooks/                # Custom React hooks
│   │   │   │   ├── useTasks.ts       # Task CRUD operations
│   │   │   │   ├── useSubtasks.ts    # Subtask management
│   │   │   │   ├── useTaskForm.ts    # Task form state/logic
│   │   │   │   └── useQuarterNavigation.ts # Quarter navigation
│   │   │   │
│   │   │   ├── styles/               # Styled-components
│   │   │   │   ├── quarterPlannerStyles.ts
│   │   │   │   ├── quarterTableStyles.ts
│   │   │   │   ├── taskFormStyles.ts
│   │   │   │   ├── taskPageStyles.ts
│   │   │   │   ├── headerSectionStyles.ts
│   │   │   │   └── dropdownStyles.ts
│   │   │   │
│   │   │   ├── TaskCreate.tsx        # Task creation page component
│   │   │   ├── TaskEdit.tsx          # Task editing page component
│   │   │   ├── TaskForm.tsx          # Reusable task form component
│   │   │   ├── HeaderSection.tsx     # Quarter header with navigation
│   │   │   ├── Dropdown.tsx          # Reusable dropdown component
│   │   │   │
│   │   │   └── Subtasks/
│   │   │       ├── SubtaskDialog.tsx # Subtask creation/editing modal
│   │   │       └── styles.ts
│   │   │
│   │   ├── DatePicker/               # Date picker component
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   │
│   │   ├── icons/                    # SVG icon components
│   │   │   ├── ChevronLeftIcon.tsx
│   │   │   ├── ChevronRightIcon.tsx
│   │   │   ├── ChevronDownIcon.tsx
│   │   │   ├── EditIcon.tsx
│   │   │   └── RemoveIcon.tsx
│   │   │
│   │   └── shared/                   # Shared UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── FormElements.tsx
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── quarter.ts                # Quarter date calculations
│   │   ├── task-utils.ts             # Task/subtask normalization & validation
│   │   ├── translations.ts           # i18n implementation
│   │   └── styled-components.tsx     # styled-components configuration
│   │
│   ├── locales/                      # Translation files
│   │   ├── en.json                   # English translations
│   │   └── et.json                   # Estonian translations
│   │
│   ├── data/                         # Data files
│   │   └── tasks.json                # Persistent task storage (JSON)
│   │
│   └── styles/                       # Global styles
│       ├── theme.ts                  # Theme configuration
│       └── styled.d.ts               # styled-components type definitions
│
├── public/                           # Static assets
├── package.json
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── eslint.config.mjs                 # ESLint configuration
└── prettier.config.mjs               # Prettier configuration
```

## Arhitektuur

### Andmevoog

1. **Andmete kiht**: JSON-fail (`src/data/tasks.json`) toimib säilimise kihina
2. **API kiht**: Next.js API marsruudid (`src/app/api/tasks/`) käsitlevad CRUD toiminguid
3. **Äriloogika**: Kohandatud hooks (`src/components/QuarterPlanner/hooks/`) haldavad olekut ja API suhtlust
4. **Esitusekiht**: React komponendid renderdavad UI-d kasutades styled-components

### Peamised arhitektuurilised otsused

#### 1. Komponentide koostamine ja vastutuste eraldamine
- **Funktsioonipõhine organisatsioon**: Komponendid on rühmitatud funktsiooni järgi (QuarterPlanner, QuarterTable)
- **Üksikvastutus**: Igal komponendil/hook'il on selge, fokseeritud eesmärk
- **Eraldatud stiilid**: Kõik styled-components viidud eraldi `styles.ts` failidesse hooldatavuse huvides
- **Taaskasutatavad komponendid**: Jagatud komponendid (Dropdown, DatePicker, Button) ühtsuse jaoks

#### 2. Kohandatud hooks oleku haldamiseks
- **`useTasks`**: Haldab ülesannete laadimist, loomist, uuendamist, kustutamist
- **`useSubtasks`**: Käsitleb alaülesannete loomist ja muutmist dialoogi olekuga
- **`useTaskForm`**: Lisamise vormi loogika, valideerimise ja esitamise nii loomise kui ka muutmise režiimides
- **`useQuarterNavigation`**: Haldab kvartali navigeerimist ja URL marsruutimist
- **`useViewMode`**: Haldab tabeli vaate režiimi (tabel/kompaktne) ja nädala valikut
- **`useTableData`**: Töötleb ja transformeerib ülesannete andmeid tabeli renderdamiseks

#### 3. Tüübi turvalisus
- Põhjalikud TypeScript tüübid `types.ts` failis
- Jagatud utiliidi funktsioonid `task-utils.ts` failis tüübiturvalise andmete normaliseerimise jaoks
- Tüübiturvaline tõlke süsteem võtmete automaatse täiendamisega

#### 4. Rahvusvahelistamine (i18n)
- Kohandatud tõlke süsteem JSON failidega
- `useLocale` ja `useTranslations` hooks reaktiivsete tõlke uuenduste jaoks
- Hydration-turvaline locale initsialiseerimine (vältib SSR/kliendi lahknevust)
- LocalStorage säilimine keele eelistuse jaoks

#### 5. API disain
- RESTful: `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/[id]`
- Lisaks ressursid: `POST /api/tasks/[id]/subtasks`, `PUT /api/tasks/[id]/subtasks`
- Ühine vigade käsitlemine NextResponse'iga
- Andmete valideerimise funktsioonide abil

#### 6. Kuupäevade käsitlemine
- ISO-8601 kuupäeva salvestamiseks
- Tsentraliseeritud kuupäevad `lib/quarter.ts` failis
- ISO-8601 nädala arvutused (esmaspäev on esimene)
- DatePicker komponent kuupäevade jaoks

## Kuidas see töötab

### Rakenduse voog

1. **Lehekülg**: `app/page.tsx` suunab praeguse kvartali juurde (`/calendar/{year}/{quarter}`)
2. **Kvartali leht**: `app/calendar/[year]/[quarter]/page.tsx` renderdab `QuarterPlanner` komponenti
3. **Peamine komponent**: `QuarterPlanner` sisaldab:
   - Ülesannete laadimist `useTasks` hook'i abil
   - Kvartali navigeerimist `useQuarterNavigation` hook'i abil
   - Alaülesannete haldamist `useSubtasks` hook'i abil
   - Renderdab `HeaderSection` ja `QuarterTable`
4. **Ülesannete tabel**: `QuarterTable` kuvab ülesandeid nädalate kuupäevatega:
   - Töötleb ülesandeid `useTableData` hook'i abil
   - Renderdab ülesandeid, nädalaid ja kuupäeva dünaamiliselt
   - Toetab tabeli/kompaktse vaate režiime `useViewMode` hook'i abil

### Andmevoo näide: Ülesande loomine

1. Kasutaja klõpsab "Lisa ülesanne" → suunab `/calendar/{year}/{quarter}/tasks/new`
2. `TaskCreate` komponent renderdab `TaskForm` komponenti
3. `TaskForm` kasutab `useTaskForm` hook'i vormi loogikat
4. Esitamisel teeb `useTaskForm` `POST /api/tasks` päringu
5. API marsruut valideerib andmeid, normaliseerib andmed, kirjutab `tasks.json` faili
6. Kasutaja suunatakse tagasi kvartali vaatesse
7. `useTasks` hook laeb ülesanded uuesti ja UI uueneb dünaamiliselt

### Oleku haldamise strateegia

- **Serveri olek**: Ülesanded salvestatud JSON failis, laetud API url'ide abil
- **Kliendi olek**: Hallatakse React hooks'ide kaudu (useState, useCallback, useMemo)
- **Optimistlikud uuendused**: Kui muudad või lisad alaülesandeid, uuendatakse tabel koheselt, et kasutajakogemus oleks sujuvam ja mõnusam – salvestamine toimib (inline editing) taustal.

## Arendamise protsess: samm-sammult juhend

### 1: Projekti seadistamine ja alus

#### 1: Initsialiseeri Next.js projekt TypeScript'iga
```bash
npx create-next-app@latest --typescript --app --no-tailwind
```
**Otsus**: Valiti App Router Pages Router'i asemel kaasaegsete Next.js. Jäeti Tailwind välja styled-components eelistuse tõttu.

#### 2: Paigalda põhisõltuvused
```bash
npm install styled-components @types/styled-components
```
**Põhjendus**: styled-components CSS-in-JS jaoks komponendi stiilidega.

#### 3: Konfigureeri TypeScripti importid
**Fail**: `tsconfig.json`
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### 4: Seadista Styled-Components Next.js'ile
**Fail**: `lib/styled-components.tsx`
- Loodi `StyleRegistry` komponent SSR toe jaoks
- Mähiti rakendus `StyleRegistry`'sse juurpaigutuses
**Põhjendus**: styled-components nõuab SSR seadistamist Next.js App Router'is.

---

### 2: Põhilised tüübi definitsioonid ja utiliidid

#### 5: Defineeri TypeScript tüübid
**Fail**: `components/QuarterPlanner/types.ts`
- `Task`: Põhiline ülesande üksus nime, alguse, lõpu, durationDays ja alaülesannetega
- `Subtask`: Alaülesande üksus id, title ja timestamp'iga
- `TaskFormState`: Vormi oleku kuju
- `QuarterKey`: Kvartali tüübid

#### 6: Realiseeri kvartali kuupäeva utiliidid
**Fail**: `lib/quarter.ts`
- `getQuarterFromDate()`: Arvuta kvartal kuupäevast
- `buildQuarterStructure()`: Genereeri nädala/kuu struktuur kvartali jaoks
- `formatISODate()`, `parseISODate()`: ISO-8601 kuupäeva utiliidid
- Nädala arvutused järgides ISO-8601 standardit

---

### 3: Andmete loogika ja API

#### 7: Loo ülesannete andmete utiliidid
**Fail**: `lib/task-utils.ts`
- `normalizeTask()`: Teisenda toore JSON-i tüübitatud Task'iks
- `normalizeSubtask()`: Teisenda toore JSON-i tüübitatud Subtask'iks
- `validateTaskPayload()`: Valideeri API päringu andmeid
- `createStoredSubtask()`: Loo alaülesanne õige struktuuriga

#### 8: Realiseeri API marsruudid
**Failid**: 
- `app/api/tasks/route.ts`: GET (nimekiri), POST (lisa), PUT (uuenda) ülesandeid
- `app/api/tasks/[taskId]/subtasks/route.ts`: POST (lisa), PUT (uuenda) alaülesandeid
**Realiseerimine**:
- Failipõhine säilimine kasutades `fs/promises`
- Vigade käsitlemine try/catch ja HTTP status koodidega
- Andmete valideerimine enne salvestamist
- Tüübiturvaline päringu/vastuse käsitlemine

---

### 4: Komponentide arhitektuur

#### 9: Ehita taaskasutatavad UI komponendid
**Failid**: `components/shared/*`
- `Button.tsx`: Stiilistatud nupp variantidega
- `Card.tsx`: Konteineri komponent
- `FormElements.tsx`: Vormi sisendkomponendid

#### 10: Loo kuupäeva valija komponent
**Fail**: `components/DatePicker/index.tsx`
- HTML5 kuupäeva sisend kohandatud stiilimisega
- Kontrollitava komponendi muster
- Ligipääsetavuse atribuudid (aria-labelledby)

#### 11: Ehita kvartali tabeli komponendid
**Failid**: `components/QuarterPlanner/QuarterTable/*`
- Alustati monoliitsest `QuarterTable.tsx`'st
- Refaktoreeriti väiksemateks komponentideks:
  - `TableHeaderSection`: Vaate režiimi juhtpaneelid
  - `TableHead`: Veeru päised
  - `TableBody`: Ülesannete read
  - `TaskRow`: Üksiku ülesande rida
  - `WeekCell`: Lahter alaülesannetega

#### 12: Eralda kohandatud hooks
**Failid**: `components/QuarterPlanner/hooks/*`
**Refaktoreerimise protsess**:
1. Tuvastasin keeruline oleku loogika komponentides
2. Eraldasin fokseeritud hook'idesse:
   - `useTasks`: API päringud ja ülesannete loogika
   - `useSubtasks`: Alaülesannete dialoogi olek ja toimingud
   - `useTaskForm`: Vormi loogika jagatud loomise/muutmise vahel
   - `useQuarterNavigation`: URL-põhine navigeerimine

---

### 5: Funktsionaalsuse realiseerimine

#### 13: Realiseerin CRUD toimingud
**Hook**: `hooks/useTasks.ts`
- `fetchTasks()`: GET päring `/api/tasks`'i url'ile
- `createTask()`: POST päring valideerimisega
- `updateTask()`: PUT päring salvestamise ja valideerimise loogikaga
- `deleteTask()`: Kustutamine JSON failist
- Laadimise ja vea oleku haldamine

#### 14: Ehita ülesannete vorm jagatud loogikaga
**Failid**: 
- `TaskForm.tsx`: Komponent, mis sisaldab vormi loogikat
- `hooks/useTaskForm.ts`: Vormi olek ja valideerimine
- Üks hook kasutatakse nii `TaskCreate` kui ka `TaskEdit` poolt
- Loogika põhineb `taskId` prop'il (loomise vs muutmise režiim)
- Vormi valideerimine (kohustuslikud väljad, kuupäeva vahemikud)
- Automaatne ümbersuunamine pärast edukat esitamist

#### 15: Realiseeri subtaskide haldamine
**Failid**:
- `Subtasks/SubtaskDialog.tsx`: Komponent, mis sisaldab subtaskide dialoogi loogikat
- `hooks/useSubtasks.ts`: Hook, mis sisaldab subtaskide dialoogi olekut ja API päringuid
**Funktsioonid**:
- Klõpsa subtaski muutmiseks
- Lisa subtask kindlasse nädalasse
- Dialoogi olek: `{ taskId, weekKey, subtaskId }`
- PUT vs POST määratakse `subtaskId` olemasolu järgi
- Optimistlikud uuendused kohese tagasiside jaoks (inline editing)

---

### 6: Stiilimine ja kasutajakogemus

#### 17: Eralda stiilid eraldi failidesse
**Protsess**: 
1. Tuvastasin reas styled-components komponentides
2. Loodi `styles/*.ts` failid iga komponendi kataloogile
3. Eksportsin kõik styled-components komponendid
4. Uuendasin importid
**Loodud failid**:
- `QuarterPlanner/styles/*.ts`
- `QuarterTable/styles.ts`
- `DatePicker/styles.ts`
- `Tooltip/styles.ts`

#### 18: Realiseeri laadimise olek
**Fail**: `QuarterTable/LoadingIndicator.tsx`
- Edenemisriba animatsioon kui `isLoading` prop on `true`
- Kuvab "Laadimine..." sõnumi kui `isLoading` prop on `true`

#### 19: Lisa mobiilse disaini toetus
- Tabel kohandub vaateakna laiusele
- Kompaktne vaate režiim väiksemate ekraanide jaoks
- Mobiilne kuupäeva valija

---

### 7: Rahvusvahelistamine

#### 20: Realiseerin tõlke süsteemi
**Fail**: `lib/translations.ts`
- JSON failid iga locale'i jaoks (`locales/en.json`, `locales/et.json`)
- `useLocale()` hook: Saab/seadistab locale localStorage'ist + brauserist
- `useTranslations(section)` hook: Tagastab tõlke objekti sektsiooni jaoks
- Tüübiturvaline: TypeScript järeldab saadaolevad võtmed

#### 21: Realiseerin staatiliste tekstide väljastamise
**Protsess**:
1. Otsisin koodibaasist kõvakodeeritud stringe
2. Lisasin keelte tekstid `en.json`'i ja `et.json`'i failidesse
3. Asendasin stringid `useTranslations()` kutsetega
**Uuendatud failid**: Kõik komponendi failid rakenduses
- `headerSection`: Navigeerimine ja päis
- `quarterPlanner`: Peamine planeerija tekst
- `quarterTable`: Tabeli sildid ja sõnumid
- `taskCreate`: Ülesande loomise leht
- `taskEdit`: Ülesande muutmise leht
- `taskForm`: Vormi sildid ja nupud
- `languages`: Keelte nimed valija jaoks

#### 22: Lisa keele valik
**Fail**: `HeaderSection.tsx`
- Integreerin `Dropdown` komponent
- Loetlen saadaolevad locale'id
- Uuendan locale'i `setLocale()` funktsiooniga
- UI uueneb reaktiivselt `useLocale` hook'i abil

---

### 8: Refaktoreerimine ja koodi kvaliteet

#### 23: Refaktoreerin QuarterTable komponendi
**Refaktoreerimise põhjendus**:
- Algne `QuarterTable.tsx` ületas 400 rida
- Raske testida ja hooldada
- Segatud vastutused (renderdamine, andmete töötlemine, lohistamine)

#### 24: Paranda React Hooks rikkumised
**Probleem**: Tingimuslik tagastamine enne kõigi hook'ide kutsumist
**Parandus**: 
- Viin kõik hook'ide kutsed komponendi tippu
- Tingimuslik renderdamine pärast kõiki hook'e

#### 25: Lisa tüübi turvalisuse parandused
- Lisan puuduv `durationDays` Task tüüpi
- Parandan kaudsed `any` tüübid
- Lisan õige vigade käsitlemise tüübid
- Valideerin, et kõik importid kasutavad TypeScript teid (`@/`)

---

## Rakenduse käitamine

### Arendamine

```bash
npm run dev
```

Ava [http://localhost:3000](http://localhost:3000) brauseris.

### Ehitamine

```bash
npm run build
npm start
```

### Koodi kvaliteet

```bash
npm run lint        # Käivita ESLint
npm run format      # Vorminda Prettier'iga
npm run format:check # Kontrolli vormindust
```

