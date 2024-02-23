const express = require('express')
const router = express.Router();

// Retorna os Pedidos
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: "Retorna todos os pedidos"
    });
});

// Cria um pedido
router.post('/', (req, res, next) => {
    const pedido = {
        id_pedido: req.body.id_pedido,
        quantidade: req.body.quantidade
    }
    res.status(201).send({
        mensagem: "O pedido foi criado",
        pedido: pedido

    });
});

// Recebendo dados de um pedido
router.get('/:id_pedido', (req, res, next) => {
    
    const id = req.params.id_pedido

    res.status(200).send({
    mensagem: "Detalhes do pedido",
    id_pedido: id
    });
});

// Edita um pedido
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: "Pedido alterado"
    });
});

router.delete('/', (req, res, next) => {
    res.status(200).send({
        mensagem: "Pedido deletado com sucesso"
    });
});

module.exports = router;