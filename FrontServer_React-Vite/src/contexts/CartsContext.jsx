import { createContext, useContext, useState } from "react";
const URL_BACK = import.meta.env.VITE_URL_BACK

const CartsContext = createContext();

// Este es nuestro hook que exporta el contexto
export function useCartsContext() {
  return useContext(CartsContext);
}

// Provider
export function CartsProvider({ children }) {

const [carts, setCarts] = useState(false)

  const getCarts = async () => {
    try {
      let res = await fetch(`${URL_BACK}/api/carts`);
      let responsBackend = await res.json();
      if (responsBackend.status !== 200) {
        throw error({"error":responsBackend})
      }
      
      setCarts(responsBackend.data) 
      return;

    } catch (error) {
      console.log(`Error inesperado en el sistema: ${error}`);
      window.location.href = "/fatalErrorPage";
      return;
    }
  };

  return (
    <CartsContext.Provider value={{ getCarts, carts, setCarts }}>
      {children}
    </CartsContext.Provider>
  );
}
