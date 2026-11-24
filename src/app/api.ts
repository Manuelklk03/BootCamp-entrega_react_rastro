import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Listing, ListingFilters, ListingSummary, NewListing, NewOffer, Offer } from "./types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ["Listing", "Offer"],
  endpoints: (builder) => ({
    getListing: builder.query<Listing, string>({
      query: (id) => `/listings/${encodeURIComponent(id)}`,
      providesTags: ["Listing"],
    }),
    updatePrice: builder.mutation<Listing, { id: string; price: number }>({
      query: ({ id, price }) => ({
        url: `/listings/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: { price },
      }),
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
      invalidatesTags: ["Listing"],
    }),
    createOffer: builder.mutation<Offer, NewOffer>({
      query: (body) => ({ url: "/offers", method: "POST", body }),
      invalidatesTags: ["Offer"],
    }),
    getOffers: builder.query<Offer[], string>({
      query: (listingId) => ({
        url: "/offers",
        params: { listingId, _sort: "-createdAt" },
      }),
      providesTags: ["Offer"],
    }),
    // GET /listings?category=Cars&city=Valencia&price:lte=500&_sort=-publishedAt
    getListings: builder.query<ListingSummary[], ListingFilters>({
      query: ({ category, city, maxPrice }) => ({
        url: "/listings",
        // params: RTK Query monta el ?category=...&city=... (y se salta los que son undefined)
        // price:lte = precio menor o igual. _sort=-publishedAt = del más nuevo al más viejo
        params: { category, city, "price:lte": maxPrice, _sort: "-publishedAt" },
      }),
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
