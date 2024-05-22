import React from "react";
import NavBarLoggedIn from "../components/navbar/NavBarLoggedIn";
import BodyProductsAddEdit from "../components/body/BodyProductsAddEdit";

export function ProductsAddEditPage() {
  return (
    <>
      <NavBarLoggedIn />
      <BodyProductsAddEdit />
    </>
  );
}