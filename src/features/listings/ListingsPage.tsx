import { useSearchParams } from "react-router";
import type { ListingFilters as Filters } from "../../app/types";
import { useGetListingsQuery } from "../../app/api";
import { getErrorMessage } from "../../app/apiError";
import { Loading } from "../../components/ui/Loading";
import { ListingCard } from "./ListingCard";

import { ListingFilters } from "./ListingFilters";

export function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters: Filters = Object.fromEntries(searchParams);
  const { currentData: listings, error, isFetching } = useGetListingsQuery(filters);

  function changeFilter(name: keyof Filters, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(name, value);
    } else {
      next.delete(name);
    }
    setSearchParams(next);
  }

  return (
    <>
      <h1>Anuncios</h1>
      <ListingFilters filters={filters} onChange={changeFilter} />
      {isFetching && !listings && <Loading />}
      {listings?.length === 0 && <p>No hay anuncios con esos filtros.</p>}
      {error && <p className="error" role="alert">{getErrorMessage(error)}</p>}
      {listings && listings.length > 0 && (
        <div className="grid">
          {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
        </div>
      )}
    </>
  );
}
