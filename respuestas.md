# Respuestas

## 1. ¿Por qué copiar los parámetros de búsqueda?

`searchParams` representa la URL actual y es mutable. Si se cambia directamente, se modifica el objeto en memoria sin pedir al router que navegue. `changeFilter` crea una copia, cambia solo el filtro correspondiente y llama a `setSearchParams`. Así el router actualiza la URL y React vuelve a renderizar el listado con los nuevos filtros.

## 2. ¿Cómo se actualiza la lista después de hacer una oferta?

`OfferForm` usa la mutación `createOffer`, que invalida la etiqueta `Offer`. La consulta activa de `OfferList` declara esa etiqueta en `providesTags`. RTK Query vuelve a pedir las ofertas de ese anuncio y el componente muestra el resultado actualizado al recibir los datos.

## 3. ¿Qué ocurre al cambiar entre Luis y Ana en el Seat?

Luis es el vendedor y ve el panel para cambiar el precio o borrar. Ana puede ofertar porque el anuncio está disponible. Ambos ven la misma ficha y la lista de ofertas.

La ficha lee el usuario con `useCurrentUser()`. Al cambiar el valor del contexto, React vuelve a renderizar la ficha y elige el panel correspondiente. El ID del anuncio sigue siendo el mismo y la consulta sigue suscrita a la misma entrada de caché de RTK Query, por lo que cambiar el usuario por sí solo no vuelve a pedir el anuncio.
