# Entrega: la web de Rastro con React

## Arranque local con json-server

Instala las dependencias. Si es tu primera vez en este clon, copia `.env.example` a `.env`. El valor de `VITE_API_URL` debe ser `http://localhost:3001`.

```powershell
npm install
Copy-Item .env.example .env
npm run api
```

En otra terminal, ejecuta `npm run dev` y abre la dirección que muestra Vite, normalmente `http://localhost:5173`.

## Capturas de la versión con json-server

### Listado filtrado

![Listado de móviles por hasta 200 €](docs/capturas/listado.png)

### Ficha como comprador

![Ficha del Seat Ibiza con el formulario y la lista de ofertas](docs/capturas/comprador.png)

### Ficha como vendedor

![Ficha del Seat Ibiza con los controles para cambiar el precio y borrar](docs/capturas/vendedor.png)

### Publicar un anuncio

![Formulario para publicar un anuncio](docs/capturas/publicar.png)

## Objetivo

Es la **segunda entrega de React** y también es **obligatoria**. Hazla después de la de FitVal: reutiliza mucho de lo que hiciste allí.

Vas a hacer la web de **Rastro**, la app de compraventa de segunda mano de tu API de Express + MongoDB: ver anuncios, filtrarlos, hacer ofertas, publicar un anuncio y cambiarle el precio.

Igual que en FitVal, es **una sola entrega** con **dos partes**:

1. **Primera parte (PARTE 0 a 5): solo React**, con un `db.json` que te damos y **json-server**. Se cierra con la etiqueta `v1-json-server`.
2. **Segunda parte (PARTE 6): tu API.** Subes tu API de Rastro a internet (Render + MongoDB Atlas), conectas la web con ella, arreglas los errores con ayuda de la IA y publicas la web.

Respecto a la de FitVal, practicas cosas nuevas:

- **Context** para saber quién es el usuario (apunte 02), en vez de Redux.
- **Varios filtros** guardados en la URL.
- Un componente hijo que **avisa al padre** (props con funciones).
- Pedir **dos cosas a la vez** en una página (el anuncio y sus ofertas).
- **PATCH** y **DELETE** con RTK Query.
- **Desplegar una API de Express** en Render con su base de datos en **MongoDB Atlas**.

**Tiempo orientativo:** primera parte, 4 o 5 horas; segunda parte, 2 o 3 horas.

**Qué vas a entregar:** el repositorio `rastro-web` con una PR por parte y `respuestas.md`; al final, la dirección de Netlify y la de tu API en Render. Se entrega **una vez**, al final, como FitVal.

**Cómo trabajarla:**

- Es **menos guiada** que la de FitVal. Lo que ya hiciste allí (crear el proyecto, el CI, Netlify, el store, `Loading`…) aquí se dice en una línea. Ten tu `fitval-web` abierto al lado.
- Los **estilos** te los damos, como en FitVal: cópialos tal cual.
- Igual que antes: **Cópialo tal cual** (código de apoyo) y **Complétalo** (esqueletos con `// TODO`).
- En la primera parte, sin IA para escribir el código. En la segunda sí, con las normas de FitVal (Parte 5.3).

---

## Lo que vas a construir

| Ruta | Página | Qué pide a json-server (primera parte) |
|---|---|---|
| `/` | Anuncios, con filtros | `GET /listings?category=...&city=...&price:lte=...` |
| `/listings/:id` | Ficha del anuncio, sus ofertas y el formulario para ofertar | `GET /listings/:id`, `GET /offers?listingId=...`, `POST /offers` |
| `/listings/:id` si eres el vendedor | Cambiar el precio o borrar | `PATCH /listings/:id`, `DELETE /listings/:id` |
| `/listings/new` | Publicar un anuncio | `POST /listings` |
| cualquier otra | Página no encontrada | — |

En la segunda parte, **tu API** decide las rutas, y no todas coinciden con estas.

![Anuncios](img/06_react_rastro/01_anuncios.png)

### ¿Quién soy? Un usuario de mentira

La API de Rastro **no tiene login**. Para saber quién hace una oferta o publica un anuncio, la web tendrá un desplegable **"Soy..."** arriba a la derecha con los 5 usuarios de los datos. Es una **simulación**: cualquiera puede elegir cualquier usuario. En una app de verdad, esto lo haría el login, como en FitVal.

---

# PARTE 0 — El proyecto, el CI y Netlify

Igual que la **Parte 0 de FitVal**, con estos cambios:

- [ ] El proyecto y el repositorio se llaman `rastro-web`.
- [ ] `<title>Rastro</title>`.
- [ ] El mismo `ci.yml`, el mismo `public/_redirects` y el mismo ruleset.
- [ ] En Netlify: `rastro-tunombre`.
- [ ] json-server instalado (`npm install -D json-server`), el script `api` en `package.json` y el `db.json` de abajo, con su copia `db.initial.json`.
- [ ] `src/index.css` es este. **Cópialo tal cual:**

```css
/* ===== Estilos generales de Rastro (se copian tal cual) ===== */
:root {
  --ink: #1c1917; /* texto */
  --muted: #57534e; /* texto secundario */
  --line: #e7e5e4; /* bordes */
  --bg: #f6f5f1; /* fondo */
  --accent: #0f766e; /* verde azulado: botones y enlaces */
  --danger: #991b1b;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: var(--bg);
  color: var(--ink);
}

main {
  max-width: 1120px;
  margin: 0 auto;
  padding: 32px 24px;
}

h1 {
  margin: 0 0 16px;
  font-size: 32px;
}

a {
  color: var(--accent);
}

/* Formularios */
form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  background: white;
  border: 1px solid var(--line);
  border-radius: 12px;
}

label {
  font-size: 14px;
  font-weight: 600;
}

input,
select,
textarea {
  font: inherit;
  padding: 9px 12px;
  border: 1px solid #a8a29e;
  border-radius: 8px;
  background: white;
}

button {
  font: inherit;
  font-weight: 600;
  padding: 10px 18px;
  border: 0;
  border-radius: 8px;
  background: var(--accent);
  color: white;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: default;
}

/* Botón rojo (borrar) */
.danger {
  background: white;
  color: var(--danger);
  border: 1px solid #fca5a5;
}

/* Mensajes */
.error {
  padding: 10px 12px;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  background: #fef2f2;
  color: #7f1d1d;
}

.field-error {
  margin: 0;
  font-size: 13px;
  color: var(--danger);
}

.loading {
  color: var(--muted);
}

/* Rejilla de tarjetas */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
}
```

## Los datos: `db.json`

