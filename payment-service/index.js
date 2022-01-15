const express = require('express');
const NRP = require('node-redis-pubsub');
const bodyParser = require('body-parser');
const PORT = 5555;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const nrp = new NRP({
    PORT: 6379,
    scope: "microservice"
})

let carteira = 100;

nrp.on("NEW_ORDER", data => {
    const { nome, quatidade, precoTotal } = data;
    if (precoTotal <= carteira) {
        carteira -= precoTotal
        nrp.emit("ORDER_SCS", { message: "Ordem realizada", carteiraAtualizada: carteira })
    } else {
        nrp.emit("ORDER_ERR", { erro: "valor insuficiente na carteira" })
    }
})


app.listen(PORT, () => {
    console.log(`server at ${PORT}`)
})