/**
 * 
 * @param {Number} time - Time to wait.
 * @param {String} msg - Message to log.
 * @returns {Undefined}
 */
 window.startTimeout = function (time, msg = "(undefined step)") {
    console.log(msg);
    return new Promise((ok, fail) => {
        setTimeout(ok, time);
    });
};
window.getDeepestElementsOfList = function (nodes) {
    const deepestNodes = [];
    for (let index1 = 0; index1 < nodes.length; index1++) {
        const node = nodes[index1];
        let hasDeepers = false;
        CheckIfHasDeepers:
        for (let index2 = 0; index2 < nodes.length; index2++) {
            let node2 = nodes[index2];
            if ((node !== node2) && node.contains(node2)) {
                hasDeepers = true;
                break CheckIfHasDeepers;
            }
        }
        if (!hasDeepers) {
            deepestNodes.push(node);
        }
    }
    return deepestNodes;
}
/**
 * 
 * @param {String} selector - CSS Selector as string.
 * @param {String} text - Text contained in the element. 
 * @param {Boolean} onlyAppearing - Only tries to match as substring. Default: false.
 * @param {Boolean} onlyOne - Only returns the first item. Default: false.
 * @param {Boolean} onlyDeepest - Only returns nodes that do not have children in the same list. Default: true.
 * @returns {Undefined}
 */
window.getElementByText = function (selector, text, onlyAppearing = false, onlyDeepest = true, onlyOne = false) {
    const elementos = [...document.querySelectorAll(selector)].filter(b => {
        const textUniformed = b.textContent.toLowerCase().replace(/[\n\r\t ]+/g, " ").trim();
        return onlyAppearing
            ? (textUniformed.indexOf(text.toLowerCase()) !== -1)
            : (textUniformed === text.toLowerCase());
    });
    if (elementos.length === 0) {
        throw new Error("No hay elementos que coincidan con: " + selector + " / " + text);
    }
    const elementos2 = onlyDeepest ? getDeepestElementsOfList(elementos) : elementos;
    return onlyOne ? elementos2[0] : elementos2;
};
window.triggerMouseEvent = function (nodeP, eventType) {
    const node = typeof nodeP === "object" ? nodeP : document.querySelector(nodeP);
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent(eventType, true, true);
    node.dispatchEvent(clickEvent);
};
/**
 * 
 * @description Performs a programmatic click event against HTML elements.
 * @param {String|HTMLElement} targetNode - CSS Selector or HTML Element to click.
 * @returns {Undefined}
 */
window.triggerClick = function (targetNode) {
    triggerMouseEvent(targetNode, "mouseover");
    triggerMouseEvent(targetNode, "mousedown");
    triggerMouseEvent(targetNode, "mouseup");
    triggerMouseEvent(targetNode, "click");
};
/**
 * 
 * @param {String} mensaje - Required. Message of the question.
 * @param {String} defecto - Default answer.
 * @param {Function} hastaQue - Answer validator function. Must return a boolean.
 * @param {String|undefined} mensajeHastaQue - Invalid answer message.
 * @param {Function} modifier - Modifier function of the valid answer.
 * @returns {Promise <String>} answer - Text of the answer of the user.
 */
window.ask_until_original = function (mensaje, defecto = "", hastaQue = () => true, mensajeHastaQueP = undefined, modifier = o => o) {
    const mensajeHastaQue = mensajeHastaQueP || "Error: la respuesta introducida no es v??lida.";
    if (typeof window === "object") {
        return new Promise(ok => {
            let isOk = false;
            while (!isOk) {
                const respuesta = window.prompt(mensaje, defecto);
                isOk = hastaQue(respuesta);
                if (isOk) {
                    return modifier(respuesta);
                }
                window.alert(mensajeHastaQue);
            }
        });
    } else if (typeof global === "object") {
        const readline = require("readline");
        const reader = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        return new Promise(ok => {
            let ask = () => {
                reader.question(mensaje + "\n??Respuesta:?? ", respuestaP => {
                    const respuesta = respuestaP === "" ? defecto : respuestaP;
                    const isOk = hastaQue(respuesta);
                    if (!isOk) {
                        console.error(mensajeHastaQue);
                        console.error("");
                        return ask();
                    }
                    reader.close();
                    return ok(modifier(respuesta));
                });
            };
            ask();
        });
    }
};
/**
 * 
 * @param {Object} opt - Can have: { message:String, default:String, validate:Function, error:String, modifier:Function }.
 * @returns {Promise <String>} answer - The answer of the user.
 */
window.ask_until = function (opt) {
    return ask_until_original(
        opt.message,
        opt.default,
        opt.validate || (() => true),
        opt.error || undefined,
        opt.modifier || (o => o),
    );
};
/**
 * 
 * @param {String} src - URL to import the script from.
 * @returns 
 */
window.importScript = function (src, cb) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    document.querySelector("head").appendChild(script);
};

window.importAxios = function() {
    return window.importScript("https://cdnjs.cloudflare.com/ajax/libs/axios/0.26.1/axios.min.js");
};

window.importVue2 = function() {
    return window.importScript("https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.common.dev.min.js");
};

window.importJquery = function() {
    return window.importScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js");
}