Son los datos de la entrega de Express, en el formato de json-server. **Cópialo tal cual** en la raíz del proyecto:

```json
{
  "listings": [
    {"id": "listing-1", "title": "Seat Ibiza 2015", "description": "Siempre en garaje, ITV pasada.", "price": 6500, "category": "Cars", "status": "AVAILABLE", "city": "Valencia", "publishedAt": "2026-10-01T00:00:00.000Z", "views": 340, "seller": {"id": "660000000000000000000002", "name": "Luis Martín"}, "photos": [{"url": "https://img.rastro.es/a1-1.jpg", "order": 1}, {"url": "https://img.rastro.es/a1-2.jpg", "order": 2}], "attributes": {"brand": "Seat", "model": "Ibiza", "year": 2015, "km": 98000, "fuel": "petrol"}},
    {"id": "listing-2", "title": "Ford Focus 2012", "description": "Correa cambiada hace un año.", "price": 4200, "category": "Cars", "status": "AVAILABLE", "city": "Castellón", "publishedAt": "2026-10-12T00:00:00.000Z", "views": 95, "seller": {"id": "660000000000000000000004", "name": "Hugo Sanz"}, "photos": [{"url": "https://img.rastro.es/a2-1.jpg", "order": 1}], "attributes": {"brand": "Ford", "model": "Focus", "year": 2012, "km": 165000, "fuel": "diesel"}},
    {"id": "listing-3", "title": "iPhone 13 128 GB", "description": "Con funda y cargador.", "price": 380, "category": "Phones", "status": "AVAILABLE", "city": "Valencia", "publishedAt": "2026-10-20T00:00:00.000Z", "views": 512, "seller": {"id": "660000000000000000000001", "name": "Ana García"}, "photos": [{"url": "https://img.rastro.es/a3-1.jpg", "order": 1}, {"url": "https://img.rastro.es/a3-2.jpg", "order": 2}, {"url": "https://img.rastro.es/a3-3.jpg", "order": 3}], "attributes": {"brand": "Apple", "model": "iPhone 13", "storageGB": 128, "batteryPct": 87}},
    {"id": "listing-4", "title": "Samsung Galaxy A52", "description": "Pantalla sin rayas.", "price": 150, "category": "Phones", "status": "SOLD", "city": "Alicante", "publishedAt": "2026-09-05T00:00:00.000Z", "views": 210, "seller": {"id": "660000000000000000000003", "name": "Marta Ruiz"}, "photos": [{"url": "https://img.rastro.es/a4-1.jpg", "order": 1}], "attributes": {"brand": "Samsung", "model": "Galaxy A52", "storageGB": 128, "batteryPct": 80}},
    {"id": "listing-5", "title": "Xiaomi Redmi Note 10", "description": "Funciona perfecto.", "price": 90, "category": "Phones", "status": "AVAILABLE", "city": "Valencia", "publishedAt": "2026-10-22T00:00:00.000Z", "views": 48, "seller": {"id": "660000000000000000000002", "name": "Luis Martín"}, "photos": [{"url": "https://img.rastro.es/a5-1.jpg", "order": 1}], "attributes": {"brand": "Xiaomi", "model": "Redmi Note 10", "storageGB": 64, "batteryPct": 91}},
    {"id": "listing-6", "title": "Chaqueta vaquera Levi's", "description": "Poco uso.", "price": 25, "category": "Clothes", "status": "AVAILABLE", "city": "Alicante", "publishedAt": "2026-10-25T00:00:00.000Z", "views": 12, "seller": {"id": "660000000000000000000003", "name": "Marta Ruiz"}, "photos": [], "attributes": {"size": "M", "brand": "Levi's", "gender": "unisex"}},
    {"id": "listing-7", "title": "Zapatillas Nike Air", "description": "Talla 42, como nuevas.", "price": 40, "category": "Clothes", "status": "RESERVED", "city": "Valencia", "publishedAt": "2026-10-18T00:00:00.000Z", "views": 77, "seller": {"id": "660000000000000000000001", "name": "Ana García"}, "photos": [{"url": "https://img.rastro.es/a7-1.jpg", "order": 1}], "attributes": {"size": "42", "brand": "Nike", "gender": "men"}},
    {"id": "listing-8", "title": "Mesa de comedor de roble", "description": "Para 6 personas.", "price": 120, "category": "Furniture", "status": "AVAILABLE", "city": "Castellón", "publishedAt": "2026-10-26T00:00:00.000Z", "views": 160, "seller": {"id": "660000000000000000000004", "name": "Hugo Sanz"}, "photos": [{"url": "https://img.rastro.es/a8-1.jpg", "order": 1}], "attributes": {"material": "oak", "width": 160, "depth": 90, "height": 75}}
  ],
  "offers": [
    {"id": "offer-1", "listingId": "listing-3", "amount": 340, "status": "PENDING", "createdAt": "2026-10-27T00:00:00.000Z", "buyer": {"id": "660000000000000000000005", "name": "Sara López"}},
    {"id": "offer-2", "listingId": "listing-1", "amount": 6000, "status": "REJECTED", "createdAt": "2026-10-05T00:00:00.000Z", "buyer": {"id": "660000000000000000000001", "name": "Ana García"}},
    {"id": "offer-3", "listingId": "listing-1", "amount": 6200, "status": "PENDING", "createdAt": "2026-10-26T00:00:00.000Z", "buyer": {"id": "660000000000000000000005", "name": "Sara López"}},
    {"id": "offer-4", "listingId": "listing-4", "amount": 150, "status": "ACCEPTED", "createdAt": "2026-09-10T00:00:00.000Z", "buyer": {"id": "660000000000000000000004", "name": "Hugo Sanz"}},
    {"id": "offer-5", "listingId": "listing-7", "amount": 35, "status": "ACCEPTED", "createdAt": "2026-10-27T00:00:00.000Z", "buyer": {"id": "660000000000000000000002", "name": "Luis Martín"}}
  ]
}
```

Fíjate en tres cosas:

- Los anuncios tienen `id` inventados (`listing-1`). En tu API son los `_id` de MongoDB.
- Cada oferta guarda el `listingId` de su anuncio. Así json-server puede filtrar: `GET /offers?listingId=listing-1`.
- Los usuarios (`seller.id`, `buyer.id`) sí son los de tu base de datos de MongoDB.

Prueba con `npm run api`:

