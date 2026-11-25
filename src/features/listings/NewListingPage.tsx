import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useCreateListingMutation } from "../../app/api";
import { getErrorMessage } from "../../app/apiError";
import { CATEGORY_LABELS } from "../../app/labels";
import { useCurrentUser } from "../users/CurrentUserContext";

const listingSchema = z.object({
  title: z.string().trim().min(1, "Escribe un título"),
  description: z.string().trim().min(1, "Escribe una descripción"),
  price: z.number({ error: "Introduce un precio" }).min(0, "El precio no puede ser negativo"),
  category: z.string().min(1, "Elige una categoría"),
  city: z.string().trim().min(1, "Escribe una ciudad"),
});

type ListingForm = z.infer<typeof listingSchema>;

export function NewListingPage() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [createListing] = useCreateListingMutation();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } =
    useForm<ListingForm>({ resolver: zodResolver(listingSchema) });

  async function publish(data: ListingForm) {
    try {
      const created = await createListing({ ...data, sellerId: user.id }).unwrap();
      navigate(`/listings/${encodeURIComponent(created.id)}`);
    } catch (error) {
      setError("root", { message: getErrorMessage(error) });
    }
  }

  return (
    <>
      <h1>Publicar un anuncio</h1>
      <form onSubmit={handleSubmit(publish)} noValidate>
        {errors.root && <p className="error" role="alert">{errors.root.message}</p>}

        <label htmlFor="title">Título</label>
        <input id="title" aria-invalid={!!errors.title} aria-describedby={errors.title && "title-error"} {...register("title")} />
        {errors.title && <p id="title-error" className="field-error">{errors.title.message}</p>}

        <label htmlFor="description">Descripción</label>
        <textarea id="description" rows={3} aria-invalid={!!errors.description} aria-describedby={errors.description && "description-error"} {...register("description")} />
        {errors.description && <p id="description-error" className="field-error">{errors.description.message}</p>}

        <label htmlFor="price">Precio (€)</label>
        <input id="price" type="number" min="0" step="any" aria-invalid={!!errors.price} aria-describedby={errors.price && "price-error"} {...register("price", { valueAsNumber: true })} />
        {errors.price && <p id="price-error" className="field-error">{errors.price.message}</p>}

        <label htmlFor="category">Categoría</label>
        <select id="category" aria-invalid={!!errors.category} aria-describedby={errors.category && "category-error"} {...register("category")}>
          <option value="">Elige una</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        {errors.category && <p id="category-error" className="field-error">{errors.category.message}</p>}

        <label htmlFor="city">Ciudad</label>
        <input id="city" aria-invalid={!!errors.city} aria-describedby={errors.city && "city-error"} {...register("city")} />
        {errors.city && <p id="city-error" className="field-error">{errors.city.message}</p>}

        <p>Se publicará a nombre de <strong>{user.name}</strong></p>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </>
  );
}
