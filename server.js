const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const puerto = 8080;
const puerto_seguro = 8443;
const clave_privada  = fs.readFileSync("./https/key.pem", "utf8");
const clave_publica = fs.readFileSync("./https/cert.pem", "utf8");
const credenciales = { key: clave_privada, cert: clave_publica };
const medioware_para_cuerpo = () => [bodyParser.urlencoded({ extended: false }), bodyParser.json()];

app.use(cors());

app.all("/data/push", medioware_para_cuerpo(), async function(request, response, next) {
    try {
        const store = request.body.store || request.query.store;
        const property = request.body.property || request.query.property;
        const mode = request.body.mode || request.query.mode;
        const data_json = request.body.data || request.query.data;
        const data = JSON.parse(data_json);
        const stores_path = path.resolve("./server_data");
        if(!fs.existsSync(stores_path)) {
            fs.mkdirSync(stores_path);
        }
        if(typeof store !== "string") {
            throw new Error("Se requiere parámetro «store»");
        }
        const store_path = path.resolve(stores_path, store + ".json");
        if(!store_path.startsWith(stores_path)) {
            throw new Error("Nombre de ruta no válido por salirse de la ruta");
        }
        if(typeof mode !== "string") {
            throw new Error("Se requiere parámetro «mode»");
        }
        if(["add", "set"].indexOf(mode) === -1) {
            throw new Error("Se requiere parámetro «mode» con valor: «add» o «set»");
        }
        if(typeof property !== "string") {
            throw new Error("Se requiere parámetro «property»");
        }
        if(property.length === 0) {
            throw new Error("Se requiere parámetro «property» con un valor específico");
        }
        if(!fs.existsSync(store_path)) {
            fs.writeFileSync(store_path, "{}", "utf8");
        }
        const store_json = fs.readFileSync(store_path).toString();
        const store_data = JSON.parse(store_json);
        if(mode === "add") {
            if(!(property in store_data)) {
                store_data[property] = [];
            }
            store_data[property].push(data);
        } else if(mode === "set") {
            store_data[property] = data;
        }
        const store_data_to_json = JSON.stringify(store_data);
        fs.writeFileSync(store_path, store_data_to_json, "utf8");
        const metadata = {
            store,
            property,
            mode,
            size_of_data: data_json.length + "B",
            size_of_store: store_data_to_json.length + "B",
        };
        return response.json({
            success: true,
            metadata
        });
    } catch (error) {
        console.error(error);
        return response.json({
            error,
            name: error.name,
            message: error.message,
            stack: error.stack,
        })
    }
});

if(!fs.existsSync("./server_static")) {
    fs.mkdirSync("./server_static");
    const contenidos_de_cliente = fs.readFileSync(__dirname + "/client.js").toString();
    fs.writeFileSync("./server_static/scrapper.js", contenidos_de_cliente, "utf8");
}

app.use("/static", express.static("./server_static"));

Promise.all([
    new Promise((ok, fail) => {
        http.createServer(app).listen(8080, function() {
            console.log("[*] ¡Servidor ON!");
            ok();
        });
    }),
    new Promise((ok, fail) => {
        https.createServer(credenciales, app).listen(8443, function() {
            console.log("[*] ¡Servidor seguro ON!");
            ok();
        });
    })
]).then(() => {
    console.log("[*]         -- API del scrapper -- ");
    console.log(`[*]    ask_until_original(mensaje, defecto = "", hastaQue = () => true, mensajeHastaQueP = undefined, modifier = o => o)
[*]    ask_until(opt)
[*]    getDeepestElementsOfList(nodes)
[*]    getElementByText(selector, text, onlyAppearing = false, onlyDeepest = true, onlyOne = false)
[*]    importScript(src)
[*]    importAxios)
[*]    importVue2)
[*]    importJquery)
[*]    startTimeout(time, msg = "(undefined step)")
[*]    triggerMouseEvent(node, eventType)
[*]    triggerClick(targetNode)
[*]         -- One-liner para importar del scrapper -- 
[*]    (function(e){e.src='https://127.0.0.1:8443/static/scrapper.js';document.head.appendChild(e);})(document.createElement('script'))
[*]    (function(e){e.src='http://127.0.0.1:8080/static/scrapper.js';document.head.appendChild(e);})(document.createElement('script'))`);

    console.log("[*] ======================================= ");
    console.log("[*]         -- Para tomar el script -- ");
    console.log("[*]    https://127.0.0.1:8443/static/scrapper.js");
    console.log("[*]    http://127.0.0.1:8080/static/scrapper.js");
    console.log("[*]         -- Para añadir datos -- ");
    console.log("[*]    https://127.0.0.1:8443/data/push");
    console.log("[*]    http://127.0.0.1:8080/data/push");
    console.log("[*] ======================================= ");
})