| Abre | Resultado esperado |
|---|---|
| `http://localhost:3001/listings?_sort=-publishedAt` | Los 8 anuncios, del más nuevo (la mesa de roble) al más viejo |
| `http://localhost:3001/listings?category=Phones&price:lte=200` | El Xiaomi y el Samsung. `price:lte` = precio menor o igual |
| `http://localhost:3001/offers?listingId=listing-1` | Las 2 ofertas del Seat Ibiza |

---

# PARTE 1 — Los anuncios

**Rama:** `feature/read-listings`. **Apuntes:** 01, 03 y 04.

## 1.1 Lo que se repite de FitVal

- [ ] `.env` y `.env.example` con `VITE_API_URL=http://localhost:3001` (json-server), `.env` en el `.gitignore` y `src/vite-env.d.ts`.
- [ ] `src/app/store.ts` y `src/app/hooks.ts` como en la Parte 2 de FitVal (aquí **no** hay sesión: el store solo tiene la caché de RTK Query).
- [ ] `src/components/ui/Loading.tsx`, `Layout.tsx` y `NotFoundPage.tsx`: cópialos de tu FitVal.
- [ ] `main.tsx` con el `Provider`, `App.tsx` con el `RouterProvider` y un `router.tsx` con la ruta índice y la `*`.

## 1.2 Código de apoyo

**Cópialos tal cual.**

`src/app/types.ts`:

```ts
// Cómo llegan los datos (de momento, de db.json)

export type ListingStatus = "AVAILABLE" | "RESERVED" | "SOLD";
export type OfferStatus = "PENDING" | "ACCEPTED" | "REJECTED";

// Lo que usa el listado (GET /listings)
export type ListingSummary = {
  id: string;
  title: string;
  price: number;
  category: string;
  city: string;
  status: ListingStatus;
};

// La ficha completa (GET /listings/:id): lo de arriba y más
export type Listing = ListingSummary & {
  description: string;
  publishedAt: string;
  views: number;
  seller: { id: string; name: string };
  attributes: Record<string, string | number>;
};

// Un anuncio nuevo: todo menos el id, que lo pone json-server
export type NewListing = Omit<Listing, "id">;

export type Offer = {
  id: string;
  listingId: string;
  amount: number;
  status: OfferStatus;
  createdAt: string;
  buyer: { id: string; name: string };
};

// json-server guarda lo que le mandes: hay que mandarlo todo
export type NewOffer = Omit<Offer, "id">;

// Los filtros del listado. Todos opcionales
export type ListingFilters = {
  category?: string;
  city?: string;
  maxPrice?: string;
};
```

`src/app/labels.ts`, los textos en español de los valores que llegan en inglés:

```ts
// Los textos en español de los valores que llegan en inglés (se copia tal cual)

export const CATEGORY_LABELS: Record<string, string> = {
  Cars: "Coches",
  Phones: "Móviles",
  Clothes: "Ropa",
  Furniture: "Muebles",
};

export const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Disponible",
  RESERVED: "Reservado",
  SOLD: "Vendido",
  PENDING: "Pendiente",
  ACCEPTED: "Aceptada",
  REJECTED: "Rechazada",
};

export const CITIES = ["Valencia", "Alicante", "Castellón"];

// 6500 → "6.500 €"
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    useGrouping: "always", // si no, en español solo pone el punto desde 10.000
  }).format(price);
}
```

`src/app/apiError.ts`. Ojo: tu API de Express responde `{ error: "texto" }`, no `{ message }` como NestJS. Lo dejamos hecho para la Parte 6:

```ts
// Saca un texto legible de un error de la API (se copia tal cual).
// La API de Rastro responde { error: "texto" }
export function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { error?: string } }).data;
    if (data?.error) return data.error;
  }
  return "No se ha podido conectar con la API.";
}
```

## 1.3 RTK Query

`src/app/api.ts`. **Complétalo**:

```ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ListingFilters, ListingSummary } from "./types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ["Listing", "Offer"],
  endpoints: (builder) => ({
    // GET /listings?category=Cars&city=Valencia&price:lte=500&_sort=-publishedAt
    getListings: builder.query<ListingSummary[], ListingFilters>({
      query: ({ category, city, maxPrice }) => ({
        url: "/listings",
        // params: RTK Query monta el ?category=...&city=... (y se salta los que son undefined)
        // price:lte = precio menor o igual. _sort=-publishedAt = del más nuevo al más viejo
        params: { category, city, "price:lte": maxPrice, _sort: "-publishedAt" },
      }),
      // TODO: providesTags con "Listing"
    }),
  }),
});

export const { useGetListingsQuery } = api;
```

## 1.4 La etiqueta de estado: `StatusBadge`

La misma etiqueta sirve para los anuncios (Disponible, Reservado, Vendido) y para las ofertas (Pendiente, Aceptada, Rechazada).

`src/features/listings/StatusBadge.module.css`. **Cópialo tal cual.** Fíjate: las clases se llaman **igual que los estados**.

```css
.badge {
  width: fit-content; /* que no ocupe todo el ancho */
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.AVAILABLE,
.ACCEPTED {
  background: #ccfbf1;
  color: #115e59;
}

.RESERVED,
.PENDING {
  background: #ffedd5;
  color: #9a3412;
}

.SOLD,
.REJECTED {
  background: #e7e5e4;
  color: #44403c;
}
```

`src/features/listings/StatusBadge.tsx`. **Complétalo**:

```tsx
import { STATUS_LABELS } from "../../app/labels";
import styles from "./StatusBadge.module.css";

type StatusBadgeProps = {
  status: string; // AVAILABLE, RESERVED, SOLD... (también los de las ofertas)
};

export function StatusBadge({ status }: StatusBadgeProps) {
  // styles.AVAILABLE es lo mismo que styles["AVAILABLE"]. Y "AVAILABLE" es justo el valor de status...
  // TODO: className con dos clases: styles.badge y styles[status]
  // TODO: el texto es la traducción: STATUS_LABELS[status]
  return <span>{status}</span>;
}
```

## 1.5 La tarjeta: `ListingCard`

Las fotos de los datos son direcciones inventadas (`img.rastro.es`) y el listado no las devuelve. En su lugar, un recuadro de color según la categoría.

`src/features/listings/ListingCard.module.css`. **Cópialo tal cual:**

```css
.card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: white;
  border: 1px solid var(--line);
  border-radius: 12px;
  color: var(--ink);
  text-decoration: none;
}

.card:hover {
  border-color: var(--accent);
}

/* La "foto": un recuadro de color según la categoría */
.image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  font-weight: 600;
}

.Cars {
  background: #dbeafe;
  color: #1e3a8a;
}

.Phones {
  background: #ede9fe;
  color: #4c1d95;
}

.Clothes {
  background: #fce7f3;
  color: #831843;
}

.Furniture {
  background: #fef3c7;
  color: #78350f;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
}

.price {
  font-size: 22px;
  font-weight: 700;
}

.title {
  font-weight: 600;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 14px;
  color: var(--muted);
}
```

