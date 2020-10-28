import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  FormInput,
} from "shards-react";
import PageTitle from "../components/common/PageTitle";
import Modal from "react-awesome-modal";

import axios from "axios";
class Fournisseur extends React.Component {
  constructor() {
    super();
    this.state = {
      fournisseurs: [],
      visible: false,
      visibleDelete: false,
      visibleUpdate: false,
      nom: "",
      email: "",
      tel: "",
      opt: "",
      recherche: "",
      errors: {},
      id_fournisseur: null,
      selectedFile : null,
    };
    // Cette liaison est nécéssaire afin de permettre
    // l'utilisation de `this` dans la fonction de rappel.
    this.getData();
    this.creerFournisseur = this.creerFournisseur.bind(this);
    this.openModalDelete = this.openModalDelete.bind(this);
  }


  fileSelect = event => {
    this.setState({selectedFile: event.target.files[0]})
    console.log(event.target.files[0])
  }
  fileUpload = () => {
    const fd = new FormData();
    fd.append('image', this.state.selectedFile, this.state.selectedFile.name);
    axios.post('http://127.0.0.1/xyz/logo.php?id_fournisseur='+this.state.id_fournisseur, fd
    ).then(res=>
    {
    console.log(res);
    }
    );
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
  creerFournisseur() {
    let user = {
      nom: this.state.nom,
      email: this.state.email,
      tel: this.state.tel,
    };
    this.state.opt = "add";
    // console.log("state to be sent : " + JSON.stringify(user));
    axios({
      method: "post",
      url: "http://127.0.0.1/xyz/gestion_fournisseur.php?",
      headers: { "content-type": "application/json" },
      data: this.state,
    })
      .then((result) => {
        this.setState({
          resultat: result.data.sent,
        });
        this.getData();
        this.closeModal();
        console.log(result);
      })
      .catch((error) => this.setState({ error: error.message }));
  }

  updateFournisseur() {
    let user = {
      nom: this.state.nom,
      email: this.state.email,
      tel: this.state.tel,
    };
    this.state.opt = "update";
    // console.log("state to be sent : " + JSON.stringify(user));
    axios({
      method: "post",
      url: "http://127.0.0.1/xyz/gestion_fournisseur.php?",
      headers: { "content-type": "application/json" },
      data: this.state,
    })
      .then((result) => {
        this.setState({
          resultat: result.data.sent,
        });
        this.getData();
        this.closeModalUpdate();
        console.log(result);
      })
      .catch((error) => this.setState({ error: error.message }));
  }


  deleteClient() {
    this.state.opt = "delete";
    // console.log("state to be sent : " + JSON.stringify(user));
    axios({
      method: "post",
      url: "http://127.0.0.1/xyz/gestion_fournisseur.php?",
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
  openModalDelete(id_client) {
    console.log("modal delete");
    this.setState({
      visibleDelete: true,
      id_fournisseur: id_client,
    });
  }
  closeModalDelete() {
    this.setState({
      visibleDelete: false,
    });
  }
  openModalUpdate(id_client) {
    console.log("modal delete");
    this.setState({
      visibleUpdate: true,
      id_fournisseur: id_client,
    });
  }
  closeModalUpdate() {
    this.setState({
      visibleUpdate: false,
    });
  }
  closeModal() {
    this.setState({
      visible: false,
    });
  }
  getData() {
    this.state.opt = "fournisseurs";
    axios({
      method: "post",
      url: "http://127.0.0.1/xyz/gestion_fournisseur.php?",
      headers: { "content-type": "application/json" },
      data: this.state,
    })
      .then((result) => {
        this.setState({
          fournisseurs: result.data,
        });
      })
      .catch((error) => this.setState({ error: error.message }));
  }

  render() {
    return (
      <Container fluid sm={{ size: 8, order: 2, offset: 0 }}>
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="4"
            title="Gestion des fournisseurs"
            className="text-sm-left"
          />
        </Row>
        <Row>
          <FormInput
            placeholder="Rechercher fournisseur par email"
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
          <Col sm={{ offset:6 }}>
            <section>
              <button
                className="btn btn-success"
                type="button"
                value="Open"
                onClick={() => this.openModal()}
                style={{ fontSize: "14px" }}
              >
                <i className="fa fa-plus mr-2"></i> Ajouter Fournisseur
              </button>
              <Modal
                visible={this.state.visibleDelete}
                width="500"
                height="200"
                effect="fadeInDown"
                onClickAway={() => this.closeModalDelete()}
              >
                <div style={{ padding: "20px" }}>
                  <h3>Supprimer Fournisseur</h3>
                  <hr></hr>
                  <div>
                    Fournisseur {this.state.id_fournisseur} sera supprimé
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
                visible={this.state.visibleUpdate}
                width="500"
                height="400"
                effect="fadeInDown"
                onClickAway={() => this.closeModalDelete()}
              >
              <div style={{ padding: "20px" }}>
              <h3>Mise à jour Fournisseur</h3>
              <hr></hr>
              <div>
              <input type="file" onChange = {this.fileSelect} />
            <button onClick = {this.fileUpload}>Upload</button>
            </div>
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
              <a
              className="btn btn-danger"
              href={'/bons/'+this.state.id_fournisseur}
              onClick={() => this.closeModalUpdate()}
              style={{ fontSize: "14px" }}
            >
              Gérer dossier
            </a>
              <button
                type="reset"
                className="btn btn-primary mr-2 ml-2"
                href="javascript:void(0);"
                onClick={() => this.updateFournisseur()}
                style={{ fontSize: "14px" }}
              >
                mettre à jour Fournisseur
              </button>
              <button
                className="btn btn-success"
                href="javascript:void(0);"
                onClick={() => this.closeModalUpdate()}
                style={{ fontSize: "14px" }}
              >
                Annuler
              </button>
            </div>
              </Modal>
              <Modal
                visible={this.state.visible}
                width="600"
                height="300"
                effect="fadeInDown"
                onClickAway={() => this.closeModal()}
              >
                <div style={{ padding: "20px" }}>
                  <h3>Ajout Fournisseur</h3>
                  <hr></hr>

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
                  <button
                    type="reset"
                    className="btn btn-primary mr-2 ml-2"
                    href="javascript:void(0);"
                    onClick={() => this.creerFournisseur()}
                    style={{ fontSize: "14px" }}
                  >
                    Créer Fournisseur
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
                <h6 className="m-0">Fournisseurs</h6>
              </CardHeader>
              <CardBody className="p-0 pb-1">
                <table className="table mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="border-0">
                        Logo
                      </th>
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
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.fournisseurs
                      .filter((f) => f.email.includes(this.state.recherche))
                      .map((item, i) => {
                        console.log("test");
                        return (
                          <tr key={i}>
                            <td>
                              <img
                                src={'http://127.0.0.1/xyz/img/'+item.logo}
                                style={{
                                  maxHeight: "45px",
                                  maxWidth: "45px",
                               
                                  marginTop:'-7px',
                                  
                                }}
                              ></img>
                            </td>
                            <td>{item.id_fournisseur}</td>
                            <td>{item.nom}</td>
                            <td>{item.email}</td>
                            <td>{item.tel}</td>
                            <td>
                              <button
                                className=" btn btn-outline-danger"
                                onClick={() =>
                                  this.openModalDelete(item.id_fournisseur)
                                }
                              >
                                <i className="fa fa-trash "></i>
                              </button>
                              <button
                                style={{ marginLeft: "5px" }}
                                className="btn btn-outline-primary"
                                onClick={() =>
                                    this.openModalUpdate(item.id_fournisseur)
                                  }
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
export default Fournisseur;
