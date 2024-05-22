import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthUserContext";
import {
  Link,
  NavLink,
} from "react-router-dom";
const URL_BACK = import.meta.env.VITE_URL_BACK 

function NavBarLoggedIn() {
  const navigate = useNavigate();

  const { getUserAuth, userAuth } = useAuthContext();

  useEffect(() => {
      getUserAuth();
  }, []);

  const handleLogOut = async () => {
    try {
      let res = await fetch(`${URL_BACK}/api/logOut`, {
        credentials: "include", // Permito que el backend cargue y elimine las cookie en el front
      });
      console.log(res);
      if (!res.ok) {
        throw {
          error: true,
          statusText: !res.statusText ? "Ocurrio un error" : res.statusText, // statusText es una propiedad de la respuesta q a veces no vienen en la respuesta por eso la agrego si no existe.
        };
      }
      let responsBackend = await res.json(); //Transformo a JSON la respuesta
      console.log(responsBackend);
      navigate("/login");
      // console.log(res)
    } catch (error) {
      console.log("No se pudo cerrar sesión");
    }
  };

  function LoggedIn() {
    return (
    <NavDropdown title={userAuth.name} id="collapsible-nav-dropdown">
      {userAuth.rol == "admin" || userAuth.rol == "superAdmin" ? (
      <NavDropdown.Item disabled className="text-primary">{`Usuario: ${userAuth.rol}`}</NavDropdown.Item> 
      ) : (
        <NavDropdown.Item as={Link} to={`/cart/${userAuth.cart}`}>Mi carrito</NavDropdown.Item>
      )}
      <NavDropdown.Item as={Link} to="/profile">Perfil</NavDropdown.Item> {/* as={Link} = Le indica a la etiqueta NavDropdown.Item  que se comporte como un Link, esto tambien sirve para NavLink */}
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={handleLogOut}>Cerrar sesión</NavDropdown.Item>
    
    </NavDropdown>
    )
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        {/* <Navbar.Brand href="#home">MP</Navbar.Brand> */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavLink to={ userAuth.rol == "user" ? "/home" : "/products"} className="nav-link" activeclassname="active">Productos</NavLink>
            {userAuth.rol === "superAdmin" && (
              <NavLink to="/users" className="nav-link" activeclassname="active">Usuarios</NavLink> )
            }
          </Nav>
          <Nav>{ userAuth ? <LoggedIn/> : <NavLink to="/login">Iniciar sesión</NavLink> }</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBarLoggedIn;
