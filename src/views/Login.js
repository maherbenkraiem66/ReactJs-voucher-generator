import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Form,
  Fade,
  Button,
  FormInput,
  Alert,
} from "shards-react";


import axios from 'axios';
import  { Redirect } from 'react-router-dom'
class Login extends React.Component {
    envoiRequete()
    {
        console.log(this.state);
        axios({
            method: 'post',
            url: 'http://127.0.0.1/xyz/authentifier.php',
            headers: { 'content-type': 'application/json' },
            data: this.state
          })
            .then(result => {
              this.setState({
                resultat: result.data
              });
              console.log(result.data.message);
              if(result.data.message=='success')
                {
                  sessionStorage.setItem('type',result.data.type);
                  sessionStorage.setItem("nom",result.data.nom);
                  sessionStorage.setItem('tel',result.data.tel);
                  console.log(sessionStorage.getItem('type'));
                  window.location='http://localhost:3000/caisse';
                }
                else
                {
                  this.setState({loginMessage:'E-mail ou mot de passe incorrect'});
                }
            })
            .catch(error => this.setState({ error: error.message }));

    }
  constructor(props) {
    super(props);
    if (sessionStorage.getItem('type')!=null)
    {
      sessionStorage.removeItem('type');
      window.location.reload();
    }
    


    console.log('router '+this.routeParam);
    this.state = {
      loginMessage: "Connexion en cours .... ",
      formValid: false,
      loginState: false,
      fullName: null,
      email: null,
      password: null,
      errors: {
        email: "",
        password: "",
      },
    };
    // Cette liaison est nécéssaire afin de permettre
    // l'utilisation de `this` dans la fonction de rappel.
    this.handleLogin = this.handleLogin.bind(this);
    this.envoiRequete = this.envoiRequete.bind(this);
  }
  handleChange = (event) => {
    let validEmailRegex = RegExp(
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    );
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case "fullName":
        errors.fullName =
          value.length < 5 ? "Full Name must be 5 characters long!" : "";
        break;
      case "email":
        errors.email = validEmailRegex.test(value) ? "" : "Email is not valid!";
        break;
      case "password":
        errors.password =
          value.length < 5 ? "Password must be 5 characters long!" : "";
        break;
      default:
        break;
    }

    this.setState({ errors, [name]: value }, () => {
      console.log(errors);
    });
    this.state.formValid =
      errors.email == "" && errors.password == "" ? true : false;
  };
  handleLogin() {
    if (this.state.formValid) {
      this.setState({ loginState: true });
      this.envoiRequete();
    } else this.setState({ loginState: false });
  }
  render() {
    return (
      <div>
        <Row style={{ minHeight: "100px" }} />
        <Card small style={{ maxWidth: "450px", margin: "20px" }} id="card">
          {/* Files & Dropdowns */}
          <CardHeader className="border-bottom">
            <h6 className="m-0">Connexion</h6>
          </CardHeader>
          <ListGroup flush>
            <ListGroupItem className="px-3">
              <strong className="text-muted d-block mb-2">Votre E-mail</strong>
              <div className="form-group">
                <FormInput
                  placeholder="E-mail"
                  required
                  pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
                  onChange={this.handleChange}
                  name="email"
                  className={
                    this.state.errors.email != ""
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                />

                <div className="invalid-feedback">Entrer un email correte</div>
              </div>
              <strong className="text-muted d-block mb-2">
                Votre Mot de passe
              </strong>
              <FormInput
                type="password"
                placeholder="Mot de passe"
                onChange={this.handleChange}
                name="password"
                className={
                  this.state.errors.password != ""
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              <div className="invalid-feedback">
                Mot de passe doit contenir au moin 5 charactères
              </div>
            </ListGroupItem>
          </ListGroup>
          <Col-1>
            <Button
              theme="dark"
              style={{ margin: "20px" }}
              onClick={this.handleLogin}
              type="submit"
            >
              Connecter
            </Button>
          </Col-1>
        </Card>

        <Fade
          className="primary"
          in={this.state.loginState}
          style={{ marginLeft: "20px",color:'red' }}
        >
          {this.state.loginMessage} {this.state.errors.email}
        </Fade>
      </div>
    );
  }
}
export default Login;
