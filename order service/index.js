const express = require('express');
const NRP = require('node-redis-pubsub');

const bodyParser = require('body-parser');
const { json } = require('body-parser');
const PORT = 4444;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const nrp = new NRP({
    PORT: 6379,
    scope: "microservice"
})

const food = {
    "hamburguer": 35,
    "frango": 25,
    "ovo": 5,
    "arroz": 19
};

app.post('/order', (req, res) => {
    const { order } = req.body;
    console.log(order);
    //nome - String
    //quantidade - integer
    if (!order.nome || !order.quantidade) {
        return res.status(404).json({
            mensagem: "Orderm sem nome ou quantidade"
        })
    }
    let ordemRecebida = {
        nome: order.nome,
        quantidade: order.quantidade,
        precoTotal: order.quantidade * food[order.nome]
    }

    nrp.emit("NEW_ORDER", ordemRecebida);

    nrp.on("ORDER_SCS", message => {
        ordemRecebida.carteiraAtualizada = message.carteiraAtualizada;
        return res.json({ message: message.message, ordemRecebida });
    })

    nrp.on("ORDER_ERR", err => {
        return res.json(err);
    })
})





app.listen(PORT, () => {
    console.log(`server at ${PORT}`)
})