

const express = require('express')
const router = express.Router();
const mysql = require('../mysql').pool

// Retorna os Pedidos
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error})}
        conn.query(
             `SELECT pedido.idpedido,
                     pedido.quantidade,
                     produtos.idprodutos,
                     produtos.nome,
                     produtos.preco
                FROM pedido
          INNER JOIN produtos
                  ON produtos.idprodutos  = pedido.idprodutos;`,
            (error, result, fields) => {
                conn.release();
                if(error){ return res.status(500).send({error:error})};
                const response = {
                    pedidos: result.map(pedido => {
                        return {
                            id_pedido: pedido.idpedido,
                            quantidade: pedido.quantidade,
                            produto: {
                                id_produto: pedido.idprodutos,
                                nome: pedido.nome,
                                preco: pedido.preco
                            },
                            
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um pedido',
                                url: 'http://localhost:3333/pedidos/' + pedido.idpedido
                            }

                        };
                    })
                }
                res.status(200).send(response)
            }
            )

    })
});

// Cria um pedido
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({error:error})}
        conn.query('SELECT * FROM produtos WHERE idprodutos = ?;',[
            req.body.id_produto
        ], (error, result, fields) => {
            if(error){return res.status(500).send({error:error})}
            if(result.length ===0){return res.status(404).send({
                error: "Não foi encontrado nenhum produto com esse ID"
            })
        }

        conn.query('INSERT INTO pedido(quantidade, idprodutos) VALUES (?, ?);',
        [req.body.quantidade, req.body.id_produto],
        (error, result, fields) => {
            conn.release();
            if(error){return res.status(500).send({error:error})}

            const response = {
                mensagem: "Pedido criado com sucesso.",
                quantidade: result.length,
                pedido: {
                    id_pedido: result.insertId,
                    quantidade: req.body.quantidade,
                    id_produto: req.body.id_produto,
                    request: {
                        tipo: 'POST',
                        descricao: 'Exibe o pedido criado',
                        url: 'http://localhost:3333/pedidos/' + result.insertId
                    }
                }
                
            }
            res.status(201).send(response);
        }
        )
        }
        
        )
       
    }) 
});

// Recebendo dados de um pedido
router.get('/:id_pedido', (req, res, next) => {
   mysql.getConnection((error, conn) =>{
    if(error){return res.status(500).send({error:error})}
    conn.query('SELECT * FROM pedido WHERE idpedido = ?;',
    [req.params.id_pedido],
    (error, result, fields) =>{
        conn.release();
        if(error){ return res.status(500).send({error: error})}
        if(result.length ===0){return res.status(404).send({
            error: "Não foi encontrado nenhum pedido com esse ID"
        })}
        const response = {
            quantidade: result.length,
            pedido: {
                id_pedido: result[0].idpedido,
                quantidade: result[0].quantidade,
                id_produto: result[0].idprodutos,
                request: {
                    tipo: "GET",
                    descricao: "Retorna todos os pedidos",
                    url: "http://localhost:3333/pedido"
                }
            }
        }
        
        res.status(200).send(response)
   }
   )

    }
    );
   });

// Edita um pedido
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error:error})};
        conn.query(`UPDATE pedido
        SET quantidade = ?,
        idprodutos = ? 
        WHERE idpedido = ?`,
        [req.body.quantidade, req.body.id_produto, req.body.id_pedido],
        (error, result, fields) =>{
            if(error){return res.status(500).send({error:error})};
            conn.release;
            const response = {
                mensagem: "Pedido atualizado com sucesso",
                quantidade: result.length,
                pedido: {
                    id_pedido: req.body.id_pedido,
                    quantidade: req.body.quantidade,
                    id_produto: req.body.id_produto,
                    request: {
                        tipo: "GET",
                        descricao: "Retorna o pedido alterado",
                        url: "http://localhost:3333/pedidos/" + req.body.id_pedido
                    }
                }
            };
            res.status(202).send(response); // Final response
        })
    })
});

router.delete('/:id_pedido', (req, res, next) => {
   mysql.getConnection((error, conn)=> {
    if(error) {return res.status(500).send({error:error})}
    conn.query('DELETE FROM pedido WHERE idpedido = ?',
    [req.params.id_pedido],
    (error, result) => {
        if(error){return res.status(500).send({error:error})}
        const response = {
            mensagem: "Pedido deletado com sucesso",
            quantidade: result.length,
            resultado: {
                deleted_id: req.params.id_pedido,
                request: {
                    tipo: "POST",
                    descricao: 'Insere um pedido',
                    url: "http://localhost:3333/pedidos/",
                    body: {
                        id_produto: "Number",
                        quantidade: "Number"
                    }
                }
            }

        }
        res.status(201).send(response);
    })
   })
});

module.exports = router;
