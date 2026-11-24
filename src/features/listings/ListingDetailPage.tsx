import { skipToken } from "@reduxjs/toolkit/query";
import { Link, useParams } from "react-router";
import { useGetListingQuery } from "../../app/api";
import { getErrorMessage } from "../../app/apiError";
import { CATEGORY_LABELS, formatPrice } from "../../app/labels";
import { Loading } from "../../components/ui/Loading";
import { OfferForm } from "../offers/OfferForm";
import { useCurrentUser } from "../users/CurrentUserContext";
import { OfferList } from "../offers/OfferList";
import { SellerPanel } from "./SellerPanel";
import { StatusBadge } from "./StatusBadge";
import styles from "./ListingDetailPage.module.css";

export function ListingDetailPage() {
  const { id } = useParams();
  const { user } = useCurrentUser();
  const { currentData: listing, error, isFetching } = useGetListingQuery(id ?? skipToken);

  if (isFetching && !listing) return <Loading />;

  if (!listing) {
    const notFound = !id || (error && "status" in error && error.status === 404);
    return (
      <>
        <p className="error" role="alert">
          {notFound ? "Ese anuncio no existe." : getErrorMessage(error)}
        </p>
        <Link to="/">← Volver a los anuncios</Link>
      </>
    );
  }

  return (
    <>
      <p><Link to="/">← Volver a los anuncios</Link></p>
      <div className={styles.layout}>
        <article className={styles.main}>
          <h1>{listing.title}</h1>
          <StatusBadge status={listing.status} />
          <strong className={styles.price}>{formatPrice(listing.price)}</strong>
          <p>{listing.description}</p>
          <dl className={styles.facts}>
            <div><dt>Categoría</dt><dd>{CATEGORY_LABELS[listing.category]}</dd></div>
            <div><dt>Ciudad</dt><dd>{listing.city}</dd></div>
            <div><dt>Vendedor</dt><dd>{listing.seller.name}</dd></div>
            <div><dt>Visitas</dt><dd>{listing.views}</dd></div>
          </dl>
        </article>
        <aside className={styles.side}>
          {listing.seller.id === user.id ? (
            <SellerPanel key={listing.id} listing={listing} />
          ) : listing.status === "AVAILABLE" ? (
            <OfferForm key={listing.id} listingId={listing.id} />
          ) : (
            <p className="loading">Este anuncio ya no admite ofertas.</p>
          )}
          <OfferList listingId={listing.id} />
        </aside>
      </div>
    </>
  );
}
