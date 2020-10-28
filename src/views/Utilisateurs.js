import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  FormInput,
  FormRadio,
  FormSelect,
} from "shards-react";
import PageTitle from "../components/common/PageTitle";
import Modal from "react-awesome-modal";

import axios from "axios";
class Utilisateurs extends React.Component {
  constructor() {
    super();
    this.state = {
      clients: [],
      visible: false,
      visibleDelete: false,
      nom: "",
      email: "",
      tel: "",
      opt: "",
      recherche: "",
      errors: {},
      id_utilisateur: null,
      id_fournisseur:null,
      type: "",
      mdp: "",
      fournisseurs: [],
    };
    // Cette liaison est nécéssaire afin de permettre
    // l'utilisation de `this` dans la fonction de rappel.
    this.getData();
    this.creerClient = this.creerClient.bind(this);
    this.openModalDelete = this.openModalDelete.bind(this);
    this.changerType = this.changerType.bind(this);
    this.change=this.change.bind(this);
  }
  changerType(type) {
    this.setState({
      type: type,
    });
  }

  handleChange = (event) => {
    let validEmailRegex = RegExp(
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    );
    event.preventDefault();
    const { name, value } = event.target;
    console.log(name+' '+value);
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
    this.state.id_fournisseur=
    this.state.formValid =
      errors.email == "" && errors.password == "" ? true : false;
  };
  creerClient() {
    let user = {
      nom: this.state.nom,
      email: this.state.email,
      tel: this.state.tel,

    };
    this.state.opt = "add";
    console.log(this.state);
    // console.log("state to be sent : " + JSON.stringify(user));
    axios({
      method: "post",
      url: "http://127.0.0.1/xyz/get_clients.php?",
      headers: { "content-type": "application/json" },
      data: this.state,
    })
      .then((result) => {
        this.setState({
          resultat: result.data
        });
        this.getData();
        this.closeModal();
        console.log(JSON.stringify(result));
      })
      .catch((error) => this.setState({ error: error.message }));
  }
  deleteClient() {
    this.state.opt = "delete";
    // console.log("state to be sent : " + JSON.stringify(user));
    axios({
      method: "post",
      url: "http://127.0.0.1/xyz/get_clients.php?",
      headers: { "content-type": "application/json" },
      data: this.state,
    })
      .then((result) => {
        this.setState({
          resultat: result.data.sent,
        });
        this.getData();
        this.closeModalDelete();
        console.log(result);
      })
      .catch((error) => this.setState({ error: error.message }));
  }
  envoiRequete() {
    console.log(this.state);
  }

  openModal() {
    this.setState({
      visible: true,
    });
  }

