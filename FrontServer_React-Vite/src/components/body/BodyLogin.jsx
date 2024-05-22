import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthUserContext";
const URL_BACK = import.meta.env.VITE_URL_BACK  

//Sweet Alert 2
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

//Bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function BodyLogin() {

  const navigate = useNavigate();
  
  // Validate useForm
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

  const { userAuth, setUserAuth, setIsAuth } = useAuthContext();

  const loginUser = async (data) => {
    try {
      let res = await fetch(`${URL_BACK}/api/login`, {  // El backend setea las cookier en el front
        method: "POST",
        credentials: 'include', // Permito que el backend cargue y elimine las cookie en el front
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      
      let responsBackend = await res.json(); //Transformo a JSON la respuesta
      if (responsBackend.status != 201) {
        Swal.fire({
          title: responsBackend.data[0].msg ? responsBackend.data[0].msg : responsBackend.data,
          icon: "warning", // succes , warning , info , question, error
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        setUserAuth({rol:responsBackend.rol}) // Cargo el valor del rol para poder direccionar a la ruta indicada
        responsBackend.rol == "user" ? navigate("/home") : navigate("/products");
      }
    } catch (error) {
      console.log({Error:"Error inesperado en el sistema", ErrorDetail:error});
    }
  };

  return (
    <Form className="container mt-4" onSubmit={handleSubmit(loginUser)}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
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
        {errors.email && (
          <p className="text-danger mt-1">{errors.email.message}</p>
        )}
        <Form.Text className="text-muted">
          Nunca compartiremos su correo electrónico
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
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
              message: "El campo contraseña debe tener menos de 20 caracteres",
            },
          })}
        />
        {errors.password && (
          <p className="text-danger mt-1">{errors.password.message}</p>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Button variant="primary" type="submit" className="mt-3">
          Enviar
        </Button>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <NavLink to="/recoveryPassword" activeclassname="active">
          ¿Olvidaste tu contraseña?
        </NavLink>
      </Form.Group>
    </Form>
  );
}

export default BodyLogin;
