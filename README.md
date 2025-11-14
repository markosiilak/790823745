# Kvartalitööplaneerija

Kaasaegne täisfunktsionaalne Next.js rakendus ülesannete visualiseerimiseks ja haldamiseks kvartalite ajakavadel. Ehitatud TypeScript, React 19 ja styled-components abil, mis sisaldab rahvusvahelistamist ja reageerivat disaini.

## Ülevaade

See rakendus pakub täielikku ülesannete juhtimise süsteemi, kus kasutajad saavad:
- Kuvada ülesandeid kvartalite ajakavadel nädalate kaupa
- Luua, redigeerida ja kustutada ülesandeid algus- ja lõppkuupäevadega
- Lisata ülesannetele alaülesandeid koos kindlate kuupäevade ja kellaaegadega
- Sujuvalt liikuda kvartalite vahel
- Vahetada tabelivaate ja kompaktvaate režiimide vahel
- Mitmekeelne halduri liides (inglise, eesti)

## Tehnoloogilised vahendid

- **Raamistik**: React koos Next.js 16 (App Router)
- **Jooksukeskkond**: React 19
- **Keelevalik**: TypeScript 5.7
- **Stiilide haldamine**: styled-components 6.1
- **Oleku jälgimine**: React Hooks (useState, useEffect, useCallback, useMemo)
- **Andmete salvestamine**: JSON-failipõhine andmesalvestus (API marsruutide kaudu)
- **Rahvusvaheline tugi**: Kohandatud i18n implementatsioon JSON tõlkefailide abil

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

### Andmevoog

1. **Andmete kiht**: JSON-fail (`src/data/tasks.json`) toimib andmete salvestamise kihina.
2. **API kiht**: Next.js API marsruudid (`src/app/api/tasks/`) teostavad CRUD toiminguid.
3. **Äriloogika**: Kohandatud hooks (`src/components/QuarterPlanner/hooks/`) haldavad olekut ja suhtlevad API-ga.
4. **Esitusekiht**: React komponendid renderdavad kasutajaliidese, kasutades styled-components.

### Peamised arhitektuurilised otsused

#### 1. Komponentide koostamine ja vastutuste jagamine
- **Funktsioonipõhine organisatsioon**: Komponendid on grupeeritud vastavalt nende funktsioonidele (QuarterPlanner, QuarterTable).
- **Selge vastutus**: Igal komponendil või hook'il on kindel, fokuseeritud eesmärk.
- **Eraldi stiilide haldamine**: Kõik styled-components on paigutatud eraldi `styles.ts` failidesse hooldatavuse parandamiseks.
- **Taaskasutatavad komponendid**: Ühtsuse tagamiseks jagatud komponendid (Dropdown, DatePicker, Button).

#### 2. Kohandatud hooks oleku haldamiseks
- **`useTasks`**: Halab ülesannete laadimist, loomist, uuendamist ja kustutamist.
- **`useSubtasks`**: Haldab alaülesannete loomist ja muutmist dialooge juhtiva olekuga.
- **`useTaskForm`**: Vastutab lisamise vormi loogika, valideerimise ja esitamise eest nii loomise kui ka muutmise režiimides.
- **`useQuarterNavigation`**: Haldab kvartali navigeerimist ja URL-marsruutimist.
- **`useViewMode`**: Haldab tabeli vaate režiimi (tabel/kompaktne) ja nädala valikut.
- **`useTableData`**: Töötleb ja transformeerib ülesannete andmeid tabeli renderdamiseks.

#### 3. Tüübi turvalisus
- Üksikasjalikud TypeScript tüübid on dokumenteeritud `types.ts` failis.
- Jagatud utiliidi funktsioonid `task-utils.ts` failis aitavad tagada tüübiturvalist andmete normaliseerimist.
- Tüübiturvaline tõlke süsteem, mis toetab võtmete automaatset täiendamist.

#### 4. Rahvusvahelistamine (i18n)
- Kohandatud tõlke süsteem, mis kasutab JSON faile.
- `useLocale` ja `useTranslations` hooks reaktiivsete tõlkeuuenduste jaoks.
- Turvaline locale'i initsialiseerimine, mis väldib SSR ja kliendi lahknevust.
- KeelesePreference jaoks kasutatakse LocalStorage'i salvestamist.

#### 5. API disain
- RESTful: `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/[id]`.
- Täiendavad ressursid: `POST /api/tasks/[id]/subtasks`, `PUT /api/tasks/[id]/subtasks`.
- Üksik vigade käsitlemine NextResponse'i abil.
- Andmete valideerimine funktsioonide kaudu.

#### 6. Kuupäevade käsitlemine
- ISO-8601 kuupäevade salvestamine.
- Keskne kuupäevade haldamine `lib/quarter.ts` failis.
- ISO-8601 nädalate arvutamine (esmaspäev on esimene päev).
- DatePicker komponent kuupäevade valimiseks.

## Kuidas see töötab

### Rakenduse voog

1. Otsisin koodibaasist kõvakodeeritud stringide olemasolu
2. Lisasin keeletekstid failidesse `en.json` ja `et.json`
3. Asendasin stringid `useTranslations()` kutsetega
**Uuendatud failid**: Kõik rakenduse komponendi failid
- `headerSection`: Navigeerimise ja päise osa
- `quarterPlanner`: Peamine planeerija tekst
- `quarterTable`: Tabeli sildid ja teated
- `taskCreate`: Ülesande loomise lehe sisu
- `taskEdit`: Ülesande muutmise lehe sisu
- `taskForm`: Vormis olevad sildid ja nupud
- `languages`: Keelte nimetused valiku jaoks

#### 22: Keele valiku lisamine
**Fail**: `HeaderSection.tsx`
- Integreerin `Dropdown` komponendi
- Loetlen kõik saadaval olevad locale'id
- Uuendan locale'i `setLocale()` funktsiooni kaudu
- Kasutajaliides värskendatakse reaktiivselt `useLocale` hook'i abil

---

### 8: Refaktorimine ja koodi kvaliteet

#### 23: Refaktoreerin QuarterTable komponenti
**Refaktoreerimise põhjendus**:
- Algne `QuarterTable.tsx` oli üle 400 rea pikk
- Raske testimis- ja hooldustegevus
- Segatud vastutused (renderdamine, andmete töötlemine, lohistamine)

#### 24: Paranda React Hooks rikkumised
**Probleem**: Tingimuslik tagastamine enne kõigi hook'ide väljakutsumist
**Parandus**:
- Viin kõik hook'id komponendi tippu
- Tingimuslik renderdamine toimub pärast kõigi hook'ide kutsumist

#### 25: Lisa tüübiturbe täiustusi
- Lisan puuduvat `durationDays` Task tüüpi
- Korjan üles kaudsed `any` tüübid
- Lisan õiged vigade käsitlemise tübid
- Veendun, et kõik importimised kasutavad TypeScript teid (`@/`)

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

