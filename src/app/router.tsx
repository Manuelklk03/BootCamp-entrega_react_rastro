import { createBrowserRouter } from "react-router";
import { Layout } from "../components/layout/Layout";
import { NotFoundPage } from "../components/ui/NotFoundPage";
import { ListingsPage } from "../features/listings/ListingsPage";

import { NewListingPage } from "../features/listings/NewListingPage";
import { ListingDetailPage } from "../features/listings/ListingDetailPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <ListingsPage /> },
      { path: "listings/new", element: <NewListingPage /> },
      { path: "listings/:id", element: <ListingDetailPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
