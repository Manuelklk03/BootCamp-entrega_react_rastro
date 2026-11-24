import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Listing, ListingFilters, ListingSummary, Offer } from "./types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ["Listing", "Offer"],
  endpoints: (builder) => ({
    getListing: builder.query<Listing, string>({
      query: (id) => `/listings/${encodeURIComponent(id)}`,
      providesTags: ["Listing"],
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

export const { useGetListingsQuery, useGetListingQuery, useGetOffersQuery } = api;
