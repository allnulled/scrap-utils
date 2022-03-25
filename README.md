# scrap-utils

Utilidad para arrancar web-scraps escalables rápidamente.

## Instalación

#### Instalar por NPM:

Para instalar: `npm i -g scrap-utils`.

Para arrancar: `start-scrap`.


#### Instalar por Git:

Para instalar:

  - `git clone https://github.com/allnulled/scrap-utils.git`
  - `cd scrap-utils`
  - `npm i`

Para arrancar: `node server.js`

## Prestaciones

  - Servidor HTTP (8080) y HTTPS (8443).
  - Operaciones:«add», «set» y «expand».
  - Script para lado cliente con varias utilidades, como:
    - función de carga de scripts genérica
    - función de carga de jquery, axios y vue2.
    - función de encuentro de tags por texto.
    - funciones listadas en el despliegue del servidor.
  - Script para lado servidor, que acepta CORS, y permite:
    - añadir datos
    - acceder al script del lado cliente
    - one-liner para descargarse el script (por http o https)
    - instrucciones ya incluidas en el despliegue y en los errores devueltos por el servidor.

Poco más, el siguiente paso es crear los scripts necesarios con [GreaseMonkey](https://addons.mozilla.org/ca/firefox/addon/greasemonkey/) (en Firefox) o [TamperMonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ca) (en Chrome) o alguna parecida, importando el script de utilidades si se quiere.

## Licencia

Sin licencia.