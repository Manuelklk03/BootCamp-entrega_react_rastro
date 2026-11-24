import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { CurrentUserContext } from "./CurrentUserContext";
import { USERS } from "./users";

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") ?? USERS[0].id);
  const user = USERS.find((candidate) => candidate.id === userId) ?? USERS[0];

  useEffect(() => {
    localStorage.setItem("userId", user.id);
  }, [user.id]);

  return (
    <CurrentUserContext.Provider value={{ user, changeUser: setUserId }}>
      {children}
    </CurrentUserContext.Provider>
  );
}
