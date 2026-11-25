import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Listing, ListingFilters, ListingSummary, NewListing, NewOffer, Offer } from "./types";

type ApiListing<T> = Omit<T, "id"> & { _id: string };
type ApiOffer = Omit<Offer, "id" | "listingId"> & { _id: string; listing: { id: string } };

function mapListing<T>({ _id, ...listing }: T & { _id: string }) {
  return { ...listing, id: _id };
}

function mapOffer({ _id, listing, ...offer }: ApiOffer): Offer {
  return { ...offer, id: _id, listingId: listing.id };
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ["Listing", "Offer"],
  endpoints: (builder) => ({
    getListing: builder.query<Listing, string>({
      query: (id) => `/listings/${encodeURIComponent(id)}`,
      transformResponse: mapListing<ApiListing<Listing>>,
      providesTags: ["Listing"],
    }),
    updatePrice: builder.mutation<Listing, { id: string; price: number }>({
      query: ({ id, price }) => ({
        url: `/listings/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: { price },
      }),
      transformResponse: mapListing<ApiListing<Listing>>,
      invalidatesTags: (_result, error) => error ? [] : ["Listing"],
    }),
    deleteListing: builder.mutation<void, string>({
      query: (id) => ({
        url: `/listings/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, error) => error ? [] : ["Listing"],
    }),
    createListing: builder.mutation<Listing, NewListing>({
      query: (body) => ({ url: "/listings", method: "POST", body }),
      transformResponse: mapListing<ApiListing<Listing>>,
      invalidatesTags: ["Listing"],
    }),
    createOffer: builder.mutation<Offer, NewOffer>({
      query: (body) => ({ url: "/offers", method: "POST", body }),
      transformResponse: mapOffer,
      invalidatesTags: ["Offer"],
    }),
    getOffers: builder.query<Offer[], string>({
      query: (listingId) => `/listings/${encodeURIComponent(listingId)}/offers`,
      transformResponse: (offers: ApiOffer[]) => offers
        .map(mapOffer)
        .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt)),
      providesTags: ["Offer"],
    }),
    getListings: builder.query<ListingSummary[], ListingFilters>({
      query: (params) => ({ url: "/listings", params }),
      transformResponse: (listings: ApiListing<ListingSummary>[]) => listings.map(mapListing<ApiListing<ListingSummary>>),
      providesTags: ["Listing"],
    }),
  }),
});

export const {
  useGetListingsQuery,
  useGetListingQuery,
  useGetOffersQuery,
  useCreateOfferMutation,
  useCreateListingMutation,
  useUpdatePriceMutation,
  useDeleteListingMutation,
} = api;
