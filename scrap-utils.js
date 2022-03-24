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