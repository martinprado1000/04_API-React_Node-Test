import { useEffect } from "react";
import { useForm } from "react-hook-form"; //IMPORTAMOS el hook del formulario
import { useNavigate, useParams } from "react-router-dom";
const URL_BACK = import.meta.env.VITE_URL_BACK 

//Bootstrap
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";

//Sweet Alert 2
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function BodyUsersAddEdit() {
  const navigate = useNavigate();

  // Register useForm
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
      // name: "juan"
    },
  });

  const params = useParams();
  const id = params.id;

  // Funcion para cargar datos en el formulario
  const getUserId = async (id) => {
    console.log(`Editar usuario con id: ${id}`);
    try {
      let res = await fetch(`${URL_BACK}/api/users/${id}`, {
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
        setValue("name", data.name);
        setValue("lastname", data.lastname);
        setValue("email", data.email);
        setValue("age", data.age);
        setValue("rol", data.rol);
      }
    } catch (error) {
      console.log(`Error inesperado en el sistema: ${error}`);
      navigate("/errorPage");
    }
  };

  // Cargo el usuario
  useEffect(() => {
    if (id) { // Si existe un id cargo los datos en el formulario para editar.
      getUserId(id);
    }
  }, []);

  const submitUser = async (data) => {
    if (!id) { // Chequeo si hay id para sabes si hay q agregar usuario o editar.

      // **** Create User ****
      try {
        let res = await fetch(`${URL_BACK}/api/users`, { 
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

        let responsBackend = await res.json();
        console.log(responsBackend);

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
            icon: "success", // succes , warning , info , question, error
            timer: 1000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            navigate("/users");
          }, 1000);
        }
      } catch (error) {
        console.log(`Error inesperado en el sistema: ${error}`);
        navigate("/errorPage");
      }
    } else {
      // ***** Edit user ****
      if (data.password == "") {
        // Si no envian ningun password elimino las propiedades password y password repeat para que no las envia al backen como un string vacio.
        delete data.password;
        delete data.passwordRepeat;
      }
      try {
        let res = await fetch(`${URL_BACK}/api/users/${id}`, {
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
            timer: 2000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            navigate("/users");
          }, 2000);
        }
      } catch (error) {
        console.log(`Error inesperado en el sistema: ${error}`);
        navigate("/errorPage");
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(submitUser)} className="container mt-4">
      <Row className="mb-1">
        <Form.Group as={Col} md="4">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el nombre"
            {...register("name", {
              required: {
                value: true,
                message: "La campo nombre es requerido",
              },
              pattern: {
                value: /^[A-Za-zñÑ]+$/,
                message:
                  "El campo nombre solo puede contener letras sin espacios ni caracteres especiales",
              },
              minLength: {
                value: id ? 0 : 2,
                message: "El campo nombre debe tener mas de 2 caracteres",
              },
              maxLength: {
                value: 20,
                message: "El campo nombre debe tener menos de 20 caracteres",
              },
            })}
          />
          {errors.name && (
            <p className="text-danger mt-1">{errors.name.message}</p>
          )}
        </Form.Group>

        <Form.Group as={Col} md="4">
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el apellido"
            {...register("lastname", {
              required: {
                value: true,
                message: "La campo apellido es requerido",
              },
              pattern: {
                value: /^[A-Za-zñÑ]+$/,
                message:
                  "El campo apellido solo puede contener letras sin espacios ni caracteres especiales",
              },
              minLength: {
                value: 2,
                message: "El campo apellido debe tener mas de 2 caracteres",
              },
              maxLength: {
                value: 20,
                message: "El campo apellido debe tener menos de 20 caracteres",
              },
            })}
          />
          {errors.lastname && (
            <p className="text-danger mt-1">{errors.lastname.message}</p>
          )}
        </Form.Group>

        <Form.Group as={Col} md="4">
          <Form.Label>Edad</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ingrese la edad"
            {...register("age", {
              required: {
                value: true,
                message: "La campo edad es requerido",
              },
              maxLength: {
                value: 3,
                message: "El campo edad debe tener menos de 3 caracteres",
              },
            })}
          />
          {errors.age && (
            <p className="text-danger mt-1">{errors.age.message}</p>
          )}
        </Form.Group>
      </Row>

      <Row className="mt-3">
        <Form.Group as={Col} md="6">
          <Form.Label>Email</Form.Label>
          <InputGroup hasValidation>
            <InputGroup.Text>@</InputGroup.Text>
            <Form.Control
              type="text" //Lo hago tipo text para no levante el error email de html
              placeholder="Ingrese el email"
              aria-describedby="inputGroupPrepend"
              {...register("email", {
                required: {
                  value: true,
                  message: "La campo email es requerido",
                },
                pattern: {
                  // pattern es para validar expresiones regulares
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Email inválido",
                },
              })}
              disabled={id} //Deshabilito el campo email si existe un id
            />
          </InputGroup>
          {errors.email && (
            <p className="text-danger mt-1">{errors.email.message}</p>
          )}
        </Form.Group>

        <Form.Group as={Col} md="3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder={id ? "******" : "Ingrese una contraseña"}
            {...register("password", {
              required: {
                value: id ? false : true,
                message: "La campo contraseña es requerido",
              },
              minLength: {
                value: 6,
                message: "El campo contraseña debe tener mas de 6 caracteres",
              },
              maxLength: {
                value: 20,
                message:
                  "El campo contraseña debe tener menos de 20 caracteres",
              },
            })}
          />
          {errors.password && (
            <p className="text-danger mt-1">{errors.password.message}</p>
          )}
        </Form.Group>

        <Form.Group as={Col} md="3">
          <Form.Label>Repetir Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder={id ? "******" : "Repita la contraseña"}
            {...register("passwordRepeat", {
              required: {
                value: id ? false : true,
                message: "El campo repetir contraseña es requerido",
              },
              validate: (value) =>
                value == watch("password") || "Las contraseñas no coinciden",
            })}
          />
          {errors.passwordRepeat && (
            <p className="text-danger mt-1">{errors.passwordRepeat.message}</p>
          )}
        </Form.Group>
      </Row>

      <Row className="mt-3">
        <Form.Group as={Col} md="3">
          <Form.Label>Rol de usuario</Form.Label>
          <Form.Select
            md="3"
            {...register("rol", {
              required: {
                value: true,
                message: "La campo rol es requerido",
              },
            })}
            defaultValue=""
          >
            <option value="" disabled hidden>
              Selecciona un rol
            </option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superAdmin">Super Admin</option>
          </Form.Select>
          {errors.rol && (
            <p className="text-danger mt-1">{errors.rol.message}</p>
          )}
        </Form.Group>
      </Row>
      <Button type="submit" className="mt-4">
        Enviar
      </Button>
    </Form>
  );
}

export default BodyUsersAddEdit;
