/* eslint-disable spaced-comment */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { auth } = require('express-oauth2-jwt-bearer');
const { ManagementClient } = require('auth0');
const QrCodeWithLogo = require("qrcode-with-logos");
const querystring = require('querystring');
const jsdom = require('jsdom');
const fs = require('fs');
const axios = require('axios');
const { data } = require('jquery');
const qs = require('qs');
const authConfig = require('./auth_config.json');

const { JSDOM } = jsdom;

const prisma = new PrismaClient();

const app = express();

const appPort = process.env.APP_PORT || 3000;
const appOrigin =
  process.env.REACT_APP_ORIGIN || authConfig.appOrigin || `http://localhost:${appPort}`;
const apiOrigin = process.env.REACT_APP_API_ORIGIN || `http://localhost:4000`;

if (!authConfig.domain || !authConfig.audience || authConfig.audience === 'YOUR_API_IDENTIFIER') {
  console.log(
    'Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values'
  );

  process.exit();
}

app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb'}));
app.use(morgan('dev'));
app.use(helmet());
app.use(cors({ origin: [appOrigin, 'http://localhost:3000', 'http://localhost:8000'] }));

const checkJwt = auth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}/`,
  algorithms: ['RS256'],
});

const { token } = authConfig;
const tokenAdmin = authConfig.token;

const management = new ManagementClient({
  domain: authConfig.domain,
  clientId: authConfig.clientId,
  clientSecret: 'hbOWnx_sTnFKbp58-uuFCDA8vG4p7BLwEoX_rrfAl3jBT8K5YIenw911oMgNY3Lq',
});

app.get('/api/pedido/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === '') {
      return res.status(400).json({ error: 'id is required' });
    }

    const pedido = await prisma.pedido.findFirst({
      where: {
        id: {
          equals: id
        }
      },
      include: {
        produtosPedido: {
          include: {
            produto: true,
            romaneio: {
              include: {
                rolo: true
              }
            }
          }
        }
      }
    });

    if(!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    pedido.created_at = pedido.created_at.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    return res.status(200).json(pedido);
  } catch(err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany();

    if(!pedidos) {
      return res.status(404).json({ error: 'Pedidos não encontrados' });
    }

    for(let i = 0; i < pedidos?.length; i++) {
      pedidos[i].created_at = pedidos[i].created_at.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    }

    return res.status(200).json(pedidos);
  } catch(err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.post('/api/pedido', async (req, res) => {
  try {
    const data = req.body;

    if (!data || !data?.nome || data?.nome === '') {
      return res.status(400).json({ error: 'nome is required' });
    }

    let pedido = await prisma.pedido.create({
      data: {
        nome: data.nome,
        cnpjCpf: data?.cnpjCpf,
        inscEst: data?.inscEst,
        tel: data?.tel,
        cep: data?.cep,
        endereco: data?.endereco,
        numero: data?.numero,
        complemento: data?.complemento,
        bairro: data?.bairro,
        cidade: data?.cidade,
        estado: data?.estado,
        condPagamento: data?.condPagamento,
        valorTotal: data?.valorTotal,
      },
    });

    if (!pedido) {
      return res.status(500).json({ error: 'Erro ao cadastrar pedido' });
    }

    if(data?.produtosPedido && data.produtosPedido.length > 0) {
      for(let i = 0; i < data.produtosPedido.length; i++) {
        const produtoPedido = await prisma.produtoPedido.create({
          data: {
            produto: { connect: {id: data.produtosPedido[i].produto.id}},
            cliente: { connect: {id: pedido.id}}
          }
        })
        if(produtoPedido && data.produtosPedido[i]?.romaneio?.length > 0) {
          for(let j = 0; j < data.produtosPedido[i].romaneio.length; j++) {
            const itemRomaneio = await prisma.itemRomaneio.create({
              data: {
                metros: data.produtosPedido[i].romaneio[j]?.metros,
                rolo: {
                  connect: {id: data.produtosPedido[i].romaneio[j]?.rolo?.id}
                },
                produtoPedido: {
                  connect: {id: produtoPedido.id}
                }
              }
            });

            if(itemRomaneio) {
              const rolo = await prisma.produtoEstoque.update({
                where: { id: itemRomaneio.rolo_id},
                data: {
                  ativo: false
                }
              });
            }
          }
        }
      }
    }

    pedido = await prisma.pedido.findFirst({
      where: { id: { equals: pedido.id }},
      include: {
        produtosPedido: {
          include: {
            produto: true,
            romaneio: {
              include: {
                rolo: true,
              }
            }
          }
        }
      }
    });

    return res.status(201).json(pedido);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.get('/api/romaneio/artigo/:id/rolos', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === '') {
      return res.status(400).json({ error: 'id is required' });
    }

    const rolos = await prisma.produtoEstoque.findMany({
      where: {
        produto_id: { equals: id },
        ativo: { equals: true },
        metros: {
          gt: 0,
        },
      },
    });

    if (!rolos) {
      return res.status(404).json({ error: 'Rolos não encontrados' });
    }

    return res.status(200).json(rolos);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.get('/api/romaneio/artigos', async (req, res) => {
  try {
    const artigos = await prisma.produto.findMany({
      where: {
        estoque: {
          some: {
            ativo: {
              equals: true,
            }
          }
        }
      },
      include: {
        estoque: true
      },
    });

    if(!artigos) {
      return res.status(404).json({ error: 'Artigos não encontrados' });
    }

    if(artigos.length > 0) {
      for(let i = 0; i < artigos.length; i++) {
        const produto = artigos[i];
        if(produto?.estoque && produto.estoque.length > 0) {
          artigos[i].metrosTotal = 0;
          for(let j = 0; j < produto.estoque.length; j++) {
            artigos[i].metrosTotal += artigos[i].estoque[j].metros;
            artigos[i].estoque[j].created_at = artigos[i].estoque[j].created_at.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
          }
        }
      }
    }

    return res.status(200).json(artigos);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.put('/api/item-estoque/:id/baixa', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === '') {
      return res.status(400).json({ error: 'id is required' });
    }

    const itemEstoque = await prisma.produtoEstoque.update({
      where: { id },
      data: {
        ativo: false
      },
    });

    if (!itemEstoque) {
      return res.status(500).json({ error: 'Erro ao dar baixa no item' });
    }

    itemEstoque.created_at = itemEstoque.created_at.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    return res.status(200).json(itemEstoque);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.put('/api/item-estoque/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!id || id === '') {
      return res.status(400).json({ error: 'id is required' });
    }

    if (!data) {
      return res.status(400).json({ error: 'data is required' });
    }

    const itemEstoque = await prisma.produtoEstoque.update({
      where: { id },
      data: {
        numTear: data?.numTear ? data.numTear : null,
        tipoTear: data?.tipoTear ? data.tipoTear : null,
        numRolo: data?.numRolo ? data.numRolo : null,
        metros: data?.metros ? data.metros : null,
        revisor: data?.revisor ? data.revisor : null,
        cliente: data?.cliente ? data.cliente : null,
        status: data?.status ? data.status : "Em revisão",
        defeito: data?.defeito ? data.defeito : false,
      },
      include: {
        qrCode: true,
        produto: true,
      }
    });

    if (!itemEstoque) {
      return res.status(500).json({ error: 'Erro ao atualizar item no estoque' });
    }

    itemEstoque.created_at = itemEstoque.created_at.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    return res.status(200).json(itemEstoque);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.post('/api/item-estoque/:id/qrcode', async (req, res) => {
  try {
    const { id } = req.params;

    const { data } = req.body;

    if (!id || id === '') {
      return res.status(400).json({ error: 'id is required' });
    }

    const itemEstoque = await prisma.produtoEstoque.findFirst({
      where: { id: { equals: id }},
      include: {
        produto: true,
        qrCode: true,
      },
    });

    if (!itemEstoque) {
      return res.status(404).json({ error: 'Item do estoque não encontrado' });
    }

    itemEstoque.created_at = itemEstoque.created_at.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    const qrCode = await prisma.s3QRCodeFile.create({
      data: {
        key: data?.key,
        url: data?.url,
        tipo: data?.tipo,
        bucket: data?.bucket,
        region: data?.region,
        produtoEstoque: { connect: { id: itemEstoque.id}},
      }
    });

    if(!qrCode) return res.status(500).json({ error: 'Erro ao vincular QRCode' });

    itemEstoque.qrCode = qrCode;

    return res.status(201).json(itemEstoque);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.delete('/api/estoque-produto/:idProduto/item/:idItem', async (req, res) => {
  try {
    const { idProduto, idItem } = req.params;

    if (!idProduto || idProduto === '') {
      return res.status(400).json({ error: 'idProduto is required' });
    }

    if (!idItem || idItem === '') {
      return res.status(400).json({ error: 'idItem is required' });
    }

    const produto = await prisma.produto.findFirst({
      where: { id: { equals: idProduto}},
    });

    if(!produto) return res.status(404).json({ error: 'Produto não encontrado' });

    const itemEstoque = await prisma.produtoEstoque.findFirst({
      where: { id: { equals: idItem }}
    });

    if (!itemEstoque) {
      return res.status(404).json({ error: 'Item do estoque não encontrado' });
    }

    await prisma.produtoEstoque.delete({
      where: {
        id: idItem
      }
    });

    return res.status(200).json({});

  } catch(err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.get('/api/estoque-produto/:idProduto/item/:idItem', async (req, res) => {
  try {
    const { idProduto, idItem } = req.params;

    if (!idProduto || idProduto === '') {
      return res.status(400).json({ error: 'idProduto is required' });
    }

    if (!idItem || idItem === '') {
      return res.status(400).json({ error: 'idItem is required' });
    }

    const produto = await prisma.produto.findFirst({
      where: { id: { equals: idProduto}},
    });

    if(!produto) return res.status(404).json({ error: 'Produto não encontrado' });

    const itemEstoque = await prisma.produtoEstoque.findFirst({
      where: { id: { equals: idItem }},
      include: {
        qrCode: true,
        produto: true,
      }
    });

    if (!itemEstoque) {
      return res.status(404).json({ error: 'Item do estoque não encontrado' });
    }

    itemEstoque.produto.largura = itemEstoque.produto?.largura ? parseFloat(itemEstoque.produto.largura).toFixed(2) : '';

    itemEstoque.created_at = itemEstoque.created_at.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    return res.status(200).json(itemEstoque);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.post('/api/estoque-produto/:id/item', async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    if (!id || id === '') {
      return res.status(400).json({ error: 'id is required' });
    }

    if (!data) {
      return res.status(400).json({ error: 'data is required' });
    }

    const produto = await prisma.produto.findFirst({
      where: { id: { equals: id }},
    });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const itemEstoque = await prisma.produtoEstoque.create({
      data: {
        numTear: data?.numTear ? data.numTear : null,
        tipoTear: data?.tipoTear ? data.tipoTear : null,
        numRolo: data?.numRolo ? data.numRolo : null,
        metros: data?.metros ? data.metros : null,
        revisor: data?.revisor ? data.revisor : null,
        cliente: data?.cliente ? data.cliente : null,
        status: data?.status ? data.status : "Em revisão",
        defeito: data?.defeito ? data.defeito : false,
        data: data?.data ? data.data : new Date(),
        produto: {
          connect: {
            id
          },
        },
      },
      include: {
        qrCode: true,
      }
    });

    if (!itemEstoque) {
      return res.status(500).json({ error: 'Erro ao cadastrar item no estoque' });
    }

    itemEstoque.created_at = itemEstoque.created_at.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    //const qrCode = await generateQRCode(`${apiOrigin}/estoque/${id}/item/${itemEstoque?.id}`);

    return res.status(201).json(itemEstoque);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.get('/api/estoque-produto/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if(!id || id === '') {
      return res.status(400).json({ error: 'id is required' });
    }

    const produto = await prisma.produto.findFirst({
      where: { id: { equals: id }},
      include: {
        estoque: {
          where: {
            ativo: { equals: true },
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    if(!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    produto.largura = produto?.largura ? parseFloat(produto.largura).toFixed(2) : '';

    produto.metrosTotal = 0;

    if(produto?.estoque && produto.estoque.length > 0) {
      for(let i = 0; i < produto.estoque.length; i++) {
        produto.metrosTotal += produto.estoque[i].metros;
        produto.estoque[i].created_at = produto.estoque[i].created_at.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      }
    }

    return res.status(200).json(produto);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.get('/api/estoque', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        estoque: {
          where: {
            ativo: { equals: true },
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    if(produtos && produtos.length > 0) {
      for(let i = 0; i < produtos.length; i++) {
        produtos[i].metrosTotal = 0;
        produtos[i].largura = produtos[i]?.largura ? parseFloat(produtos[i].largura).toFixed(2) : '';
        for(let j = 0; j < produtos[i].estoque.length; j++) {
          produtos[i].metrosTotal += produtos[i].estoque[j].metros;
          produtos[i].estoque[j].created_at = produtos[i].estoque[j].created_at.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        }

        produtos[i].metrosTotal = parseFloat(produtos[i].metrosTotal).toFixed(2);
      }
    }

    return res.status(200).json(produtos);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.get('/api/produto/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === '') {
      return res.status(400).json({ error: 'id is required' });
    }

    const produto = await prisma.produto.findFirst({
      where: { id: { equals: id}}
    });

    if(!produto) return res.status(404).json({ error: 'Produto não encontrado' });

    produto.largura = produto?.largura ? parseFloat(produto.largura).toFixed(2) : '';

    return res.status(200).json(produto);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.put('/api/produto/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = req.body;

    if (!id || id === '') {
      return res.status(400).json({ error: 'id is required' });
    }

    const produto = await prisma.produto.findFirst({
      where: { id: { equals: id}}
    });

    if(!produto) return res.status(404).json({ error: 'Produto não encontrado' });

    if(data?.largura && data.largura !== '') {
      data.largura = parseFloat(data.largura);
    }

    const produtoUpdated = await prisma.produto.update({
      data: {
        artigo: data?.artigo,
        descricao: data?.descricao,
        largura: data?.largura,
        imagem: data?.imagem,
      },
      where: { id },
    });

    if(!produtoUpdated) return res.status(500).json({ error: 'Erro ao atualizar produto' });

    produtoUpdated.largura = produtoUpdated?.largura ? parseFloat(produtoUpdated.largura).toFixed(2) : '';

    return res.status(200).json(produtoUpdated);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.get('/api/produtos', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();

    if(produtos && produtos.length > 0) {
      for(let i = 0; i < produtos.length; i++) {
        produtos[i].largura = produtos[i]?.largura ? parseFloat(produtos[i].largura).toFixed(2) : '';
      }
    }
    return res.status(200).json(produtos);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.post('/api/produto', async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !data?.artigo || data?.artigo === '') return res.status(400).json({ error: 'artigo is required' });

    if(data?.largura && data.largura !== '') {
      data.largura = data.largura.replace(',', '.');
      data.largura = parseFloat(data.largura);
    }

    const produto = await prisma.produto.create({
      data: {
        artigo: data.artigo,
        descricao: data?.descricao,
        largura: data?.largura,
        imagem: data?.imagem,
      },
    });

    if(!produto) return res.status(500).json({ error: 'Erro ao cadastrar produto' });

    return res.status(201).json(produto);

    /*const qrcode = new QrCodeWithLogo({
      //canvas: document.getElementById("canvas"),
      content: "https://fiteca.com.br",
      width: 380,
      //   download: true,
      //image: document.getElementById("image"),
      logo: {
        src: "https://drive.google.com/uc?id=1d-HfnIIZxtN_Kj-MW6ilr729GiY0Q7_b&export=download"
      }
    });

    qrcode.toCanvas().then(() => {
      qrcode.toImage().then(() => {
        qrcode.downloadImage("hello world");
      });
    });*/
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.post('/api/solicitacao/:id/checkout', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === '') {
      return res.status(400).json({ error: 'id is required' });
    }

    const resp = await axios.post(`https://authsandbox.cieloecommerce.cielo.com.br/oauth2/token`, qs.stringify({
      grant_type: 'client_credentials'
    }), {
      headers: { 'Authorization': 'Basic NzJlODBhZTEtNmNmNi00YmFjLWE4YjQtMTlkODM1MzNhMDdhOncwZ3pITVJDL2l4OTNnYnJaRGpDZEN4azlBNHo4YXRvV0ZNcXh6UGV2bU09',
      'content-type': 'application/x-www-form-urlencoded' },
    });

    const { access_token } = resp.data;

    const solicitacao = getPagamentoDetalhes(id);

    return res.json(access_token);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.post('/api/solicitacao', async (req, res) => {
  try {
    const data = req.body;
    const { userauth0id } = req.headers;

    if (!userauth0id || userauth0id === '') {
      return res.status(400).json({ error: 'userauth0id is required' });
    }

    if (!data || !data?.paciente_id || data?.paciente_id === '') {
      return res.status(400).json({ error: 'paciente_id is required' });
    }

    if (!data || !data?.exames || data?.exames?.length === 0) {
      return res.status(400).json({ error: 'exame is required' });
    }

    const dermoterapeuta = await prisma.dermoterapeuta.findFirst({
      where: {user_auth0_id: { equals: userauth0id }}
    });

    if (!dermoterapeuta) {
      return res.status(404).json({ error: 'Dermoterapeuta não encontrado!' });
    }

    const solicitacao = await prisma.solicitacao.create({
      data: {
        data_solicitacao: new Date(),
        status: 'Solicitado',
        paciente: {
          connect: {
            id: data?.paciente_id,
          },
        },
        exames: {
          createMany: {
            data: data?.exames.map((exame) => ({
              exame_id: exame,
            })),
          },
        },
        dermoterapeuta: {
          connect: {
            id: dermoterapeuta.id,
          },
        },
      },
      include: {
        paciente: true,
        exames: {
          include: {
            exame: true,
          }
        },
      },
    });

    return res.json(solicitacao);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.get('/api/solicitacao/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === '') {
      return res.status(400).json({ error: 'id is required' });
    }

    const solicitacao = await prisma.solicitacao.findFirst({
      where: { id },
      include: {
        paciente: true,
        dermoterapeuta: true,
        exames: {
          include: {
            exame: true,
          }
        },
      },
    });

    if (!solicitacao) {
      return res.status(404).json({ error: 'Solicitação não encontrada!' });
    }

    return res.json(solicitacao);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.post('/api/solicitacao/:id/pagamento', async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    if (!id || id === '') {
      return res.status(400).json({ error: 'id is required' });
    }

    if (!data || !data?.numero_cartao || data?.numero_cartao === '') {
      return res.status(400).json({ error: 'numero_cartao is required' });
    }

    if (!data || !data?.exp || data?.exp === '') {
      return res.status(400).json({ error: 'exp is required' });
    }

    if (!data || !data?.cvc || data?.cvc === '') {
      return res.status(400).json({ error: 'cvc is required' });
    }

    const solicitacao = await prisma.solicitacao.findFirst({
      where: { id },
      include: {
        paciente: true,
        dermoterapeuta: true,
        exames: {
          include: {
            exame: true,
          }
        },
      },
    });

    if (!solicitacao) {
      return res.status(404).json({ error: 'Solicitação não encontrada!' });
    }

    let total = 0;

    solicitacao.exames.forEach((item) => {
      const valor = parseFloat(item.exame.valor.substring(3, item.exame.valor.length).replace(',', '.'));
      total += valor;
    });

    const resp = await axios.post(`https://authsandbox.cieloecommerce.cielo.com.br/oauth2/token`, qs.stringify({
      grant_type: 'client_credentials'
    }), {
      headers: { 'Authorization': 'Basic NzJlODBhZTEtNmNmNi00YmFjLWE4YjQtMTlkODM1MzNhMDdhOncwZ3pITVJDL2l4OTNnYnJaRGpDZEN4azlBNHo4YXRvV0ZNcXh6UGV2bU09',
      'content-type': 'application/x-www-form-urlencoded' },
    });

    const { access_token } = resp.data;
    
    const pagamento = await prisma.pagamento.create({
      data: {
        forma_pagamento: data?.pagamento,
        solicitacao: {
          connect: {
            id: solicitacao.id,
          },
        },
      },
    });

    return res.json(pagamento);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});
app.get('/api/pacientes', async (req, res) => {
  try {
    const { userauth0id } = req.headers;

    if (!userauth0id || userauth0id === '') {
      return res.status(400).json({ error: 'userauth0id is required' });
    }

    const dermoterapeuta = await prisma.dermoterapeuta.findFirst({
      where: {user_auth0_id: { equals: userauth0id }}
    });

    if (!dermoterapeuta) {
      return res.status(404).json({ error: 'Dermoterapeuta não encontrado!' });
    }
    const pacientes = await prisma.paciente.findMany({
      where: {
        dermoterapeuta_id: {
          equals: dermoterapeuta.id,
        },
      },
    });

    return res.json(pacientes);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.get('/api/exames', async (req, res) => {
  try {
    const exames = await prisma.exame.findMany();

    res.json(exames);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

app.get('/api/exames-pacientes', async (req, res) => {
  try {
    const { userauth0id } = req.headers;

    if (!userauth0id || userauth0id === '') {
      return res.status(400).json({ error: 'userauth0id is required' });
    }

    const dermoterapeuta = await prisma.dermoterapeuta.findFirst({
      where: {user_auth0_id: { equals: userauth0id }}
    });

    if (!dermoterapeuta) {
      return res.status(404).json({ error: 'Dermoterapeuta não encontrado!' });
    }

    const pacientes = await prisma.paciente.findMany({
      where: {
        dermoterapeuta_id: {
          equals: dermoterapeuta.id,
        },
      },
    });

    const exames = await prisma.exame.findMany({
      where: {
        ativo: true,
      },
    });

    return res.json({
      pacientes,
      exames,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.get('/api/exame/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === '') {
      res.status(400).json({ error: 'id is required' });
    }

    const exame = await prisma.exame.findUnique({
      where: { id },
    });

    if (!exame) {
      res.status(404).json({ error: 'Exame não encontrado!' });
    }

    res.json(exame);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

app.get('/api/paciente/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === '') {
      res.status(400).json({ error: 'id is required' });
    }

    const { userauth0id } = req.headers;

    if (!userauth0id || userauth0id === '') {
      res.status(400).json({ error: 'userauth0id is required' });
    }

    const dermoterapeuta = await prisma.dermoterapeuta.findFirst({
      where: {user_auth0_id: { equals: userauth0id }}
    });

    if (!dermoterapeuta) {
      res.status(404).json({ error: 'Dermoterapeuta não encontrado!' });
    }

    const paciente = await prisma.paciente.findUnique({
      where: {
        id,
        AND: {
          dermoterapeuta_id: {
            equals: dermoterapeuta.id,
          },
        },
      },
      include: {
        fichas_anamnese: {
          include: {
            alopeciaAreata: true,
            tipoCabelo: true,
            habitosVidaDiaria: true,
            efluvioTelogeno: true,
            dermatites: true,
            antecedentesSistemicosPat: true,
            alopeciasMetodosAvaliacao: true,
            condicoesAtuaisHistorico: true,
          },
        },
      },
    });

    if (!paciente) {
      res.status(404).json({ error: 'Paciente não encontrado!' });
    }

    res.json(paciente);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

app.put('/api/paciente/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, ficha } = req.body;

    if (!id || id === '') {
      res.status(400).json({ error: 'id is required' });
    }

    if (!data || !data?.nome || data?.nome === '') {
      res.status(400).json({ error: 'nome is required' });
    }

    const paciente = await prisma.paciente.update({
      where: {
        id,
      },
      data,
      include: {
        fichas_anamnese: true,
      },
    });

    if (!paciente) {
      res.status(404).json({ error: 'Paciente não encontrado!' });
    }

    const fichaAnamnese = await prisma.fichaAnamnese.update({
      where: {
        id: paciente.fichas_anamnese[0].id,
      },
      data: {
        antecedentesSistemicosPat: {
          update: {
            antecedenteOncologico: ficha?.antecedentesSistemicosPat?.antecedenteOncologico,
            antecedenteOncologicoDesc: ficha?.antecedentesSistemicosPat?.antecedenteOncologicoDesc,
            cirurgiaPlastica: ficha?.antecedentesSistemicosPat?.cirurgiaPlastica,
            cirurgiaPlasticaDesc: ficha?.antecedentesSistemicosPat?.cirurgiaPlasticaDesc,
            cirurgias: ficha?.antecedentesSistemicosPat?.cirurgias,
            cirurgiasDesc: ficha?.antecedentesSistemicosPat?.cirurgiasDesc,
            observacoes: ficha?.antecedentesSistemicosPat?.observacoes,
            outros: ficha?.antecedentesSistemicosPat?.outros,
            outrosDesc: ficha?.antecedentesSistemicosPat?.outrosDesc,
            proteseMetalica: ficha?.antecedentesSistemicosPat?.proteseMetalica,
            proteseMetalicaDesc: ficha?.antecedentesSistemicosPat?.proteseMetalicaDesc,
            values: ficha?.antecedentesSistemicosPat?.values,
          }
        },
        condicoesAtuaisHistorico: {
          update: {
            historicoAfeccaoAtual: ficha?.condicoesAtuaisHistorico?.historicoAfeccaoAtual,
            antecedentesPessoaisSaude: ficha?.condicoesAtuaisHistorico?.antecedentesPessoaisSaude,
            historicoFamiliarSaude: ficha?.condicoesAtuaisHistorico?.historicoFamiliarSaude,
            queixaPrincipal: ficha?.condicoesAtuaisHistorico?.queixaPrincipal,
          }
        },
        habitosVidaDiaria: {
          update: {
            cicloMenstrual: ficha?.habitosVidaDiaria?.cicloMenstrual,
            dum: ficha?.habitosVidaDiaria?.dum,
            estiloVida: ficha?.habitosVidaDiaria?.estiloVida,
            etilista: ficha?.habitosVidaDiaria?.etilista,
            exposicaoSol: ficha?.habitosVidaDiaria?.exposicaoSol,
            fumante: ficha?.habitosVidaDiaria?.fumante,
            funcionamentoIntestinal: ficha?.habitosVidaDiaria?.funcionamentoIntestinal,
            gestante: ficha?.habitosVidaDiaria?.gestante,
            periodoGestacional: ficha?.habitosVidaDiaria?.periodoGestacional,
            gravidezAnterior: ficha?.habitosVidaDiaria?.gravidezAnterior,
            filhos: ficha?.habitosVidaDiaria?.filhos,
            partos: ficha?.habitosVidaDiaria?.partos,
            trabalho: ficha?.habitosVidaDiaria?.trabalho,
            ingestaoAgua: ficha?.habitosVidaDiaria?.ingestaoAgua,
            medicamentos: ficha?.habitosVidaDiaria?.medicamentos,
            qualidadeSono: ficha?.habitosVidaDiaria?.qualidadeSono,
            usoAnticoncepcional: ficha?.habitosVidaDiaria?.usoAnticoncepcional,
            tipoAnticoncepcional: ficha?.habitosVidaDiaria?.tipoAnticoncepcional,
          }
        },
        data_avaliacao: ficha?.data_avaliacao,
        tipoCabelo: {
          update: {
            curvatura: ficha?.tipoCabelo?.curvatura,
            densidade: ficha?.tipoCabelo?.densidade,
            biotipoCutaneo: ficha?.tipoCabelo?.biotipoCutaneo,
            alopecia: ficha?.tipoCabelo?.alopecia,
            achadosDermatoscopia: ficha?.tipoCabelo?.achadosDermatoscopia,
            couroCabeludo: ficha?.tipoCabelo?.couroCabeludo,
            diagnostico: ficha?.tipoCabelo?.diagnostico,
            diametroFio: ficha?.tipoCabelo?.diametroFio,
            forma: ficha?.tipoCabelo?.forma,
            observacoesGerais: ficha?.tipoCabelo?.observacoesGerais,
            processosQuimicosExistentes: ficha?.tipoCabelo?.processosQuimicosExistentes,
            qualidadeHasteCapilar: ficha?.tipoCabelo?.qualidadeHasteCapilar,
            sinaisClinicos: ficha?.tipoCabelo?.sinaisClinicos,
            sintomas: ficha?.tipoCabelo?.sintomas,
            usoAparelhos: ficha?.tipoCabelo?.usoAparelhos,
            usoCosmeticosFrequencia: ficha?.tipoCabelo?.usoCosmeticosFrequencia,
            usoModeladores: ficha?.tipoCabelo?.usoModeladores,
            usoModeladoresFrequencia: ficha?.tipoCabelo?.usoModeladoresFrequencia,
            usoPranchas: ficha?.tipoCabelo?.usoPranchas,
            usoPranchasFrequencia: ficha?.tipoCabelo?.usoPranchasFrequencia,
            usoSecadores: ficha?.tipoCabelo?.usoSecadores,
            usoSecadoresFrequencia: ficha?.tipoCabelo?.usoSecadoresFrequencia,
          }
        },
      },
      include: {
        alopeciaAreata: true,
        tipoCabelo: true,
        habitosVidaDiaria: true,
        efluvioTelogeno: true,
        dermatites: true,
        antecedentesSistemicosPat: true,
        alopeciasMetodosAvaliacao: true,
        condicoesAtuaisHistorico: true,
      },
    });

    res.json(paciente);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

app.post('/api/paciente', async (req, res) => {
  try{
    const { data, ficha } = req.body;
    const { userauth0id } = req.headers;

    if (!userauth0id || userauth0id === '') {
      res.status(400).json({ error: 'userauth0id is required' });
    }

    const dermoterapeuta = await prisma.dermoterapeuta.findFirst({
      where: {user_auth0_id: { equals: userauth0id }}
    });

    if (!dermoterapeuta) {
      res.status(404).json({ error: 'Dermoterapeuta não encontrado!' });
    }

    if (!data || !data?.nome || data?.nome === '') {
      res.status(400).json({ error: 'nome is required' });
    }

    const paciente = await prisma.paciente.create({
      data: {
        nome: data?.nome,
        cpf: data?.cpf,
        rg: data?.rg,
        telefone: data?.telefone,
        celular: data?.celular,
        email: data?.email,
        endereco: data?.endereco,
        numero: data?.numero,
        complemento: data?.complemento,
        bairro: data?.bairro,
        cidade: data?.cidade,
        estado: data?.estado,
        cep: data?.cep,
        ativo: true,
        profissao: data?.profissao,
        sexo: data?.sexo,
        data_nascimento: data?.data_nascimento,
        user_auth0_id: data?.user_auth0_id,
        dermoterapeuta: {
          connect: {
            id: dermoterapeuta?.id,
          }
        },
        fichas_anamnese: {
          create: {
            antecedentesSistemicosPat: {
              create: {
                antecedenteOncologico: ficha?.antecedentesSistemicosPat?.antecedenteOncologico,
                antecedenteOncologicoDesc: ficha?.antecedentesSistemicosPat?.antecedenteOncologicoDesc,
                cirurgiaPlastica: ficha?.antecedentesSistemicosPat?.cirurgiaPlastica,
                cirurgiaPlasticaDesc: ficha?.antecedentesSistemicosPat?.cirurgiaPlasticaDesc,
                cirurgias: ficha?.antecedentesSistemicosPat?.cirurgias,
                cirurgiasDesc: ficha?.antecedentesSistemicosPat?.cirurgiasDesc,
                observacoes: ficha?.antecedentesSistemicosPat?.observacoes,
                outros: ficha?.antecedentesSistemicosPat?.outros,
                outrosDesc: ficha?.antecedentesSistemicosPat?.outrosDesc,
                proteseMetalica: ficha?.antecedentesSistemicosPat?.proteseMetalica,
                proteseMetalicaDesc: ficha?.antecedentesSistemicosPat?.proteseMetalicaDesc,
                values: ficha?.antecedentesSistemicosPat?.values,
              }
            },
            condicoesAtuaisHistorico: {
              create: {
                historicoAfeccaoAtual: ficha?.condicoesAtuaisHistorico?.historicoAfeccaoAtual,
                antecedentesPessoaisSaude: ficha?.condicoesAtuaisHistorico?.antecedentesPessoaisSaude,
                historicoFamiliarSaude: ficha?.condicoesAtuaisHistorico?.historicoFamiliarSaude,
                queixaPrincipal: ficha?.condicoesAtuaisHistorico?.queixaPrincipal,
              }
            },
            habitosVidaDiaria: {
              create: {
                cicloMenstrual: ficha?.habitosVidaDiaria?.cicloMenstrual,
                dum: ficha?.habitosVidaDiaria?.dum,
                estiloVida: ficha?.habitosVidaDiaria?.estiloVida,
                etilista: ficha?.habitosVidaDiaria?.etilista,
                exposicaoSol: ficha?.habitosVidaDiaria?.exposicaoSol,
                fumante: ficha?.habitosVidaDiaria?.fumante,
                funcionamentoIntestinal: ficha?.habitosVidaDiaria?.funcionamentoIntestinal,
                gestante: ficha?.habitosVidaDiaria?.gestante,
                periodoGestacional: ficha?.habitosVidaDiaria?.periodoGestacional,
                gravidezAnterior: ficha?.habitosVidaDiaria?.gravidezAnterior,
                filhos: ficha?.habitosVidaDiaria?.filhos,
                partos: ficha?.habitosVidaDiaria?.partos,
                trabalho: ficha?.habitosVidaDiaria?.trabalho,
                ingestaoAgua: ficha?.habitosVidaDiaria?.ingestaoAgua,
                medicamentos: ficha?.habitosVidaDiaria?.medicamentos,
                qualidadeSono: ficha?.habitosVidaDiaria?.qualidadeSono,
                usoAnticoncepcional: ficha?.habitosVidaDiaria?.usoAnticoncepcional,
                tipoAnticoncepcional: ficha?.habitosVidaDiaria?.tipoAnticoncepcional,
              }
            },
            data_avaliacao: ficha?.data_avaliacao,
            tipoCabelo: {
              create: {
                curvatura: ficha?.tipoCabelo?.curvatura,
                densidade: ficha?.tipoCabelo?.densidade,
                biotipoCutaneo: ficha?.tipoCabelo?.biotipoCutaneo,
                alopecia: ficha?.tipoCabelo?.alopecia,
                achadosDermatoscopia: ficha?.tipoCabelo?.achadosDermatoscopia,
                couroCabeludo: ficha?.tipoCabelo?.couroCabeludo,
                diagnostico: ficha?.tipoCabelo?.diagnostico,
                diametroFio: ficha?.tipoCabelo?.diametroFio,
                forma: ficha?.tipoCabelo?.forma,
                observacoesGerais: ficha?.tipoCabelo?.observacoesGerais,
                processosQuimicosExistentes: ficha?.tipoCabelo?.processosQuimicosExistentes,
                qualidadeHasteCapilar: ficha?.tipoCabelo?.qualidadeHasteCapilar,
                sinaisClinicos: ficha?.tipoCabelo?.sinaisClinicos,
                sintomas: ficha?.tipoCabelo?.sintomas,
                usoAparelhos: ficha?.tipoCabelo?.usoAparelhos,
                usoCosmeticosFrequencia: ficha?.tipoCabelo?.usoCosmeticosFrequencia,
                usoModeladores: ficha?.tipoCabelo?.usoModeladores,
                usoModeladoresFrequencia: ficha?.tipoCabelo?.usoModeladoresFrequencia,
                usoPranchas: ficha?.tipoCabelo?.usoPranchas,
                usoPranchasFrequencia: ficha?.tipoCabelo?.usoPranchasFrequencia,
                usoSecadores: ficha?.tipoCabelo?.usoSecadores,
                usoSecadoresFrequencia: ficha?.tipoCabelo?.usoSecadoresFrequencia,
              }
            },
          }
        }
      },
    });

    res.status(201).json(paciente);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

app.post('/api/exame', async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !data?.nome || data?.nome === '') {
      res.status(400).json({ error: 'nome is required' });
    }

    if (!data?.tipo || data?.tipo === '') {
      res.status(400).json({ error: 'tipo is required' });
    }

    if (
      data.tipo === 'Conjunto de Exames' &&
      (!data?.conjunto_exames || data?.conjunto_exames.length < 2)
    ) {
      res.status(400).json({ error: 'conjunto_exames is required' });
    }

    let exame = null;
    if (data.tipo === 'Conjunto de Exames') {
      const cjExames = [];
      for (let i = 0; i < data.conjunto_exames.length; i++) {
        const item = data.conjunto_exames[i];
        cjExames.push({
          nome: item.nome,
          descricao: item.descricao,
        });
      }
      exame = await prisma.exame.create({
        data: {
          ...data,
          conjunto_exames: {
            createMany: {
              data: cjExames,
            },
          },
        },
        include: {
          conjunto_exames: true,
        },
      });

      res.json(exame);
    }

    delete data.conjunto_exames;
    exame = await prisma.exame.create({
      data,
    });

    res.json(exame);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

app.delete('/api/exame/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === '') {
      res.status(400).json({ error: 'id is required' });
    }

    await prisma.exame.delete({
      where: {
        id,
      },
    });

    const exames = await prisma.exame.findMany();

    res.json({ message: 'Exame deletado com sucesso!', exames });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

app.delete('/api/exames', async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids?.length === 0) {
      res.status(400).json({ error: 'ids is required' });
    }

    await prisma.exame.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    const exames = await prisma.exame.findMany();

    res.json({ message: 'Exames deletados com sucesso!', exames });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

async function getPagamentoDetalhes(idSolicitacao) {
  try {
    if (!idSolicitacao || idSolicitacao === '') {
      return null;
    }

    const solicitacao = await prisma.solicitacao.findUnique({
      where: {
        id: idSolicitacao,
      },
      include: {
        pagamento: true,
      },
    });

    if (!solicitacao) {
      return null;
    }

    return solicitacao;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function generateQRCode(linkContent) {
  return new Promise((resolve, reject) => {  
  try {
    let qrCodeImg;
      const { document } = new JSDOM('https://fiteca.com.br').window;
      const imgEl = document.createElement('img');
      imgEl.setAttribute('id', 'qrCodeImg');

      const qrcode = new QrCodeWithLogo({
        content: linkContent,
        image: imgEl,
        width: 480,
        logo: {
          src: "https://i.ibb.co/PCxKNmv/fiteca-logo.jpg",
        }
      });
  
      qrcode.getImage().then(image => {
        console.log('image qrCode: ', image);
        qrCodeImg = image;
        resolve(qrCodeImg);
      });

    } catch (err) {
      console.log(err);
      reject(err);
    }
    });
}

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`API Server listening on port ${port} 🚀`));
