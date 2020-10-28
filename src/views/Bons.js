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
} from "shards-react";
import PageTitle from "../components/common/PageTitle";
import Modal from "react-awesome-modal";

import axios from "axios";
class Bons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bons: [],
      visible: false,
      visibleDelete: false,
      visibleUpdate: false,
      nom: "",
      email: "",
      tel: "",
      opt: "",
      qte:null,
      recherche: "",
      errors: {},
      valeur: null,
      id_bon: null,
      id_fournisseur: null,
      type: "",
      selectedFile: null,
    };
    // Cette liaison est nécéssaire afin de permettre
    // l'utilisation de `this` dans la fonction de rappel.
    if (props.match.params.id != null) {
      this.routeParam = props.match.params.id;
      this.getData(this.routeParam);
    }
    console.log(this.routeParam);
    this.getData();
    this.creerbon = this.creerbon.bind(this);
    this.openModalDelete = this.openModalDelete.bind(this);
    this.changerType = this.changerType.bind(this);
  }
  changerType(type) {
    this.setState({
      type: type,
    });
  }

  handleChange = (event) => {
    let validEmailRegex = RegExp(
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<a>()[\]\.,;:\s@\"]{2,})$/i
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
  creerbon() {
    let user = {
      nom: this.state.nom,
      email: this.state.email,
      tel: this.state.tel,
      id_fournisseur:this.state.id_fournisseur
    };
    this.state.opt = "add";
    // console.log("state to be sent : " + JSON.stringify(user));
    axios({
      method: "post",
      url: "http://127.0.0.1/xyz/gestion_bon.php?",
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

  updatebon() {
    let user = {
      nom: this.state.nom,
      email: this.state.email,
      tel: this.state.tel,
    };
    this.state.opt = "update";
    // console.log("state to be sent : " + JSON.stringify(user));
    axios({
      method: "post",
      url: "http://127.0.0.1/xyz/gestion_bon.php?",
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
      url: "http://127.0.0.1/xyz/gestion_bon.php?",
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
      id_bon: id_client,
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
      id_bon: id_client,
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

  getData(id_fournisseur) {
    if (id_fournisseur != null) this.state.id_fournisseur = id_fournisseur;
    this.state.opt = "bons";
    axios({
      method: "post",
      url: "http://127.0.0.1/xyz/gestion_bon.php",
      headers: { "content-type": "application/json" },
      data: this.state,
    })
      .then((result) => {
        this.setState({
          bons: result.data,
        });
        console.log(result.data);
      })
      .catch((error) => this.setState({ error: error.message }));
  }

  render() {
    return (
      <Container fluid sm={{ size: 8, order: 2, offset: 0 }}>
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Gestion des bons" className="text-sm-left" />
        </Row>
        <Row>
          <FormInput
            placeholder="Rechercher bon par numéro dossier"
            required
            name="recherche"
            onChange={this.handleChange}
            type="number"
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
                <i className="fa fa-plus mr-2"></i> Ajouter bon
              </button>
              <Modal
                visible={this.state.visibleDelete}
                width="500"
                height="200"
                effect="fadeInDown"
                onClickAway={() => this.closeModalDelete()}
              >
                <div style={{ padding: "20px" }}>
                  <h3>Supprimer bon</h3>
                  <hr></hr>
                  <div>
                    bon {this.state.id_bon} sera supprimé définitivement
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
                  <h3>Mise à jour bon</h3>
                  <hr></hr>
                  <div>
                    <input type="file" onChange={this.fileSelect} />
                    <button onClick={this.fileUpload}>Upload</button>
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
                  <button
                    type="reset"
                    className="btn btn-primary mr-2 ml-2"
                    href="javascript:void(0);"
                    onClick={() => this.updatebon()}
                    style={{ fontSize: "14px" }}
                  >
                    mettre à jour bon
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
                width="800"
                height="600"
                effect="fadeInDown"
                onClickAway={() => this.closeModal()}
              >
                <div style={{ padding: "20px" }}>
                  <h3>Ajout bon</h3>
                  <hr></hr>
                  <FormRadio
                    name="type"
                    checked={this.state.type === "promotion"}
                    onChange={() => {
                      this.changerType("promotion");
                    }}
                  >
                    Promotion
                  </FormRadio>
                  <FormRadio
                    name="type"
                    checked={this.state.type === "vente"}
                    onChange={() => {
                      this.changerType("vente");
                    }}
                  >
                    Vente
                  </FormRadio>
                  <FormInput
                    placeholder="Valeur"
                    name="valeur"
                    id="valeur"
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
                    placeholder="Quantite"
                    name="qte"
                    id="qte"
                    type="number"
                    required
                    onChange={this.handleChange}
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
                    onClick={() => this.creerbon()}
                    style={{ fontSize: "14px" }}
                  >
                    Créer bon
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
                <h6 className="m-0">bons</h6>
              </CardHeader>
              <CardBody className="p-0 pb-1">
                <table className="table mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="border-0">
                      numero dossier
                      </th>
                      <th scope="col" className="border-0">
                        code bon
                      </th>
                      <th scope="col" className="border-0">
                        état
                      </th>
                      <th scope="col" className="border-0">
                        valeur
                      </th>
                      <th scope="col" className="border-0">
                        date issue
                      </th>
                      <th scope="col" className="border-0">
                        date consommation
                      </th>
                      <th scope="col" className="border-0">
                        date expiration
                      </th>
                      <th scope="col" className="border-0">
                        type
                      </th>

                      <th scope="col" className="border-0">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.bons
                      .filter((f) => f.num_dossier.includes(this.state.recherche))
                      .map((item, i) => {
                        console.log("test");
                        let xtype = item.type == 0 ? "vente" : "promotion";
                        console.log(xtype);
                        return (
                          <tr key={i}>
                            <td>{item.num_dossier}</td>
                            <td>{item.code_barre}</td>
                            <td>{item.etat}</td>
                            <td>{item.valeur}</td>
                            <td>{item.date_issue}</td>

                            <td>{item.date_conso}</td>
                            <td>{item.date_exp}</td>
                            <td>{xtype}</td>

                            <td>
                              <button
                                className=" btn btn-outline-danger"
                                onClick={() =>
                                  this.openModalDelete(item.id_bon)
                                }
                              >
                                <i className="fa fa-trash "></i>
                              </button>

                              <a
                                href={"/details/" + item.id_bon}
                                style={{ marginLeft: "5px" }}
                                className="btn btn-outline-primary"
                              >
                                <i className="fa fa-edit"></i>
                              </a>
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
export default Bons;
