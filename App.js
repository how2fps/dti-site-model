const express = require("express");
const cors = require("cors");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const portName = "COM5";
const baudRate = 9600;
const port = new SerialPort({
       lock: false,
       path: portName,
       baudRate: baudRate,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

parser.on("data", (data) => {
       console.log(data.toString());
});

port.on("open", () => {
       // Now that the port is open, you can write data to it

       setTimeout(() => {
              port.write("hi", function (err) {
                     if (err) {
                            return console.log("Error on write: ", err.message);
                     }
              });
       }, 2000);
});

port.on("readable", function () {
       console.log("Data:", port.read());
});
// Open errors will be emitted as an error event
port.on("error", function (err) {
       console.log("Error: ", err.message);
});

app.get("/bus-arrives", async (req, res) => {
       try {
              port.write("bus_arrives", function (err) {
                     if (err) {
                            return console.log("Error on write: ", err.message);
                     }
              });
              res.status(200).header("Access-Control-Allow-Origin", "*").send("Bus arrive");
       } catch (e) {
              console.log(e);
       }
});

app.get("/bus-leaves", async (req, res) => {
       try {
              port.write("bus_left", function (err) {
                     if (err) {
                            return console.log("Error on write: ", err.message);
                     }
              });
              res.status(200).header("Access-Control-Allow-Origin", "*").send("Bus left");
       } catch (e) {
              console.log(e);
       }
});

app.listen(3500, () => {});
