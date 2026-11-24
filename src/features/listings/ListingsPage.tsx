import { useGetListingsQuery } from "../../app/api";
import { getErrorMessage } from "../../app/apiError";
import { Loading } from "../../components/ui/Loading";
import { ListingCard } from "./ListingCard";

export function ListingsPage() {
  const { data: listings, error, isLoading } = useGetListingsQuery({});

  return (
    <>
      <h1>Anuncios</h1>
      {isLoading && <Loading />}
      {error && <p className="error" role="alert">{getErrorMessage(error)}</p>}
      {listings && (
        <div className="grid">
          {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
        </div>
      )}
    </>
  );
}