  openModalDelete(id_utilisateur) {
    console.log("modal delete");
    this.setState({
      visibleDelete: true,
      id_utilisateur: id_utilisateur,
    });
  }
  closeModalDelete() {
    this.setState({
      visibleDelete: false,
    });
  }
  closeModal() {
    this.setState({
      visible: false,
    });
  }
  getData() {
    this.state.opt = "utilisateurs";
    axios({
      method: "post",
      url: "http://127.0.0.1/xyz/get_clients.php?",
      headers: { "content-type": "application/json" },
      data: this.state,
    })
      .then((result) => {
        this.setState({
          clients: result.data,
        });
      })
      .catch((error) => this.setState({ error: error.message }));
    let xyz = {};
    xyz.opt = "fournisseurs";
    axios({
      method: "post",
      url: "http://127.0.0.1/xyz/gestion_fournisseur.php?",
      headers: { "content-type": "application/json" },
      data: xyz,
    })
      .then((result) => {
        this.setState({
          fournisseurs: result.data,
          id_fournisseur:result.data[0].id_fournisseur
        });
      })
      .catch((error) => this.setState({ error: error.message }));
     // this.setState({id_fournisseur:this.state.fournisseurs[0].id_fournisseur});
  }
  getType(x) {
    switch (x) {
      case "0":
        return "caissier";
        break;
      case "1":
        return "commercial";
        break;
      case "2":
        return "admin";
        break;
    }
  }
  change(event){
    this.setState({id_fournisseur: event.target.value});
    console.log(event.target.value);

}
  render() {
    return (
      <Container fluid sm={{ size: 8, order: 2, offset: 0 }}>
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="4"
            title="Gestion des utilisateurs"
            className="text-sm-left"
          />
        </Row>
        <Row>
          <FormInput
            placeholder="Rechercher utilisateurs par email"
            required
            name="recherche"
            onChange={this.handleChange}
            pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
            style={{
              maxWidth: "350px",
              marginBottom: "10px",
              marginLeft: "10px",
            }}
          />
          <Col sm={{ offset: 6 }}>
            <section>
              <button
                className="btn btn-success"
                type="button"
                value="Open"
                onClick={() => this.openModal()}
                style={{ fontSize: "14px" }}
              >
                <i className="fa fa-plus mr-2"></i> Ajouter Utilisateur
              </button>
              <Modal
                visible={this.state.visibleDelete}
                width="500"
                height="200"
                effect="fadeInDown"
                onClickAway={() => this.closeModalDelete()}
              >
                <div style={{ padding: "20px" }}>
                  <h3>Supprimer Utilisateur</h3>
                  <hr></hr>
                  <div>
                    Utilisateur {this.state.id_utilisateur} sera supprimé
                    définitivement
                  </div>
                  <br />
                  <br />
                  <div className="row mb-2">
                    <button
                      className="btn btn-danger ml-2"
                      onClick={() => this.deleteClient()}
                    >
                      Supprimer
                    </button>
                    <button
                      className="btn btn-light ml-2"
                      onClick={() => this.closeModalDelete()}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </Modal>
              <Modal
                visible={this.state.visible}
                width="600"
                height="600"
                effect="fadeInDown"
                onClickAway={() => this.closeModal()}
              >
                <div style={{ padding: "20px" }}>
                  <h3>Ajout Utilisateur</h3>
                  <hr></hr>
                  <FormSelect
                    name="id_fournisseur"
                    id="id_fournisseur"
                    style={{
                      maxWidth: "350px",
                      marginBottom: "10px",
                      marginLeft: "10px",
                    }}
                    size="sm"
                    className="mb-2"
                    onChange={this.change}
                  >
                    {this.state.fournisseurs.map((item, i) => {
                      return (
                        <option key={i} value={item.id_fournisseur}>
                          {item.nom} {item.id_fournisseur}
                        </option>
                      );
                    })}
                  </FormSelect>
                  <FormInput
                    placeholder="Nom"
                    name="nom"
                    id="nom"
                    required
                    pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
                    onChange={this.handleChange}
                    style={{
                      maxWidth: "350px",
                      marginBottom: "10px",
                      marginLeft: "10px",
                    }}
                    className="mt-2"
                  />
                  <FormInput
                    placeholder="Email"
                    name="email"
                    id="email"
                    required
                    pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
                    onChange={this.handleChange}
                    style={{
                      maxWidth: "350px",
                      marginBottom: "10px",
                      marginLeft: "10px",
                    }}
                    className="mt-2"
                  />
                  <FormInput
                    placeholder="Téléphone"
                    onChange={this.handleChange}
                    name="tel"
                    id="tel"
                    required
                    pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
                    style={{
                      maxWidth: "350px",
                      marginBottom: "10px",
                      marginLeft: "10px",
                    }}
                    className="mt-2"
                  />
                  <FormInput
                    placeholder="mdp"
                    onChange={this.handleChange}
                    name="mdp"
                    id="mdp"
                    required
                    pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
                    style={{
                      maxWidth: "350px",
                      marginBottom: "10px",
                      marginLeft: "10px",
                    }}
                    className="mt-2"
                  />

                  <FormRadio
                    name="type"
                    checked={this.state.type === "caissier"}
                    onChange={() => {
                      this.changerType("caissier");
                    }}
                  >
                    Caissier
                  </FormRadio>
                  <FormRadio
                    name="type"
                    checked={this.state.type === "commercial"}
                    onChange={() => {
                      this.changerType("commercial");
                    }}
                  >
                    Commercial
                  </FormRadio>
                  <FormRadio
                    name="type"
                    checked={this.state.type === "admin"}
                    onChange={() => {
                      this.changerType("admin");
                    }}
                  >
                    Admin
                  </FormRadio>
                  <button
                    type="reset"
                    className="btn btn-primary mr-2 ml-2"
                    href="javascript:void(0);"
                    onClick={() => this.creerClient()}
                    style={{ fontSize: "14px" }}
                  >
                    Créer utilisateur
                  </button>
                  <button
                    className="btn btn-success"
                    href="javascript:void(0);"
                    onClick={() => this.closeModal()}
                    style={{ fontSize: "14px" }}
                  >
                    Annuler
                  </button>
                </div>
              </Modal>
            </section>
          </Col>
        </Row>
        {/* Default Light Table */}
        <Row>
          <Col>
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">Utilisateurs</h6>
              </CardHeader>
              <CardBody className="p-0 pb-1">
                <table className="table mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="border-0">
                        #
                      </th>
                      <th scope="col" className="border-0">
                        Nom
                      </th>
                      <th scope="col" className="border-0">
                        Email
                      </th>
                      <th scope="col" className="border-0">
                        Téléphone
                      </th>
                      <th scope="col" className="border-0">
                        Type
                      </th>
                      <th scope="col" className="border-0">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.clients
                      .filter((client) =>
                        client.email.includes(this.state.recherche)
                      )
                      .map((item, i) => {
                        console.log("test");
                        return (
                          <tr key={i}>
                            <td>{item.id_utilisateur}</td>
                            <td>{item.nom}</td>
                            <td>{item.email}</td>
                            <td>{item.tel}</td>
                            <td>{this.getType(item.type)}</td>
                            <td>
                              <button
                                className=" btn btn-outline-danger"
                                onClick={() =>
                                  this.openModalDelete(item.id_utilisateur)
                                }
                              >
                                <i className="fa fa-trash "></i>
                              </button>
                              <button
                                style={{ marginLeft: "5px" }}
                                className="btn btn-outline-primary"
                              >
                                {" "}
                                <i className="fa fa-edit"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      }, this)}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Default Dark Table */}
      </Container>
    );
  }
}
export default Utilisateurs;
