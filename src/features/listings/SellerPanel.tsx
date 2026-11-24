import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { useDeleteListingMutation, useUpdatePriceMutation } from "../../app/api";
import { getErrorMessage } from "../../app/apiError";
import type { Listing } from "../../app/types";
import styles from "./ListingDetailPage.module.css";

export function SellerPanel({ listing }: { listing: Listing }) {
  const [draftPrice, setDraftPrice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updatePrice, { isLoading: saving }] = useUpdatePriceMutation();
  const [deleteListing, { isLoading: deleting }] = useDeleteListingMutation();
  const navigate = useNavigate();
  const price = draftPrice ?? String(listing.price);
  const busy = saving || deleting;

  async function savePrice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(price);
    if (!price.trim() || !Number.isFinite(amount) || amount < 0) {
      setError("Introduce un precio válido mayor o igual que cero.");
      return;
    }

    setError(null);
    try {
      const updated = await updatePrice({ id: listing.id, price: amount }).unwrap();
      setDraftPrice(String(updated.price));
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }

  async function remove() {
    if (!window.confirm("¿Quieres borrar este anuncio?")) return;

    setError(null);
    try {
      await deleteListing(listing.id).unwrap();
      navigate("/", { replace: true });
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }

  return (
    <form onSubmit={savePrice} noValidate>
      <h2>Tu anuncio</h2>
      {error && <p className="error" role="alert">{error}</p>}
      <label htmlFor="price">Nuevo precio (€)</label>
      <div className={styles.row}>
        <input
          id="price"
          type="number"
          min="0"
          step="any"
          value={price}
          disabled={busy}
          onChange={(event) => setDraftPrice(event.target.value)}
        />
        <button type="submit" disabled={busy}>{saving ? "Guardando..." : "Guardar"}</button>
      </div>
      <button type="button" className="danger" disabled={busy} onClick={remove}>
        {deleting ? "Borrando..." : "Borrar anuncio"}
      </button>
    </form>
  );
}
