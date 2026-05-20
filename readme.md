1.- inicializar: npm init -y

2.- instalacion de dependencias:

<!-- * npm install bcryptjs@3.0.2 cookie-parser@1.4.7 cors@2.8.5 dotenv@17.2.1 express@5.1.0 express-rate-limit@8.1.0 jsonwebtoken@9.0.2 mercadopago@2.8.0 zod@4.0.15 -->

Dependencias Back
ocryptjs: 3.0.2
sirve para encriptar contraseñas en aplicaciones de JavaScript/Node.js.
/_
dotenv: 17.2.1
Es un paquete que carga variables de entorno desde un archivo .env hacia process.env en tu aplicación Node.js.
/_
jsonwebtoken: 9.0.2
Es una librería que sirve para
crear y verificar tokens de acceso en formato JSON.
/_
cookie-parser: 1.4.7
Es un middleware de Express que sirve para leer y manejar cookies que vienen en las peticiones HTTP del cliente.
/_
cors: 2.8.5
Es un middleware de Express que controla qué dominios externos pueden hacer peticiones a tu API.
/_
express: 5.1.0
Es un framework minimalista para Node.js que sirve para crear servidores web y APIs de forma rápida y sencilla.
/_
express-rate-limit: 8.1.0
Es un middleware para Express que sirve para limitar la cantidad de peticiones que un cliente (IP) puede hacer en un cierto período de tiempo.
/_
mercadopago: 2.8.0
Es el SDK oficial de Mercado Pago para Node.js.
Sirve para integrar pagos online en tu aplicación: checkout,
suscripciones, cobros con tarjeta, pagos con QR, links de pago, etc.
/_
mongoose: 8.17.1
Es una librería de Node.js que sirve para modelar y manejar datos en MongoDB usando esquemas y modelos.
/\*
zod: 4.0.15
es una libreria de validacion y tipado en javascript/typescript. sirve para validar datos de entrada (formulario, request a tu API, configs, etc.) de forma declarativa y segura.

Dependencias de desarrollo:

<!-- * npm install -D cross-env@10.0.0 -->

cross-env: 10.0.0
es una herramienta para definir variables de entorno de manera compatible entre sistemas operativos (windows, mac, linux)

3.- crear archivo .prettierrc

<!-- TODO MONGO -->
<!-- * USERNAME: ecomercemongo_db_user-->
<!-- * PASSWORD: GPTGxMKmFcqdOy5D  -->

npm install mongoose@8.17.1

mongodb+srv://ecomercemongo_db_user:GPTGxMKmFcqdOy5D@ecomercecluster.msxzvkc.mongodb.net/?appName=ecomerceCluster

JWT_SECRET=ecomercejson123