`src/features/listings/ListingCard.tsx`. **Hazlo tú**, mirando la captura y tu `ClassCard` de FitVal:

- [ ] Recibe `listing: ListingSummary` por props.
- [ ] Toda la tarjeta es un `Link` a `/listings/${listing.id}` con `styles.card`.
- [ ] Arriba, un `<div>` con **dos** clases (`styles.image` y la de su categoría, igual que en `StatusBadge`) y el nombre de la categoría en español.
- [ ] Debajo, `styles.body` con el precio (`formatPrice`), el título y un pie (`styles.footer`) con la ciudad y el `StatusBadge`.

## 1.6 La página

`src/features/listings/ListingsPage.tsx`: título "Anuncios", `useGetListingsQuery({})` (de momento sin filtros), `Loading`, error y la rejilla (`className="grid"`) de `ListingCard`. Ponla en la ruta índice.

Y una cabecera sencilla: `src/components/layout/Header.module.css`, **cópialo tal cual**:

```css
.header {
  background: white;
  border-bottom: 1px solid var(--line);
}

.nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
  max-width: 1120px;
  min-height: 64px;
  margin: 0 auto;
  padding: 0 24px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: var(--accent);
  text-decoration: none;
}

.nav a:not(.logo) {
  color: var(--ink);
  text-decoration: none;
}

/* NavLink añade la clase "active" al enlace de la página actual */
.nav a:global(.active) {
  color: var(--accent);
  border-bottom: 2px solid var(--accent);
  padding-bottom: 4px;
}

.spacer {
  flex: 1;
}

.user {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--muted);
}
```

`Header.tsx`: el logo "rastro" (un `Link` a `/`), los `NavLink` "Anuncios" (`/`, con `end`) y "Publicar" (`/listings/new`), y un `<span className={styles.spacer} />`. El desplegable "Soy..." llegará en la Parte 5.

**Resultado esperado:** la captura del principio de la entrega, sin el "Soy...". El Samsung sale **Vendido** y las zapatillas **Reservado**.

---

# PARTE 2 — Los filtros en la URL

**Rama:** `feature/listing-filters`. **Apuntes:** 02 (hijo → padre) y 03 (`useSearchParams`).

Tres filtros: categoría, ciudad y precio máximo. Los tres en la URL: `/?category=Phones&maxPrice=200`.

![Filtros](img/06_react_rastro/02_filtros.png)

## 2.1 El componente de los filtros

`ListingFilters` **no guarda** los filtros: los recibe del padre y, cuando cambian, **avisa** al padre con una función. Es el "hijo → padre" del apunte 02, apartado 6.

`src/features/listings/ListingFilters.module.css`. **Cópialo tal cual:**

```css
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border: 1px solid var(--line);
  border-radius: 12px;
}

.field {
  display: flex;
  flex: 1 1 180px;
  flex-direction: column;
  gap: 6px;
}
```

`src/features/listings/ListingFilters.tsx`. **Complétalo**:

```tsx
import { CATEGORY_LABELS, CITIES } from "../../app/labels";
import type { ListingFilters as Filters } from "../../app/types";
import styles from "./ListingFilters.module.css";

type ListingFiltersProps = {
  filters: Filters;
  onChange: (name: keyof Filters, value: string) => void; // avisa al padre: "este filtro ahora vale esto"
};

export function ListingFilters({ filters, onChange }: ListingFiltersProps) {
  return (
    <div className={styles.filters}>
      <div className={styles.field}>
        <label htmlFor="category">Categoría</label>
        <select
          id="category"
          value={filters.category ?? ""}
          onChange={(e) => onChange("category", e.target.value)}
        >
          <option value="">Todas</option>
          {/* Object.entries convierte { Cars: "Coches", ... } en [["Cars", "Coches"], ...] */}
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="city">Ciudad</label>
        {/* TODO: un <select> igual, con "Todas" y una <option> por cada ciudad de CITIES */}
      </div>

      <div className={styles.field}>
        <label htmlFor="maxPrice">Precio máximo (€)</label>
        {/* TODO: un <input type="number" min="0" placeholder="Sin límite"> con value y onChange */}
      </div>
    </div>
  );
}
```

## 2.2 La página lee y escribe la URL

En `ListingsPage.tsx`. **Complétalo**:

```tsx
// Los filtros viven en la URL: /?category=Cars&maxPrice=5000
const [searchParams, setSearchParams] = useSearchParams();

// Convierte la URL en un objeto: { category: "Cars", maxPrice: "5000" }
const filters: Filters = Object.fromEntries(searchParams);

// TODO: pásale filters a useGetListingsQuery

function changeFilter(name: keyof Filters, value: string) {
  const next = new URLSearchParams(searchParams); // una copia: el estado no se cambia
  // TODO: si value tiene algo, next.set(name, value). Si está vacío, next.delete(name)
  setSearchParams(next);
}
```

Y pinta `<ListingFilters filters={filters} onChange={changeFilter} />` debajo del título. Si no hay anuncios: "No hay anuncios con esos filtros.".

### Ejercicio 2.1

Elige **Móviles** y precio máximo **200**. Recarga. Copia la URL en otra pestaña.

**Pregunta 1:** ¿por qué `changeFilter` hace una copia con `new URLSearchParams(searchParams)` en vez de cambiar `searchParams` directamente? (Apunte 01, "No cambies el estado: crea uno nuevo".)

## Pruebas de la Parte 2

| Prueba | Resultado esperado |
|---|---|
| Categoría **Coches** | 2 anuncios. URL `/?category=Cars` |
| Categoría **Móviles** y máximo **200** | 2 anuncios (Xiaomi y Samsung) |
| Ciudad **Valencia** | 4 anuncios |
| Volver a **Todas** | El parámetro desaparece de la URL |
| Recargar con filtros | Los filtros siguen puestos |

---

# PARTE 3 — La ficha y las ofertas

**Rama:** `feature/listing-detail`. **Apunte:** 04.

## 3.1 Dos endpoints más

En `api.ts`, añade y exporta:

- [ ] `getListing`: `GET /listings/:id`. Recibe el id (`string`) y devuelve un `Listing`. Tag `"Listing"`.
- [ ] `getOffers`: `GET /offers?listingId=listing-1`. Recibe el id del anuncio y devuelve `Offer[]`. Tag `"Offer"`. Pista: `params: { listingId, _sort: "-createdAt" }`.

