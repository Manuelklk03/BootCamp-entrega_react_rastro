// Modelos que consume la interfaz de Rastro.

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

// Datos que envía el formulario. Express completa los campos del anuncio.
export type NewListing = Pick<Listing, "title" | "description" | "price" | "category" | "city"> & { sellerId: string };

export type Offer = {
  id: string;
  listingId: string;
  amount: number;
  status: OfferStatus;
  createdAt: string;
  buyer: { id: string; name: string };
};

// Express resuelve el comprador y asigna la fecha y el estado.
export type NewOffer = Pick<Offer, "listingId" | "amount"> & { buyerId: string };

// Los filtros del listado. Todos opcionales
export type ListingFilters = {
  category?: string;
  city?: string;
  maxPrice?: string;
};
