# Respuestas

## 1. ¿Por qué copiar los parámetros de búsqueda?

`searchParams` representa la URL actual y es mutable. Si se cambia directamente, se modifica el objeto en memoria sin pedir al router que navegue. `changeFilter` crea una copia, cambia solo el filtro correspondiente y llama a `setSearchParams`. Así el router actualiza la URL y React vuelve a renderizar el listado con los nuevos filtros.

## 2. ¿Cómo se actualiza la lista después de hacer una oferta?

`OfferForm` usa la mutación `createOffer`, que invalida la etiqueta `Offer`. La consulta activa de `OfferList` declara esa etiqueta en `providesTags`. RTK Query vuelve a pedir las ofertas de ese anuncio y el componente muestra el resultado actualizado al recibir los datos.

## 3. ¿Qué ocurre al cambiar entre Luis y Ana en el Seat?

Luis es el vendedor y ve el panel para cambiar el precio o borrar. Ana puede ofertar porque el anuncio está disponible. Ambos ven la misma ficha y la lista de ofertas.

La ficha lee el usuario con `useCurrentUser()`. Al cambiar el valor del contexto, React vuelve a renderizar la ficha y elige el panel correspondiente. El ID del anuncio sigue siendo el mismo y la consulta sigue suscrita a la misma entrada de caché de RTK Query, por lo que cambiar el usuario por sí solo no vuelve a pedir el anuncio.

## 4. ¿Qué permite CORS en la API de Rastro?

`PATCH` permite guardar el nuevo precio y `DELETE` permite borrar un anuncio desde el navegador. Las peticiones con cuerpo JSON usan `Content-Type: application/json`, por ejemplo al publicar, ofertar o cambiar un precio. El navegador anuncia ese método o cabecera en la petición previa `OPTIONS` y comprueba la autorización del servidor antes de enviar la petición real.

## 5. ¿Por qué recargar puede incrementar las visitas?

Express incrementa las visitas en cada `GET /api/listings/:id`. Al volver desde el listado antes de que caduque la entrada de RTK Query, la ficha puede reutilizar la respuesta almacenada. Una recarga reinicia Redux en memoria, así que se hace una nueva petición y Express vuelve a contar la visita.

## Diario de integración

- El listado y las fichas de Express devuelven `_id`. La capa de datos lo convierte en `id` para los enlaces, las claves de React y la navegación tras publicar.
- Express filtra por `maxPrice` y ordena el listado por fecha en el servidor.
- Las ofertas se leen en `GET /api/listings/:id/offers`. La web toma el identificador de `listing.id` y ordena las ofertas por fecha.
- Al ofertar se envía `buyerId` y al publicar se envía `sellerId`. Express resuelve los usuarios y completa el estado y las fechas.