## 3.2 La lista de ofertas

`src/features/offers/OfferList.module.css`. **Cópialo tal cual:**

```css
.box {
  padding: 20px;
  background: white;
  border: 1px solid var(--line);
  border-radius: 12px;
}

.box h2 {
  margin: 0 0 8px;
  font-size: 18px;
}

.offer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
}
```

`src/features/offers/OfferList.tsx`. **Hazlo tú**:

- [ ] Recibe `listingId` por props y llama a `useGetOffersQuery(listingId)`. El componente pide **sus propios** datos.
- [ ] Un `<div className={styles.box}>` con `<h2>Ofertas (2)</h2>` (el número real).
- [ ] Si no hay ofertas: "Todavía no hay ofertas.".
- [ ] Una fila (`styles.offer`) por oferta: nombre del comprador, cantidad (`formatPrice`, en `<strong>`) y su `StatusBadge`.

## 3.3 La ficha

`src/features/listings/ListingDetailPage.module.css`. **Cópialo tal cual:**

```css
.layout {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 24px;
}

.main {
  display: flex;
  flex: 999 1 520px;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.side {
  display: flex;
  flex: 1 1 300px;
  flex-direction: column;
  gap: 16px;
}

.price {
  font-size: 30px;
  font-weight: 700;
}

.facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  padding: 16px;
  background: white;
  border: 1px solid var(--line);
  border-radius: 12px;
}

.facts dt {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
}

.facts dd {
  margin: 2px 0 0;
}

.row {
  display: flex;
  gap: 8px;
}

.row input {
  flex: 1;
  min-width: 0;
}
```

`src/features/listings/ListingDetailPage.tsx`. **Hazlo tú**, mirando la captura y tu `ClassDetailPage`:

- [ ] `useParams` y `useGetListingQuery(id)`. Carga, error ("Ese anuncio no existe." y enlace a `/`).
- [ ] Enlace "← Volver a los anuncios".
- [ ] Un `<div className={styles.layout}>` con dos columnas:
  - `<article className={styles.main}>`: título, `StatusBadge`, precio (`styles.price`), descripción y un `<dl className={styles.facts}>` con Categoría, Ciudad, Vendedor y Visitas (cada uno un `<div>` con `<dt>` y `<dd>`).
  - `<aside className={styles.side}>`: de momento solo `<OfferList listingId={listing.id} />`.

Añade la ruta `listings/:id`.

![Ficha de un anuncio](img/06_react_rastro/03_ficha_comprador.png)

## Pruebas de la Parte 3

| Prueba | Resultado esperado |
|---|---|
| Pulsar el Seat Ibiza | Su ficha: 6.500 €, Luis Martín, 2 ofertas (Ana rechazada, Sara pendiente) |
| Pulsar la mesa de roble | "Todavía no hay ofertas." |
| `/listings/abc` | "Ese anuncio no existe." (json-server da `404`) |

---

# PARTE 4 — ¿Quién soy? Ofertar y publicar

**Rama:** `feature/current-user`. **Apuntes:** 02 (Context, React Hook Form y Zod) y 04 (mutations).

## 4.1 El usuario actual con Context

¿Por qué Context y no Redux? Es un dato pequeño que casi nunca cambia y que leen pocos componentes. Context viene con React y no necesita librerías. Redux lo usamos para la caché de la API, que es más grande.

`src/features/users/users.ts`. **Cópialo tal cual** (ni `db.json` ni tu API tienen `GET /users`):

```ts
// No hay GET /users: los 5 usuarios de los datos van aquí (se copia tal cual)
export type User = {
  id: string;
  name: string;
};

export const USERS: User[] = [
  { id: "660000000000000000000001", name: "Ana García" },
  { id: "660000000000000000000002", name: "Luis Martín" },
  { id: "660000000000000000000003", name: "Marta Ruiz" },
  { id: "660000000000000000000004", name: "Hugo Sanz" },
  { id: "660000000000000000000005", name: "Sara López" },
];
```

Sigue los **tres pasos** del apunte 02, apartado 8:

**Paso 1.** `src/features/users/CurrentUserContext.ts`. **Complétalo**:

```ts
import { createContext, useContext } from "react";
import type { User } from "./users";

type CurrentUserValue = {
  user: User; // quién soy
  changeUser: (id: string) => void; // para cambiar de usuario
};

// TODO: export const CurrentUserContext = createContext<CurrentUserValue | null>(null);

// Atajo para leer el contexto desde cualquier componente
export function useCurrentUser() {
  // TODO: lee el contexto con useContext
  // TODO: si es null, lanza un Error: "useCurrentUser tiene que estar dentro de <CurrentUserProvider>"
  // TODO: devuélvelo
}
```

**Paso 2.** `src/features/users/CurrentUserProvider.tsx`. **Complétalo**:

```tsx
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { CurrentUserContext } from "./CurrentUserContext";
import { USERS } from "./users";

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  // Al arrancar: el último usuario elegido o, si no hay, el primero.
  // La función de dentro solo se ejecuta la primera vez
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") ?? USERS[0].id);

  // TODO: un useEffect que guarde userId en localStorage cada vez que cambie

  // TODO: busca en USERS el usuario con ese id (si no está, USERS[0])
  const user = USERS[0];

  return (
    <CurrentUserContext.Provider value={{ user, changeUser: setUserId }}>
      {children}
    </CurrentUserContext.Provider>
  );
}
```

**Paso 3.** En `main.tsx`, envuelve `<App />` con `<CurrentUserProvider>` (dentro del `Provider` de Redux).

Ahora el desplegable. `src/features/users/UserSelector.tsx`, **hazlo tú**:

- [ ] Lee `user` y `changeUser` con `useCurrentUser()`.
- [ ] Un `<label htmlFor="current-user">Soy</label>` y un `<select id="current-user">` controlado: `value={user.id}` y, al cambiar, `changeUser(...)`.
- [ ] Una `<option>` por cada usuario de `USERS`, con `value={u.id}` y el nombre.

Ponlo en la cabecera, dentro de `<div className={styles.user}>`, después del `spacer`.

## 4.2 Hacer una oferta

En `api.ts`: `createOffer`, `POST /offers`. Recibe `NewOffer`, devuelve `Offer` e **invalida** `"Offer"`.

`src/features/offers/OfferForm.tsx`. **Complétalo**. Es un formulario controlado sencillo, como el login de FitVal:

```tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { useCreateOfferMutation } from "../../app/api";
import { getErrorMessage } from "../../app/apiError";
import { useCurrentUser } from "../users/CurrentUserContext";

type OfferFormProps = {
  listingId: string;
};

export function OfferForm({ listingId }: OfferFormProps) {
  const { user } = useCurrentUser(); // quién oferta: el del desplegable
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [createOffer, { isLoading }] = useCreateOfferMutation();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: si Number(amount) <= 0, error "La oferta tiene que ser mayor que cero." y return
    setError(null);
    try {
      // TODO: createOffer(...).unwrap() con TODO lo que guarda una oferta (json-server no pone nada):
      //   listingId, amount (como número), status: "PENDING",
      //   createdAt: new Date().toISOString() y buyer: user (ya es { id, name })
      setAmount("");
    } catch (e) {
      // TODO: guarda el mensaje (getErrorMessage)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Hacer una oferta</h2>
      {/* TODO: el error, si hay */}
      <label htmlFor="amount">Tu oferta (€)</label>
      {/* TODO: input type="number" controlado con amount */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Enviando..." : "Ofertar"}
      </button>
    </form>
  );
}
```

En la ficha, dentro del `<aside>` y **antes** de la lista:

- Si eres el vendedor: nada (en la Parte 5 saldrá otra cosa).
- Si no lo eres y el anuncio está **disponible** (`"AVAILABLE"`): el `OfferForm`.
- Si no está disponible: `<p className="loading">Este anuncio ya no admite ofertas.</p>`.

```tsx
const { user } = useCurrentUser();
// ...
const isSeller = listing.seller.id === user.id;
```

![Un anuncio vendido no admite ofertas](img/06_react_rastro/04_vendido.png)

### Ejercicio 4.1

Elige a **Sara López** y oferta 6.100 € por el Seat. La lista de ofertas se actualiza sola.

**Pregunta 2:** `OfferForm` y `OfferList` son hermanos y no se pasan nada. ¿Cómo se entera la lista de que hay una oferta nueva?

## 4.3 Publicar un anuncio

En `api.ts`: `createListing`, `POST /listings`. Recibe `NewListing`, devuelve `Listing` e invalida `"Listing"`.

`src/features/listings/NewListingPage.tsx`. **Hazlo tú**, a partir de `CreateClassForm` de FitVal:

- [ ] Zod: `title`, `description` y `city` textos no vacíos (con `trim()`); `price` número mayor o igual que 0 ("El precio no puede ser negativo"); `category` no vacío ("Elige una categoría").
- [ ] Campos: título (`input`), descripción (`textarea` de 3 filas), precio (`valueAsNumber`), categoría (`select` con "Elige una" vacío y las 4 de `CATEGORY_LABELS`) y ciudad.
- [ ] Debajo: "Se publicará a nombre de **Hugo Sanz**" (el usuario actual).
- [ ] Al enviar: `createListing({ ...data, status: "AVAILABLE", views: 0, publishedAt: new Date().toISOString(), seller: user, attributes: {} }).unwrap()`. Con lo que devuelve (json-server le pone el `id`): `navigate(\`/listings/${created.id}\`)`.
- [ ] Si la API falla, el mensaje en rojo.
- [ ] Ruta `listings/new`. **Ojo con el orden:** va **antes** que `listings/:id`. Si no, ¿qué creería React Router que es `new`?

| Validación de Zod | Publicado |
|---|---|
| ![Validación](img/06_react_rastro/06_publicar_validacion.png) | ![Publicado](img/06_react_rastro/07_publicado.png) |

## Pruebas de la Parte 4

| Prueba | Resultado esperado |
|---|---|
| Cambiar de usuario y recargar | Sigue el usuario elegido |
| Sara oferta 6.100 € por el Seat | La lista pasa a 3 ofertas sin recargar |
| Oferta de 0 € | "La oferta tiene que ser mayor que cero." (no llega a la API) |
| El Samsung (vendido), como Sara | "Este anuncio ya no admite ofertas." y no sale el formulario |
| Luis Martín en el Seat | No sale el formulario de oferta |
| Publicar con precio `-5` | "El precio no puede ser negativo" |
| Publicar uno correcto como Hugo | Va a su ficha: vendedor Hugo Sanz, 0 ofertas. Sale en el listado |

---

# PARTE 5 — El vendedor

**Rama:** `feature/seller-panel`. **Apunte:** 04 (mutations).

## 5.1 Cambiar el precio y borrar

En `api.ts`, dos endpoints más. **Complétalos**:

```ts
// PATCH /listings/:id  (solo el precio)
updatePrice: builder.mutation<Listing, { id: string; price: number }>({
  // TODO: url `/listings/${id}`, method "PATCH" y body { price }
  invalidatesTags: ["Listing"],
}),
// DELETE /listings/:id. No usamos lo que devuelve: void
deleteListing: builder.mutation<void, string>({
  // TODO
}),
```

`src/features/listings/SellerPanel.tsx`. **Complétalo**:

```tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { useDeleteListingMutation, useUpdatePriceMutation } from "../../app/api";
import { getErrorMessage } from "../../app/apiError";
import type { Listing } from "../../app/types";
import styles from "./ListingDetailPage.module.css";

type SellerPanelProps = {
  listing: Listing;
};

// Lo que ve el vendedor en su propio anuncio
export function SellerPanel({ listing }: SellerPanelProps) {
  const [price, setPrice] = useState(String(listing.price)); // empieza con el precio actual
  const [error, setError] = useState<string | null>(null);
  const [updatePrice, { isLoading: saving }] = useUpdatePriceMutation();
  const [deleteListing] = useDeleteListingMutation();
  const navigate = useNavigate();

  async function savePrice(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      // TODO: updatePrice con el id y el precio como número. .unwrap()
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }

  async function remove() {
    // TODO: deleteListing con el id. .unwrap()
    // TODO: el anuncio ya no existe: navigate("/")
  }

  return (
    <form onSubmit={savePrice}>
      <h2>Tu anuncio</h2>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <label htmlFor="price">Nuevo precio (€)</label>
      <div className={styles.row}>
        <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <button type="submit" disabled={saving}>
          Guardar
        </button>
      </div>
      {/* type="button": si no, este botón también enviaría el formulario */}
      <button type="button" className="danger" onClick={remove}>
        Borrar anuncio
      </button>
    </form>
  );
}
```

En la ficha: si eres el vendedor, `SellerPanel`; si no, lo de la Parte 4 (el `OfferForm` o el aviso de que no admite ofertas). Pista: dos ternarios encadenados, `isSeller ? ... : listing.status === "AVAILABLE" ? ... : ...`.

