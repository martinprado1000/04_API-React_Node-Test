import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProductsContext } from "../../contexts/ProductsContext";
import { useAuthContext } from "../../contexts/AuthUserContext";
import { useCartsContext } from "../../contexts/CartsContext"
const URL_BACK = import.meta.env.VITE_URL_BACK;
// bootstrap
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
//Sweet Alert 2
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function BodyHome() {
  const navigate = useNavigate();

  const { getProducts, products, setProducts } = useProductsContext();
  const { userAuth } = useAuthContext();
  const { carts, setCarts } = useCartsContext();

  const [search, setSearch] = useState("");

  const handleAdd = () => {
    navigate("/productsAdd");
  };

  const handleEdit = (id) => {
    navigate(`/products/${id}`);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el producto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let res = await fetch(`${URL_BACK}/api/products/${id}`, {
            method: "DELETE",
            credentials: 'include', // Permito que el backend cargue y elimine las cookie en el front
            headers: {
              "Content-Type": "application/json",
            },
          });
          let responsBackend = await res.json();
          console.log(responsBackend);
          if (responsBackend.status != 204) { // Si no se pudo eliminar
            Swal.fire({
              title: responsBackend.data,
              icon: "warning",
              timer: 3000,
              timerProgressBar: true,
            });
            return;
          } else {
            setProducts(products.filter((prod) => prod.id !== id)); // Elimino del front el producto.
            return;
          }
        } catch (error) {
          console.log(`Error inesperado en el sistema: ${error}`);
          navigate("/errorPage");
          return;
        }
      }
    });
  };

  const handleView = (id) => {
    console.log(`Visualizar el producto ${id}`);
    navigate(`/home/${id}`)
  };

  const IsNotUserRol = ({ product }) => {
    return (
      <>
        <td className="col-1">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleEdit(product.id)}
          >
            Editar
          </button>
        </td>
        <td className="col-1">
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(product.id)}
          >
            Eliminar
          </button>
        </td>
      </>
    );
  };

  const IsUserRol = ({ product }) => {
    return (
      <td className="col-2">
        <button
          className="btn btn-info btn-sm d-block mx-auto"
          onClick={() => handleView(product.id)}
        >
          Ver producto
        </button>
      </td>
    );
  };

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  const filteredProducts = !search
    ? products
    : products.filter(
        (data) =>
          data.title.toLowerCase().includes(search.toLocaleLowerCase()) || // toLowerCase para que no discrimine entre mayuscula y minuscula en la busqueda
          data.description.toLowerCase().includes(search.toLocaleLowerCase()) ||
          data.code.toLowerCase().includes(search.toLocaleLowerCase()) ||
          data.category.toLowerCase().includes(search.toLocaleLowerCase())
      );

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="container mt-3">
      <Form>
        <Row className="mb-3">

          {userAuth.rol == "admin" || userAuth.rol == "superAdmin" ? (
            <Form.Group as={Col} className="col-4">
              <Button md="4" className="col-3 form-control" onClick={handleAdd}>
                Crear producto
              </Button>
            </Form.Group>
          ) : (
            <></>
          )}

          <Form.Group as={Col}>
            <input
              md="auto"
              value={search}
              onChange={searcher}
              type="text"
              placeholder="Buscar"
              className="col-5 form-control"
            />
          </Form.Group>

        </Row>
      </Form>

      {!products || products == "" ? (
        <p className="mx-3 mt-3 row text-center alert h4">
          No existen productos
        </p>
      ) : (
        <Table striped bordered hover variant="dark">
          <thead>
            <tr className="row">
              <th className="col-2">Titulo</th>
              <th className="col-4">Descripcion</th>
              <th className="col-1">Código</th>
              <th className="col-1">Precio</th>
              <th className="col-1">Stock</th>
              <th className="col-1">Categoria</th>
              {userAuth.rol == "admin" || userAuth.rol == "superAdmin" ? (
                <>
                  <th className="col-1"></th>
                  <th className="col-1"></th>
                </>
              ) : (
                <th className="col-2"></th>
              )}
            </tr>
          </thead>

          <tbody>
            {filteredProducts &&
              filteredProducts.map((product) => (
                <tr className="row" key={product.id}>
                  <td className="col-2">{product.title}</td>
                  <td className="col-4">{product.description}</td>
                  <td className="col-1">{product.code}</td>
                  <td className="col-1">{product.price}</td>
                  <td className="col-1">{product.stock}</td>
                  <td className="col-1">{product.category}</td>
                  {userAuth.rol == "admin" || userAuth.rol == "superAdmin" ? (
                    <IsNotUserRol product={product} />
                  ) : (
                    <IsUserRol product={product} />
                  )}
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default BodyHome;
