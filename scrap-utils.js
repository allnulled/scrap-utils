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
/**
 * 
 * @param {String} selector - CSS Selector as string.
 * @param {String} text - Text contained in the element. 
 * @param {Boolean} onlyOne - Only returns the first item. Default: false.
 * @param {Boolean} onlyAppearing - Only tries to match as substring. Default: false.
 * @returns {Undefined}
 */
window.getElementByText = function (selector, text, onlyOne = false, onlyAppearing = false) {
    const elementos = [...document.querySelectorAll(selector)].filter(b => {
        const textUniformed = b.textContent.toLowerCase().replace(/ +/g, " ").trim();
        return onlyAppearing
            ? (textUniformed.indexOf(text) !== -1)
            : (textUniformed === text);
    });
    if (elementos.length === 0) {
        throw new Error("No hay elementos que coincidan con: " + selector + " / " + text);
    }
    return onlyOne ? elementos[0] : elementos;
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
const ask_until_original = function(mensaje, defecto = "", hastaQue = () => true, mensajeHastaQueP = undefined, modifier = o => o) {
    const mensajeHastaQue = mensajeHastaQueP || "Error: la respuesta introducida no es válida.";
    if(typeof window === "object") {
        return new Promise(ok => {
            let isOk = false;
            while(!isOk) {
                const respuesta = window.prompt(mensaje, defecto);
                isOk = hastaQue(respuesta);
                if(isOk) {
                    return modifier(respuesta);
                }
                window.alert(mensajeHastaQue);
            }
        });
    } else if(typeof global === "object") {
        const readline = require("readline");
        const reader = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        return new Promise(ok => {
            let ask = () => {
                reader.question(mensaje + "\n«Respuesta:» ", respuestaP => {
                    const respuesta = respuestaP === "" ? defecto : respuestaP;
                    const isOk = hastaQue(respuesta);
                    if(!isOk) {
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
window.ask_until = function(opt) {
    return ask_until_original(
        opt.message,
        opt.default,
        opt.validate || (() => true),
        opt.error || undefined,
        opt.modifier || (o => o),
    );
};