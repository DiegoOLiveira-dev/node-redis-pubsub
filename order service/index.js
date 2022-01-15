const express = require('express');
const NRP = require('node-redis-pubsub');
const bodyParser = require('body-parser');
const PORT = 4444;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const nrp = new NRP({
    PORT: 6379,
    scope: "microservice"
})

const food = {
    "burguer": 35,
    "chicken": 25,
    "ovo": 5,
    "arroz": 19
}

app.post('/order', (req, res) => {
    const { order } = req.body;
    //nome - String
    //quantidade - integer
    if (!order.nome || order.quantidade) {
        return res.status(404).json({
            mensagem: "Orderm sem nome ou quantidade"
        })
    }
})





app.listen(PORT, () => {
    console.log(`server at ${PORT}`)
})