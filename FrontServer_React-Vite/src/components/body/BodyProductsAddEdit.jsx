import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthUserContext";
const URL_BACK = import.meta.env.VITE_URL_BACK 

//Bootstrap
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";

//Sweet Alert 2
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function BodyProductsAddEdit() {
  const navigate = useNavigate();
  const params = useParams();
  const { isAuth, userAuth } = useAuthContext();
  const [canEdit, setCanEdit] = useState(false);
  const [submitProd, setSubmitProd] = useState("submitAddToCart");

  const id = params.id;

  const {
    register,
    formState: { errors }, // Son los valores del objeto error
    watch, // Guarda el valor actual de los inputps
    handleSubmit,
    reset, // resetea TODO el formulario cuando lo llamo
    resetField, // restea el input seleccionado, ej: setValue("password")
    setValue, // Le asigna el valor que le asignemos a un input, ej: setValue("email","")
  } = useForm({
    defaultValues: {
      // Con defaultValues le podemos asignar valores por defecto al campo que deseamos, si no queremos asignar ningun valor por defecto ejecuto el useForm sin ningun valor: useForm();
      //marca: marcaEdit
      //apellido: '',
    },
  });

  // Funcion para cargar datos en el formulario
  const getProductId = async (id) => {
    try {
      let res = await fetch(`${URL_BACK}/api/products/${id}`, {
        credentials: "include", // Permito que el backend cargue y elimine las cookie en el front
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw {
          error: true,
          status: res.status,
          statusText: !res.statusText
            ? "Ocurrio un error en el sistema"
            : res.statusText,
        };
      }

      let responsBackend = await res.json();
      console.log(responsBackend);

      if (responsBackend.status != 200) {
        Swal.fire({
          title: responsBackend.data[0].msg
            ? responsBackend.data[0].msg
            : responsBackend.data,
          icon: "warning",
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        const data = responsBackend.data;
        setValue("title", data.title);
        setValue("description", data.description);
        setValue("code", data.code);
        setValue("price", data.price);
        setValue("category", data.category);
        setValue("stock", data.stock);
      }
    } catch (error) {
      console.log(`Error inesperado en el sistema: ${error}`);
      navigate("/errorPage");
    }
  };

  // Cargo el producto y seteo el tipo de usuario.
  useEffect(() => {
    if (id) {
      // Si existe un id cargo los datos en el formulario para editar.
      getProductId(id);
    }
    if (userAuth.rol == "admin" || userAuth.rol == "superAdmin") {
      setCanEdit(true);
      setSubmitProd("submitProduct");
    }
  }, []);

  // Agrego o edito un producto
  const submitProduct = async (data) => {
    if (!id) {
      // Chequeo si hay id para sabes si hay que agregar producto o editar.

      // **** Create Product ****
      try {
        let res = await fetch(`${URL_BACK}/api/products`, {
          method: "POST",
          credentials: "include", // Permito que el backend cargue y elimine las cookie en el front
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }); 
        if (!res.ok) {
          throw {
            error: true,
            status: res.status,
            statusText: !res.statusText
              ? "Ocurrio un error en el sistema"
              : res.statusText,
          };
        }

        let responsBackend = await res.json(); //Transformo a JSON la respuesta
        console.log(responsBackend);

        if (responsBackend.status != 201) {
          console.log(responsBackend.data[0].msg);
          Swal.fire({
            title: responsBackend.data[0].msg
              ? responsBackend.data[0].msg
              : responsBackend.data,
            icon: "warning", // succes , warning , info , question, error
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          Swal.fire({
            title: responsBackend.data[0].msg
              ? responsBackend.data[0].msg
              : responsBackend.data,
            icon: "success", // succes , warning , info , question, error
            timer: 1000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            navigate("/products");
          }, 2000);
        }
      } catch (error) {
        console.log(`Error inesperado en el sistema: ${error}`);
        navigate("/errorPage");
      }
    } else {
      // **** Edit Product ****
      try {
        let res = await fetch(`${URL_BACK}/api/products/${id}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          throw {
            error: true,
            status: res.status,
            statusText: !res.statusText
              ? "Ocurrio un error en el sistema"
              : res.statusText,
          };
        }

        let responsBackend = await res.json();

        if (responsBackend.status != 201) {
          Swal.fire({
            title: responsBackend.data[0].msg
              ? responsBackend.data[0].msg
              : responsBackend.data,
            icon: "warning",
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          Swal.fire({
            title: responsBackend.data[0].msg
              ? responsBackend.data[0].msg
              : responsBackend.data,
            icon: "success",
            timer: 1000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            navigate("/products");
          }, 1000);
        }
      } catch (error) {
        console.log(`Error inesperado en el sistema: ${error}`);
        navigate("/errorPage");
      }
    }
  };

  // Agregar producto al carrito
  const submitAddToCart = async (data) => {
    if (!isAuth) {
      Swal.fire({
        title: "Debe iniciar sesión para agregar un producto al carrito",
        icon: "info", // succes , warning , info , question, error
        timer: 2000,
        timerProgressBar: true,
      });
      navigate("/login")
    } else {

   
    const product = { product: id, quantity: data.quantityAddCart };

    try {
      let res = await fetch(
        `${URL_BACK}/api/carts/${userAuth.cart}/product/${id}`,
        {
          method: "POST",
          credentials: "include", // Permito que el backend cargue y elimine las cookie en el front
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );
      if (!res.ok) {
        throw {
          error: true,
          status: res.status,
          statusText: !res.statusText
            ? "Ocurrio un error en el sistema"
            : res.statusText,
        };
      }

      let responsBackend = await res.json(); //Transformo a JSON la respuesta
      console.log(responsBackend);

      if (responsBackend.status != 201) {
        console.log(responsBackend.data[0].msg);
        Swal.fire({
          title: responsBackend.data[0].msg
            ? responsBackend.data[0].msg
            : responsBackend.data,
          icon: "warning", // succes , warning , info , question, error
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: responsBackend.data[0].msg
            ? responsBackend.data[0].msg
            : responsBackend.data,
          icon: "success", // succes , warning , info , question, error
          timer: 2000,
          timerProgressBar: true,
        });
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (error) {
      console.log(`Error inesperado en el sistema: ${error}`);
      navigate("/errorPage");
    }
  }
  };

  return (
    <Form
      onSubmit={handleSubmit(
        submitProd === "submitProduct" ? submitProduct : submitAddToCart
      )}
      className="container mt-4"
    >
      <Row className="mb-1">
        <Form.Group as={Col} md="4">
          <Form.Label>Título</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese un título"
            {...register("title", {
              required: {
                value: true,
                message: "La campo título es requerido",
              },
              pattern: {
                value: /^[A-Za-z0-9\s]+$/,
                message:
                  "El campo título solo puede contener letras, números y espacios",
              },
              minLength: {
                value: 2,
                message: "El campo título debe tener mas de 2 caracteres",
              },
              maxLength: {
                value: 20,
                message: "El campo título debe tener menos de 20 caracteres",
              },
            })}
            disabled={!canEdit} //Deshabilito el campo es usuario
          />
          {errors.title && (
            <p className="text-danger mt-1">{errors.title.message}</p>
          )}
        </Form.Group>

        <Form.Group as={Col} md="4">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese una descripción"
            {...register("description", {
              required: {
                value: true,
                message: "La campo descripción es requerido",
              },
              pattern: {
                value: /^[A-Za-z0-9\s]+$/,
                message:
                  "El campo descripción solo puede contener letras, números y espacios",
              },
              minLength: {
                value: 2,
                message: "El campo descripción debe tener mas de 2 caracteres",
              },
              maxLength: {
                value: 50,
                message:
                  "El campo descripción debe tener menos de 50 caracteres",
              },
            })}
            disabled={!canEdit} //Deshabilito el campo es usuario
          />
          {errors.description && (
            <p className="text-danger mt-1">{errors.description.message}</p>
          )}
        </Form.Group>

        <Form.Group as={Col} md="4">
          <Form.Label>Código</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese un código"
            {...register("code", {
              required: {
                value: true,
                message: "La campo código es requerido",
              },
              pattern: {
                value: /^[A-Za-z0-9\s]+$/,
                message:
                  "El campo código solo puede contener letras, números y espacios",
              },
              minLength: {
                value: 4,
                message: "El campo código debe tener mas de 4 caracteres",
              },
              maxLength: {
                value: 10,
                message: "El campo código debe tener menos de 10 caracteres",
              },
            })}
            disabled={!canEdit} //Deshabilito el campo es usuario
          />
          {errors.code && (
            <p className="text-danger mt-1">{errors.code.message}</p>
          )}
        </Form.Group>
      </Row>

      <Row className="mt-3">
        <Form.Group as={Col} md="3">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ingrese un precio"
            {...register("price", {
              required: {
                value: true,
                message: "La campo precio es requerido",
              },
              maxLength: {
                value: 1000,
                message: "El campo precio debe tener menos de 1000 caracteres",
              },
            })}
            disabled={!canEdit} //Deshabilito el campo es usuario
          />
          {errors.price && (
            <p className="text-danger mt-1">{errors.price.message}</p>
          )}
        </Form.Group>

        <Form.Group as={Col} md="3">
          <Form.Label>Stock</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ingrese el stock"
            {...register("stock", {
              required: {
                value: true,
                message: "La campo stock es requerido",
              },
              maxLength: {
                value: 1000,
                message: "El campo stock debe tener menos de 1000 caracteres",
              },
            })}
            disabled={!canEdit} //Deshabilito el campo es usuario
          />
          {errors.stock && (
            <p className="text-danger mt-1">{errors.stock.message}</p>
          )}
        </Form.Group>

        <Form.Group as={Col} md="3">
          <Form.Label>Seleccione una categoría</Form.Label>
          <Form.Select
            md="3"
            {...register("category", {
              required: {
                value: true,
                message: "La campo categoría es requerído",
              },
            })}
            defaultValue=""
            disabled={!canEdit} //Deshabilito el campo es usuario
          >
            <option value="" disabled hidden>
              Selecciona una categoría
            </option>
            <option value="PC">PC</option>
            <option value="Monitor">Monitor</option>
            <option value="Teclado">Teclado</option>
          </Form.Select>
          {errors.category && (
            <p className="text-danger mt-1">{errors.category.message}</p>
          )}
        </Form.Group>
      </Row>

      {canEdit ? (
        <Button type="submit" className="mt-4">
          Enviar
        </Button>
      ) : (
        <Row className="mt-3">
          <Form.Group as={Col} md="4">
            <Form.Label>Cantidad a agregar:</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="Cantidad"
                {...register("quantityAddCart", {
                  required: {
                    value: true,
                    message: "La campo cantidad es requerido",
                  },
                  maxLength: {
                    value: 1000,
                    message:
                      "El campo cantidad debe tener menos de 1000 caracteres",
                  },
                })}
              />
              <Button type="submit" className="btn-info">
                Agregar al carrito
              </Button>
            </InputGroup>
            {errors.quantityAddCart && (
              <p className="text-danger mt-1">
                {errors.quantityAddCart.message}
              </p>
            )}
          </Form.Group>
        </Row>
      )}
    </Form>
  );
}

export default BodyProductsAddEdit;
