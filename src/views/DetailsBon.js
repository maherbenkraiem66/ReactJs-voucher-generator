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
import { useParams, useLocation } from "react-router";
import axios from "axios";
import queryString from "query-string";
import ReactToPrint from "react-to-print";
import './styles.css';
class DetailsBon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      details: {},
      visible: false,
      visibleDelete: false,
      visibleUpdate: false,
      nom: "",
      email: "",
      tel: "",
      opt: "",
      recherche: "",
      errors: {},
      valeur: null,
      id_bon: null,
      type: "",
      id_bon: null,
      selectedFile: null,
      nom_caissier:"",
      tel_caissier:"",

    };
    // Cette liaison est nécéssaire afin de permettre
    // l'utilisation de `this` dans la fonction de rappel.
    this.routeParam = props.match.params.id;
    console.log(this.routeParam);
    this.getData();
    this.getDataById();
  }

  getDataById() {
    this.state.opt = "getById";
    this.state.id_bon = this.routeParam;
    axios({
      method: "post",
      url: "http://127.0.0.1/xyz/gestion_bon.php",
      headers: { "content-type": "application/json" },
      data: this.state,
    })
      .then((result) => {
        this.setState({
          details: result.data,
        });
        this.setState({
          nom_caissier:sessionStorage.getItem("nom"),
          tel_caissier:sessionStorage.getItem("tel")
        })
        console.log(result.data);
      })
      .catch((error) => this.setState({ error: error.message }));
  }
  getData() {
    this.state.opt = "bons";
    axios({
      method: "post",
      url: "http://127.0.0.1/xyz/gestion_bon.php",
      headers: { "content-type": "application/json" },
      data: this.state,
    })
      .then((result) => {
        this.setState({
          details: result.data,
        });
        console.log(result.data);
    
      this.setState({
        nom_caissier:sessionStorage.getItem("nom"),
        tel_caissier:sessionStorage.getItem("tel")
      })
    })
      .catch((error) => this.setState({ error: error.message }));
  }



  render() {
    if (this.state.details.etat=="encaisse"){

      
      return (
        <Container fluid sm={{ size: 6, order: 2, offset: 0 }}>
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Details bon" className="text-sm-left" />
        </Row>
        <Row       style={{
          backgroundColor: "#ffffff",
          minHeight: "325px",
          minWidth: "500px ",
        }}>
          <ReactToPrint             style={{
            backgroundColor: "#ffffff",
            minHeight: "325px",
            maxWidth: "500px ",
          }}
            trigger={() => {
              // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
              // to the root node of the returned component as it will be overwritten.
              return (
                <a
                  href="#"
                  className="btn btn-primary "
                  style={{
                    maxHeight: "37px",
                    fontStyle: "bold",
                    marginLeft: "20px",
                  }}
                > <i className="fa fa-print mr-2"></i>
                  Imprimer reçu
                </a>
              );
            }}
            content={() => this.componentRef}
          />
          <Col
            sm={{ offset: 0 }}
            style={{
              backgroundColor: "#ffffff",
              minHeight: "175px",
              maxWidth: "500px ",
            }}
          >
            <section
              style={{
                backgroundColor: "#ffffff",
                minHeight: "175px",
                maxWidth: "500px",
                margin: "20px",
              }}
              ref={(el) => (this.componentRef = el)}
            >
         
              <Col>
                <Row>
                  <Col>Reçu : </Col> <Col>#{this.routeParam}</Col>
                </Row>
                <Row>
                  <Col>Valeur</Col> <Col>{this.state.details.valeur}</Col>
                </Row>
                <Row>
                  <Col>Type</Col>
                  <Col>{this.state.details.type}</Col>
                </Row>
                <Row>
                  <Col>Date création</Col>{" "}
                  <Col>{this.state.details.date_issue}</Col>
                </Row>

                <Row>
                <Col>Date expiration</Col>{" "}
                <Col>{this.state.details.date_exp}</Col>
              </Row>
              <Row>
              <Col>Date consommation</Col>{" "}
              <Col>{this.state.details.date_conso}</Col>
            </Row>
            <Row>
            <Col>nom caissier: {this.state.nom_caissier}</Col>{" "}
            <Col>tél : {this.state.tel_caissier}</Col>
          </Row>

              </Col>


            </section>
          </Col>
        </Row>

        {/* Default Dark Table */}
      </Container>
      );
    }else 
    return (
      <Container fluid sm={{ size: 8, order: 2, offset: 0 }}>
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Details bon" className="text-sm-left" />
        </Row>
        <Row       style={{
          backgroundColor: "#ffffff",
          minHeight: "325px",
          minWidth: "500px ",
        }}>
          <ReactToPrint             style={{
            backgroundColor: "#ffffff",
            minHeight: "325px",
            maxWidth: "500px ",
          }}
            trigger={() => {
              // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
              // to the root node of the returned component as it will be overwritten.
              return (
                <a
                  href="#"
                  className="btn btn-primary "
                  style={{
                    maxHeight: "37px",
                    fontStyle: "bold",
                    marginLeft: "20px",
                  }}
                > <i className="fa fa-print mr-2"></i>
                  Imprimer bon
                </a>
              );
            }}
            content={() => this.componentRef}
          />
          <Col
            sm={{ offset: 2 }}
            style={{
              backgroundColor: "#ffffff",
              minHeight: "325px",
              maxWidth: "500px ",
            }}
          >
            <section
              style={{
                backgroundColor: "#ffffff",
                minHeight: "300px",
                maxWidth: "500px",
                margin: "20px",
              }}
              ref={(el) => (this.componentRef = el)}
            >
         
              <Col>
                <Row>
                  <Col>Identifiant unique</Col> <Col>#{this.routeParam}</Col>
                </Row>
                <Row>
                  <Col>Valeur</Col> <Col>{this.state.details.valeur}</Col>
                </Row>
                <Row>
                  <Col>Type</Col>
                  <Col>{this.state.details.type}</Col>
                </Row>
                <Row>
                  <Col>Date création</Col>{" "}
                  <Col>{this.state.details.date_issue}</Col>
                </Row>
                <Row>
                  <Col>Date expiration</Col>{" "}
                  <Col>{this.state.details.date_exp}</Col>
                </Row>
                <Row className="mt-3">
                  <Col>code à barre</Col>{" "}
                  <Col>
                    <Row>
                      <img
                        src={
                          "http://127.0.0.1/xyz/img/" +
                          this.state.details.code_barre +
                          ".png"
                        }
                      />
                    </Row>
                    <Row className="ml-5">{this.state.details.code_barre}</Row>
                  </Col>
                </Row>
                <Row style={{ minHeight: "100px" }}>
                  {" "}
                  <Col>
                    {" "}
                    <img
                      src={
                        "http://127.0.0.1/xyz/img/" +
                        this.state.details.logof
                      }
                      style={{
                        maxHeight: "100px",
                        maxWidth: "100px",

                        marginTop: "-7px",
                      }}
                    ></img>
                  </Col>
                </Row>
              </Col>
              <Row>

                <Col>Nom </Col>
                <Col>Email </Col>
                <Col>Téléphone</Col>
              </Row>
              <Row>
    
                <Col>{this.state.details.nomf} </Col>
                <Col>{this.state.details.emailf} </Col>
                <Col>{this.state.details.telf}</Col>
              </Row>
            </section>
          </Col>
        </Row>

        {/* Default Dark Table */}
      </Container>
    );
  }
}
export default DetailsBon;
