import { createContext, useContext, useState } from "react";
const URL_BACK = import.meta.env.VITE_URL_BACK

const AuthUserContext = createContext();

// Este es nuestro hook que exporta el contexto
export function useAuthContext() {
  return useContext(AuthUserContext);
}

// Provider
export function AuthUserProvider({ children }) {

  const [isAuth, setIsAuth] = useState(false);
  const [userAuth, setUserAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const getUserAuth = async () => {
    try {
      let res = await fetch(`${URL_BACK}/api/profile`, {
        credentials: "include", // Permito que el backend cargue la cookie en el front
      });
      let responsBackend = await res.json();
      if (responsBackend.error) {
        setIsAuth(false);
        setUserAuth(false);
        setLoading(false);
        return;
      }

      setLoading(false);
      setIsAuth(true);
      setUserAuth(responsBackend.data);
      return;

    } catch (error) {
      setIsAuth(false);
      setUserAuth(false);
      setLoading(false);
      console.log(`Error inesperado en el sistema: ${error}`);
      window.location.href = "/fatalErrorPage";
      return;
    }
  };

  return (
    <AuthUserContext.Provider value={{ getUserAuth, isAuth, setIsAuth, userAuth, setUserAuth, loading }}>
      {children}
    </AuthUserContext.Provider>
  );
}