![Ficha vista por el vendedor](img/06_react_rastro/05_ficha_vendedor.png)

### Ejercicio 5.1

Entra en el Seat Ibiza. Con el desplegable, cambia entre **Luis Martín** y **Ana García** varias veces, sin recargar.

**Pregunta 3:** ¿qué cambia en la ficha? La ficha no recibe el usuario por props: ¿cómo se entera de que ha cambiado? ¿Se vuelve a pedir el anuncio a la API? (Mira la pestaña Red.)

## Pruebas de la Parte 5

| Prueba | Resultado esperado |
|---|---|
| Luis en el Seat | "Tu anuncio" con el precio y el botón rojo |
| Cambiar el precio a 6.300 | El precio de la ficha cambia sin recargar. También en el listado |
| Publicar un anuncio y borrarlo | Vuelve al listado y ya no está |

Al terminar, cópiale a `db.json` el `db.initial.json`.

---

# Fin de la primera parte: cierra tu web con json-server

Igual que en FitVal, antes de tocar tu API:

1. Las PR de las partes 1 a 5, **fusionadas** y con los checks en verde.
2. En el `README.md`: cómo arrancarla (`npm install`, `npm run api`, `npm run dev`) y una captura de cada página: listado con filtros, ficha como comprador, ficha como vendedor y publicar.
3. `respuestas.md` con las preguntas 1 a 3.
4. La etiqueta `v1-json-server` en `main` (`git tag v1-json-server` y `git push origin v1-json-server`).

- [ ] `npm run lint` y `npm run build` sin errores. Ningún `// TODO`.

---

# PARTE 6 — Tu API en internet y conectada

**Repositorios:** `api-rastro` (el de la entrega de Express) y `rastro-web`. **Ramas:** `feature/deploy-render` en `api-rastro` y `feature/connect-api` en `rastro-web`. **Apuntes:** [06. Desplegar las APIs en Render](../sesiones/backend/06_despliegue_render.md) y 05 de React (Netlify).

Tu web funciona con json-server. Ahora toca la de verdad: preparar tu API, conectar la web en tu ordenador, arreglar lo que falle y publicar las dos.

### ⚠️ Los secretos no van a GitHub

La dirección de Atlas lleva tu contraseña dentro. Solo se escribe en tu `.env` (que no se sube) y en **Environment** de Render. Nunca en el código, en el README, en una PR, en una captura ni en un chat con la IA.

## 6.1 Prepara el código de la API

En `api-rastro`, rama `feature/deploy-render`, haz los cambios del apartado 2 del apunte 06:

- [ ] `src/index.ts`: el puerto sale de `process.env.PORT`, con `3000` si no existe.
- [ ] `package.json`: los scripts `build` (`tsc`) y `start` (`node dist/index.js`).
- [ ] `tsconfig.json`: `"rootDir": "src"` dentro de `compilerOptions`.

Y añade **CORS**, el middleware del apunte de Express (apartado 7), con el origen en una variable. Va **antes** de `express.json()`:

```ts
// CORS: deja que la web de React llame a la API
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:5173";
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN); // quién
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE"); // qué métodos
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // qué cabeceras
  if (req.method === "OPTIONS") {
    res.sendStatus(204); // el navegador pregunta antes: le decimos que sí
    return;
  }
  next();
});
```

**Pregunta 4:** ¿por qué hacen falta `PATCH` y `DELETE` en la lista y `Content-Type` en las cabeceras? ¿Qué petición de tu web fallaría sin cada uno?

Compruébalo como lo hará Render, con tu MongoDB de Docker arrancado:

```bash
npm run build
PORT=4000 node --env-file=.env dist/index.js
```

En PowerShell, la segunda línea es `$env:PORT=4000; node --env-file=.env dist/index.js`.

**Resultado esperado:** `GET http://localhost:4000/api/health` responde `200`.

Después: `npm run lint`, commit, push, PR, checks en verde y **merge**.

## 6.2 Conecta la web en tu ordenador

1. Arranca tu API en local (`npm run dev` en `api-rastro`, con MongoDB de Docker).
2. Para json-server.
3. En `rastro-web`, rama `feature/connect-api`: `VITE_API_URL=http://localhost:3000/api` en `.env` y `.env.example`. Reinicia `npm run dev`.

## 6.3 Lo que tienes que comprobar

Trabaja como en la Parte 5 de FitVal: **primero la pestaña Red**, después la consola, compara con tu API, arregla **un error cada vez** y apúntalo en el **diario de errores** de `respuestas.md`. Puedes usar la IA con las mismas normas (contexto, que te explique la causa, nada de secretos, compruébalo todo).

| Prueba | Lo que puede salir mal | Pista |
|---|---|---|
| Abrir `/` | Error en rojo y `blocked by CORS policy` en la consola | ¿Has hecho el 6.1? ¿Tu API se ha reiniciado? |
| Pulsar un anuncio | "Ese anuncio no existe." En Red, `/listings/undefined` con un `400`. En la consola, un aviso de la `key` | ¿Cómo se llama el id de un anuncio en lo que devuelve tu API? |
| Móviles hasta 200 € | Sale también el iPhone (380 €) | ¿Cómo se llama el filtro de precio en tu API? |
| La ficha del Seat | "Ofertas (0)". En Red, un `404`: `No existe la ruta GET /api/offers?...` | ¿Qué ruta da las ofertas de un anuncio en tu API? |
| Ofertar | `buyerId no tiene un formato válido` | ¿Qué campos espera tu `POST /offers`? ¿Quién pone el estado, la fecha y el nombre del comprador? |
| Publicar | `sellerId no tiene un formato válido` | ¿Qué campos espera tu `POST /listings`? |
| Entrar en un anuncio varias veces | Las visitas suben | No es un error: tu API suma una visita en cada `GET /listings/:id`. json-server no lo hacía |

Si algo no sale en esta tabla y falla, mejor: apúntalo también en el diario.

**Pregunta 5:** con tu API, entra en el Seat Ibiza y apunta las visitas. Vuelve al listado y entra otra vez. Ahora recarga. ¿Por qué al volver a la ficha **no** suben y al recargar **sí**?

## 6.4 La base de datos en MongoDB Atlas

Sigue el apartado 3 del apunte 06:

- [ ] Un cluster **Free** en Frankfurt (si ya tienes el de clase, usa el mismo).
- [ ] Un usuario de la base de datos con una contraseña solo de letras y números.
- [ ] `0.0.0.0/0` en la lista de IPs (Render gratis no tiene IP fija).
- [ ] La dirección `mongodb+srv://...` con tu contraseña.

