import React from "react";
import ReactDOM from "react-dom";
import Quagga from "quagga"; // ES6
import { useToasts } from 'react-toast-notifications'

class BarcodeTextField extends React.Component {
    constructor(props) {
      super(props);
      // This binding is necessary to make `this` work in the callback
      this.handleClick = this.handleClick.bind(this);
      this.handleFileSelect = this.handleFileSelect.bind(this);
    }

    handleClick() {

        this.startScanner();
      
    }
  
    startScanner() {
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#scanner-container"),
            constraints: {
              width: 480,
              height: 320,
              facingMode: "environment"
            }
          },
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "code_39_reader",
              "code_39_vin_reader",
              "codabar_reader",
              "upc_reader",
              "upc_e_reader",
              "i2of5_reader"
            ],
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
                showBB: true
              }
            }
          }
        },
        function(err) {
          if (err) {
            alert("You need a camera to scan barcodes.");
            console.log(err);
            document.querySelector("#scanner-container").innerHTML = "";
  
            return;
          }
  
          console.log("Initialization finished. Ready to start");
          Quagga.start();
  
          // Set flag to is running
          //_scannerIsRunning = true;
        }
      );
  
      Quagga.onProcessed(function(result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
          drawingCanvas = Quagga.canvas.dom.overlay;
  
        if (result) {
          if (result.boxes) {
            drawingCtx.clearRect(
              0,
              0,
              parseInt(drawingCanvas.getAttribute("width")),
              parseInt(drawingCanvas.getAttribute("height"))
            );
            result.boxes
              .filter(function(box) {
                return box !== result.box;
              })
              .forEach(function(box) {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                  color: "green",
                  lineWidth: 2
                });
              });
          }
  
          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
              color: "#00F",
              lineWidth: 2
            });
          }
  
          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(
              result.line,
              { x: "x", y: "y" },
              drawingCtx,
              { color: "red", lineWidth: 3 }
            );
          }
        }
      });
  
      Quagga.onDetected(function(result) {
        Quagga.stop();
        document.querySelector("#text-input").value = result.codeResult.code;
        document.querySelector("#scanner-container").innerHTML = "";
        console.log(
          "Barcode detected and processed : [" + result.codeResult.code + "]",
          result
        );
      });
    }
  
    handleFileSelect(evt) {
      var files = evt.target.files; // FileList object
  
      var tmpImgURL = URL.createObjectURL(files[0]);
  
      Quagga.decodeSingle(
        {
          src: tmpImgURL,
          numOfWorkers: 0, // Needs to be 0 when used within node
          locate: true,
          inputStream: {
            size: 800 // restrict input-size to be 800px in width (long-side)
          },
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "code_39_reader",
              "code_39_vin_reader",
              "codabar_reader",
              "upc_reader",
              "upc_e_reader",
              "i2of5_reader"
            ]
          }
        },
        function(result) {
          console.log(result);
          if (result) {
            if (result.codeResult != null) {
              document.querySelector("#text-input").value =
                result.codeResult.code;
              console.log("result", result.codeResult.code);
            } else {
              alert("not detected");
              document.querySelector("#text-input").value = "";
            }
          } else {
            alert("not detected");
            document.querySelector("#text-input").value = "";
          }
        }
      );
    }
  
    componentDidMount() {
      document
        .querySelector("#inputId")
        .addEventListener("change", this.handleFileSelect, false);
    }
  
    render() {
      return (
        <div style={{ display: "inline-block" }}>
          <input type="text" id="text-input" />
          <canvas></canvas>
          <button onClick={this.handleClick}> Scan </button>
          <input id="inputId" type="file" accept="image/*" />
        </div>
      );
    }
  }
export default BarcodeTextField;