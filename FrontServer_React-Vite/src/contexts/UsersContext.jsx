import { createContext, useContext, useState } from "react";
const URL_BACK = import.meta.env.VITE_URL_BACK

const UsersContext = createContext();

// Este es nuestro hook que exporta el contexto
export function useUsersContext() {
  return useContext(UsersContext);
}

// Provider
export function UsersProvider({ children }) {

const [users, setUsers] = useState(false)

  const getUsers = async () => {
    try {
      let res = await fetch(`${URL_BACK}/api/users`);
      let responsBackend = await res.json();
      if (responsBackend.status !== 200) {
        throw error({"error":responsBackend})
      }
      setUsers(responsBackend.data) 
      return;

    } catch (error) {
      console.log(`Error inesperado en el sistema: ${error}`);
      window.location.href = "/fatalErrorPage";
      return;
    }
  };

  return (
    <UsersContext.Provider value={{ getUsers, users, setUsers }}>
      {children}
    </UsersContext.Provider>
  );
}
