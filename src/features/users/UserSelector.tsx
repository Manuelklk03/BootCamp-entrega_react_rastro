import { useCurrentUser } from "./CurrentUserContext";
import { USERS } from "./users";

export function UserSelector() {
  const { user, changeUser } = useCurrentUser();

  return (
    <>
      <label htmlFor="current-user">Soy</label>
      <select id="current-user" value={user.id} onChange={(event) => changeUser(event.target.value)}>
        {USERS.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
      </select>
    </>
  );
}
