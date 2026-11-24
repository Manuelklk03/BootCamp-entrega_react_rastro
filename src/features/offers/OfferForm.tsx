import { useState } from "react";
import type { FormEvent } from "react";
import { useCreateOfferMutation } from "../../app/api";
import { getErrorMessage } from "../../app/apiError";
import { useCurrentUser } from "../users/CurrentUserContext";

export function OfferForm({ listingId }: { listingId: string }) {
  const { user } = useCurrentUser();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [createOffer, { isLoading }] = useCreateOfferMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const price = Number(amount);
    if (!Number.isFinite(price) || price <= 0) {
      setError("La oferta tiene que ser mayor que cero.");
      return;
    }

    setError(null);
    try {
      await createOffer({
        listingId,
        amount: price,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        buyer: user,
      }).unwrap();
      setAmount("");
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Hacer una oferta</h2>
      {error && <p className="error" role="alert">{error}</p>}
      <label htmlFor="amount">Tu oferta (€)</label>
      <input
        id="amount"
        type="number"
        step="any"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Enviando..." : "Ofertar"}
      </button>
    </form>
  );
}
