const express = require('express')
const router = express.Router();
const mysql = require('../mysql').pool

// RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM produtos',
            (error, result, fields) => {
                conn.release()

                if(error) { return res.status(500).send({ error: error})}
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.idprodutos,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os produtos',
                                url: 'http://localhost:3333/produtos/' + prod.idprodutos
                            }
                        }
                    })
                };
                return res.status(200).send({ response })
            }
        )
    })
});

// INSERI UM PRODUTO
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error})}
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?, ?)',
            [req.body.nome, req.body.preco],
            (error, result, fields) => {
                conn.release();

                if(error) { return res.status(500).send({ error: error})}
                const response = {
                    mensagem: "Produto inserido com sucesso",
                    produtoInserido: {
                        id_produto: result.insertId,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere novos produtos',
                            url: 'http://localhost:3333/produtos/' + result.insertId
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    })
});

//RETORNA OS DADOS DE UM PRODUTRO
router.get('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM produtos WHERE idprodutos = ?;',
            [req.params.id_produto],
            (error, result, fields) => {
                conn.release()

                if(error) { return res.status(500).send({ error: error})}
                if(result.length == 0) {
                    return res.status(404).send({
                        mensagem: "Não foi encontrado produto com este ID"
                    })
                }

                
                const response = {
                    mensagem: "Produto encontrado",
                    produto: {
                        id_produto: result[0].idprodutos,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3333/produtos/'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    })
    });

// ALTERA UM PRODUTO
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error })}
        conn.query(
            `UPDATE produtos
            SET nome = ?,
                preco = ?
            WHERE idprodutos = ?`,
            [
                req.body.nome,
                req.body.preco,
                req.body.id_produto
            ],
            (error, result, fields) => {
                conn.release();

                if(error) {return res.status(500).send({ error: error })}
                const response = {
                    mensagem: "Produto atualizado com sucesso",
                    produtoInserido: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna os dados de um produto',
                            url: 'http://localhost:3333/produtos/' + req.body.id_produto
                        }
                    }
                }
                return res.status(202).send(response);
            },
            
        )
    });
});

// EXCLUI UM PRODUTO
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error })}
        conn.query( 
            `DELETE FROM produtos
            WHERE idprodutos = ?;`,
            [req.body.id_produto],
            (error, result, fields) => {
                conn.release();
                if(error) {return res.status(500).send({ error: error })}
                res.status(202).send({
                    mensagem: "Produto deletado com sucesso"
                });
            }
            )
    })
})

module.exports = router