import { createContext, useContext, useState } from "react";
const URL_BACK = import.meta.env.VITE_URL_BACK
console.log(URL_BACK)

const ProductsContext = createContext();

// Este es nuestro hook que exporta el contexto
export function useProductsContext() {
  return useContext(ProductsContext);
}

// Provider
export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(false);

  const getProducts = async () => {
    try {
      let res = await fetch(`${URL_BACK}/api/products`);
      console.log(res)
      let responsBackend = await res.json();
      console.log(responsBackend)
      if (responsBackend.status == 200) {
        setProducts(responsBackend.data);
        return;
      }
      if (responsBackend.status == 404) {
        setProducts(false);
        return;
      }
      throw error({"error":responsBackend})
    } catch (error) {
      console.log(`Error inesperado en el sistema: ${error}`);
      window.location.href = "/fatalErrorPage";
      return;
    }
  };

  return (
    <ProductsContext.Provider value={{ getProducts, products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}