Carga los datos del apartado 1.1 de la entrega de Express, con `mongosh`, pero conectándote a **Atlas**. El contenedor de MongoDB de clase trae `mongosh` dentro (cambia la dirección por la tuya, **entre comillas**):

```bash
docker start mongodb-practica
docker exec -it mongodb-practica mongosh "mongodb+srv://api-user:tucontraseña@cluster0.abcde.mongodb.net/"
```

Ahora haz **todo** el apartado 1.1 de la entrega de Express: `use rastro`, `db.dropDatabase()`, los `insertMany`, el `insertOne` de la valoración y los índices.

**Resultado esperado:** en Atlas, **Browse Collections** muestra la base de datos `rastro`, con 8 anuncios y 5 ofertas.

> ¿No tienes Docker a mano? MongoDB Compass trae un `mongosh` abajo del todo (pestaña **>_MONGOSH**).

## 6.5 La API en Render

Sigue el apartado 4 del apunte 06:

| Campo | Valor |
|---|---|
| Name | `api-rastro-tunombre` |
| Branch | `main` |
| Region | `Frankfurt (EU Central)` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Instance Type | `Free` |

| Variable | Valor |
|---|---|
| `MONGODB_URI` | La de Atlas |
| `DB_NAME` | `rastro` |
| `CORS_ORIGIN` | `https://rastro-tunombre.netlify.app` (sin `/` al final) |

Pruébala (la primera petición puede tardar un minuto: estaba dormida):

| Petición | Resultado esperado |
|---|---|
| `GET /api/health` | `200` |
| `GET /api/listings` | `200`, 8 anuncios |
| `GET /api/listings?category=Cars` | `200`, 2 anuncios |
| `GET /api/listings/670000000000000000000003` | `200`, el iPhone |
| `GET /api/listings/abc` | `400` |
| `GET /api/listings/670000000000000000000099` | `404` |

## 6.6 La web en Netlify

- [ ] En Netlify: `VITE_API_URL` = `https://api-rastro-tunombre.onrender.com/api` y **Trigger deploy**.
- [ ] En Render: comprueba que `CORS_ORIGIN` es exactamente tu dirección de Netlify.
- [ ] En el `README.md`: la dirección de Netlify y la de la API.

## Pruebas de la Parte 6

Con tu API (primero en local y después en Netlify):

| Prueba | Resultado esperado |
|---|---|
| Listado | 8 anuncios, del más nuevo (mesa de roble) al más viejo (Samsung, Vendido) |
| Móviles hasta 200 € | Xiaomi y Samsung |
| Seat Ibiza | 6.500 €, Luis Martín, 2 ofertas |
| `/listings/abc` y `/listings/670000000000000000000099` | "Ese anuncio no existe." |
| Sara oferta 6.100 € por el Seat | La lista pasa a 3 ofertas sin recargar |
| Publicar como Hugo | Va a su ficha. Sale en el listado |
| Luis cambia el precio del Seat y Hugo borra su anuncio | Funciona sin recargar |
| Recargar en `/listings/...` en Netlify | La ficha, sin 404 |

En la PR de `feature/connect-api`: la tabla con tus resultados y el diario de errores.

---

# Entrega

Una sola entrega en Moodle, al terminar la Parte 6:

1. La dirección del repositorio `rastro-web`, con las PR de las partes 1 a 6 fusionadas y los checks en verde, y la de la etiqueta `v1-json-server`.
2. La PR `feature/deploy-render` fusionada en `api-rastro`.
3. Las direcciones de Netlify y de tu API en Render.
4. `respuestas.md` con las preguntas 1 a 5 y el **diario de errores** (como mínimo, 4 filas).

- [ ] El `.env` no está en GitHub. Ninguna contraseña de Atlas en el código, en las PR ni en el diario.
- [ ] La web publicada funciona con tu API de Render.

---

## Si algo falla

| Síntoma | Causa probable |
|---|---|
| Error en rojo en el listado y `Failed to fetch` en Red | json-server (o tu API) no está arrancado, o el puerto de `VITE_API_URL` no es el suyo |
| `db.json` está lleno de pruebas | Cópiale encima `db.initial.json` |
| `blocked by CORS policy` solo al cambiar el precio o borrar | Falta `PATCH` o `DELETE` en `Access-Control-Allow-Methods` |
| `blocked by CORS policy` al ofertar o publicar | Falta `Content-Type` en `Access-Control-Allow-Headers` |
| Todos los anuncios salen sin color | `styles[listing.category]` no coincide con el CSS: las clases se llaman `Cars`, `Phones`... con mayúscula |
| `/listings/new` dice "Ese anuncio no existe." | La ruta `listings/new` está después de `listings/:id` |
| `useCurrentUser tiene que estar dentro de <CurrentUserProvider>` | Falta el `CurrentUserProvider` en `main.tsx` |
| Render: `MongoServerSelectionError` en los logs | Falta `0.0.0.0/0` en Atlas, o la contraseña de la dirección está mal |
| Render responde pero `GET /api/listings` da `[]` | Los datos se cargaron en otra base de datos: ¿hiciste `use rastro` antes de los `insertMany`? |

---

## Retos opcionales

1. **Aceptar una oferta.** Si hiciste el reto de la entrega de Express: en `OfferList`, si eres el vendedor y la oferta está pendiente, un botón "Aceptar" (`PATCH /offers/:id`). El anuncio pasa a Reservado: ¿qué tags tiene que invalidar?
2. **Estadísticas.** Si hiciste `GET /api/listings/stats`: una página `/stats` con una tabla por categoría.
3. **Favoritos.** Un corazón en cada tarjeta que guarda los ids en `localStorage`, y un filtro "Solo favoritos".
4. **Confirmar antes de borrar** con `window.confirm`.
5. **Test.** Con Vitest: `StatusBadge` con `"SOLD"` enseña "Vendido".

---

## Documentación para consultar

- Context: <https://react.dev/learn/passing-data-deeply-with-context>
- `useSearchParams`: <https://reactrouter.com/api/hooks/useSearchParams>
- `URLSearchParams` (MDN): <https://developer.mozilla.org/es/docs/Web/API/URLSearchParams>
- RTK Query, mutations: <https://redux-toolkit.js.org/rtk-query/usage/mutations>
- json-server: <https://github.com/typicode/json-server>
- MongoDB Atlas: <https://www.mongodb.com/docs/atlas/getting-started/>
- Render, Node.js: <https://render.com/docs/deploy-node-express-app>
