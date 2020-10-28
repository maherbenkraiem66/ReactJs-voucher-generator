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

import PageTitle from "../components/common/PageTitle";
import Colors from "../components/components-overview/Colors";
import Checkboxes from "../components/components-overview/Checkboxes";
import RadioButtons from "../components/components-overview/RadioButtons";
import ToggleButtons from "../components/components-overview/ToggleButtons";
import SmallButtons from "../components/components-overview/SmallButtons";
import SmallOutlineButtons from "../components/components-overview/SmallOutlineButtons";
import NormalButtons from "../components/components-overview/NormalButtons";
import NormalOutlineButtons from "../components/components-overview/NormalOutlineButtons";
import Forms from "../components/components-overview/Forms";
import FormValidation from "../components/components-overview/FormValidation";
import CompleteFormExample from "../components/components-overview/CompleteFormExample";
import Sliders from "../components/components-overview/Sliders";
import ProgressBars from "../components/components-overview/ProgressBars";
import ButtonGroups from "../components/components-overview/ButtonGroups";
import InputGroups from "../components/components-overview/InputGroups";
import SeamlessInputGroups from "../components/components-overview/SeamlessInputGroups";
import CustomFileUpload from "../components/components-overview/CustomFileUpload";
import DropdownInputGroups from "../components/components-overview/DropdownInputGroups";
import CustomSelect from "../components/components-overview/CustomSelect";
import axios from "axios";
class Inscri extends React.Component {
  envoiRequete() {
    console.log(this.state);
    axios({
      method: "post",
      url: "http://127.0.0.1/xyz/subscribe.php",
      headers: { "content-type": "application/json" },
      data: this.state,
    })
      .then((result) => {
        this.setState({
          resultat: result.data.sent,
        });
        console.log(result);
      })
      .catch((error) => this.setState({ error: error.message }));
  }
  constructor() {
    super();
    this.state = {
      loginMessage: "Connexion en cours .... ",
      formValid: false,
      loginState: false,
      fullName: null,
      resultat: "",
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
            <h6 className="m-0">Inscription</h6>
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
              <div className="form-group">
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
          style={{ marginLeft: "20px" }}
        >
          {this.state.loginMessage} {this.state.errors.email}
        </Fade>
      </div>
    );
  }
}
export default Inscri;
