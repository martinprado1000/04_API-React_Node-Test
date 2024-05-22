import { useForm } from "react-hook-form"; //IMPORTAMOS el hook del formulario
import { useNavigate } from "react-router-dom";
const URL_BACK = import.meta.env.VITE_URL_BACK 

//Bootstrap
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";

//Sweet Alert 2
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

function BodyRegister() {

  const navigate = useNavigate();

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

  const registerUser = async (data) => {
    try {
      let res = await fetch(`${URL_BACK}/api/register`, {
        method: "POST",
        credentials: 'include', // Permito que el backend cargue y elimine las cookie en el front
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
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
          title: responsBackend.data[0].msg ? responsBackend.data[0].msg : responsBackend.data,
          icon: "warning", // succes , warning , info , question, error
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: responsBackend.data[0].msg ? responsBackend.data[0].msg : responsBackend.data,
          icon: "success", // succes , warning , info , question, error
          timer: 2000,
          timerProgressBar: true,
        });
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (error) {
      //Cacheo el error que lo lanza el throw
      console.log("Error inesperado en el sistema");
    }
  };

  return (
      <Form onSubmit={handleSubmit(registerUser)} className="container mt-4">
        <Row className="mb-1">
          <Form.Group as={Col} md="4">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese su nombre"
              {...register("name", {
                required: {
                  value: true,
                  message: "La campo nombre es requerido",
                },
                pattern: {
                  value: /^[A-Za-zñÑ]+$/,
                  message: "El campo apellido solo puede contener letras sin espacios ni caracteres especiales",
                },
                minLength: {
                  value: 2,
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
              placeholder="Ingrese su apellido"
              {...register("lastname", {
                required: {
                  value: true,
                  message: "La campo apellido es requerido",
                },
                minLength: {
                  value: 2,
                  message: "El campo apellido debe tener mas de 2 caracteres",
                },
                maxLength: {
                  value: 20,
                  message:
                    "El campo apellido debe tener menos de 20 caracteres",
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
              placeholder="Ingrese su edad"
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
            {errors.age && <p className="text-danger mt-1">{errors.age.message}</p>}
          </Form.Group>
        </Row>

        <Row className="mt-3">
          <Form.Group as={Col} md="6">
            <Form.Label>Email</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text>@</InputGroup.Text>
              <Form.Control
                type="text" //Lo hago tipo text para no levante el error email de html
                placeholder="Ingrese su email"
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
              placeholder="Ingrese una contraseña"
              {...register("password", {
                required: {
                  value: true,
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
              placeholder="Repita la contraseña"
              {...register("passwordRepeat", {
                required: {
                  value: true,
                  message: "El campo repetir contraseña es requerido",
                },
                // validate: (value) => {  // Validate: Valida nuestra propia funcion, validate es una funcion.
                //   if(value == watch("password")){  // Watch("password"), obtenemos el valor actual de la variable password.
                //     return true
                //   } else {
                //     return "Las contraseñas no coinciden"
                //   }
                // }
                /////// Esto de a continuacion es lo mismo que lo anterios ////
                validate: (value) =>
                  value == watch("password") || "Las contraseñas no coinciden",
              })}
            />
            {errors.passwordRepeat && (
              <p className="text-danger mt-1">{errors.passwordRepeat.message}</p>
            )}
          </Form.Group>
        </Row>

        <Form.Group>
          <Form.Check className="mt-4"
            label="Aceptar términos y condiciones"
            {...register("acept", {
              required: {
                value: true,
                message: "Debe aceptar los terminos y condiciones",
              },
            })}
          />
          {errors.acept && (
            <p className="text-danger mt-1">{errors.acept.message}</p>
          )}
        </Form.Group>

        <Button type="submit" className="mt-4">
          Enviar
        </Button>
      </Form>
  );
}

export default BodyRegister;
