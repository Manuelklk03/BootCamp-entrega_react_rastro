import { useGetOffersQuery } from "../../app/api";
import { getErrorMessage } from "../../app/apiError";
import { formatPrice } from "../../app/labels";
import { Loading } from "../../components/ui/Loading";
import { StatusBadge } from "../listings/StatusBadge";
import styles from "./OfferList.module.css";

export function OfferList({ listingId }: { listingId: string }) {
  const { currentData: offers, isFetching, error } = useGetOffersQuery(listingId);

  return (
    <div className={styles.box}>
      <h2>{offers ? `Ofertas (${offers.length})` : "Ofertas"}</h2>
      {isFetching && !offers && <Loading />}
      {error && <p className="error" role="alert">{getErrorMessage(error)}</p>}
      {offers?.length === 0 && <p>Todavía no hay ofertas.</p>}
      {offers?.map((offer) => (
        <div key={offer.id} className={styles.offer}>
          <span>{offer.buyer.name}</span>
          <strong>{formatPrice(offer.amount)}</strong>
          <StatusBadge status={offer.status} />
        </div>
      ))}
    </div>
  );
}
