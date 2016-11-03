let crypto = require('crypto');
let secret = crypto.randomBytes(32).toString("base64");

console.log("Pass: " + secret);

let nodeAES = require('node-cryptojs-aes');
let aes = nodeAES.CryptoJS;
let formatter = nodeAES.JsonFormatter;

let message = "你看不到我";

let cipherText = aes.AES.encrypt(message, secret, { format: formatter }).toString();

console.log("CipherText: " + cipherText);

let plainText_EX = aes.AES.decrypt(cipherText, secret, { format: formatter });
let plainText = aes.enc.Utf8.stringify(plainText_EX);

console.log("PlainText: " + plainText_EX);
 