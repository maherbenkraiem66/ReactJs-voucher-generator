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
import Quagga from "quagga"; // ES6
import { toast } from "react-toastify";
import "./styles.css";

class Caisse extends React.Component {
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
      xyz: "",
      scanning: false,
      results: [],
      code_barre: null,
      visibility: "none",
    };

    
    // Cette liaison est nécéssaire afin de permettre
    // l'utilisation de `this` dans la fonction de rappel.
    this.routeParam = props.match.params.id;
    console.log(this.routeParam);
    this.setData = this.setData.bind(this);
    this._scan = this._scan.bind(this);
    this._onDetected = this._onDetected.bind(this);
    this.getDataByCode = this.getDataByCode.bind(this);
  }

  _scan() {
    this.setState({ scanning: !this.state.scanning });
  }

  _onDetected(result) {
    this.setState({ results: this.state.results.concat([result]) });
  }
  xyz() {}
  init() {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#yourElement"),
          constraints: {
            width: 480,
            height: 320,
            facingMode: "environment",
          },
        },
        decoder: {
          readers: ["code_128_reader"],
          debug: {
            showCanvas: true,
            showPatches: true,
            showFoundPatches: true,
            showSkeleton: true,
            showLabels: true,
            showPatchLabels: true,
            showRemainingPatchLabels: true,
            boxFromPatches: {
              showTransformed: true,
              showTransformedBox: true,
              showBB: true,
            },
          },
        },
      },
      function (err) {
        if (err) {
          alert("You need a camera to scan barcodes.");
          console.log(err);
          document.querySelector("#yourElement").innerHTML = "";

          return;
        }

        console.log("Initialization finished. Ready to start");
        Quagga.start();

        // Set flag to is running
        //_scannerIsRunning = true;
      }
    );

    Quagga.onProcessed(function (result) {
      var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;
      drawingCanvas.marginTop = -100;
      drawingCanvas.position = "overlay";

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute("width")),
            parseInt(drawingCanvas.getAttribute("height"))
          );
          result.boxes
            .filter(function (box) {
              return box !== result.box;
            })
            .forEach(function (box) {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: "green",
                lineWidth: 3,
              });
            });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: "#00F",
            lineWidth: 2,
          });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(
            result.line,
            { x: "x", y: "y" },
            drawingCtx,
            { color: "green", lineWidth: 3 }
          );
        }
      }
    });

    Quagga.onDetected(function (
      result,
      encaisser = (code) => {
        let xyz = { code: code, opt: "encaisser" };

        console.log("this.state.code_barre" + xyz);
        axios({
          method: "post",
          url: "http://127.0.0.1/xyz/gestion_bon.php",
          headers: { "content-type": "application/json" },
          data: xyz,
        })
          .then((result) => {
            console.log(result.data);
            alert('bon encaissé avec succes');
            window.location='http://localhost:3000/details/'+result.data.id_bon;

            toast.success("Success ", {
              position: toast.POSITION.TOP_CENTER,
            });
          })
          .catch((error) => console.log({ error: error.message }));
      }
    ) {
      Quagga.stop();
      document.querySelector("#text-input").value = result.codeResult.code;
      //encaisser(result.codeResult.cod
      encaisser(result.codeResult.code);
      document.querySelector("#yourElement").innerHTML = "";
      console.log(
        "Barcode detected and processed : [" + result.codeResult.code + "]",
        result
      );
    });
  }
  setData(str) {
    this.state.xyz = str;
  }

  getDataByCode() {
    this.state.opt = "getByCode";
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
          visibility: "inline",
        });
        console.log(result.data);

      })
      .catch((error) => this.setState({ error: error.message }));
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
      })
      .catch((error) => this.setState({ error: error.message }));
  }

  render() {
    return (
      <Container fluid sm={{ size: 8, order: 2, offset: 0 }}>
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Details bon" className="text-sm-left" />
        </Row>
        <Row>
          <div
            id="yourElement"
            style={{ width: "480px", height: "400px" }}
      
            width="480px"
            height="400px"
          >
            <div>
              <p>Barcode: </p>
              <input type="text" id="text-input" onChange={this.encaisser} />
            </div>
          </div>
          <a
            onClick={this.init}
            href="#"
            className="btn btn-primary "
            style={{
              maxHeight: "37px",
              fontStyle: "bold",
              marginLeft: "20px",
            }}
          >
            {" "}
            <i className="fa fa-print mr-2"></i>
            Démarrer
          </a>
          <ReactToPrint
            trigger={() => {
              // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
              // to the root node of the returned component as it will be overwritten.
              return <div></div>;
            }}
            content={() => this.componentRef}
          />

          <Col sm={{ offset: 2 }}></Col>
          <Col
            sm={{ offset: 2 }}
            style={{
              backgroundColor: "#ffffff",
              minHeight: "500px",
              minWidth: "800px",
            }}
          >
            <section
              style={{
                backgroundColor: "#ffffff",
                minHeight: "500px",
                minWidth: "800px",
                margin: "20px",
                display: this.state.visibility === "none" ? "none" : "inline",
              }}
              ref={(el) => (this.componentRef = el)}
            >
              <Row style={{ minHeight: "50px" }}></Row>
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
                <Col />
                <Col>Nom </Col>
                <Col>Email </Col>
                <Col>Téléphone</Col>
              </Row>
              <Row>
                <Col />
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
export default Caisse;
