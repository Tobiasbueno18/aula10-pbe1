const express = require('express');
const router = express.Router();
const usuarioController = require('./controllers/usuario');
const consumoController = require('./controllers/consumo');

// Rotas de usuario
router.get('/usuario', usuarioController.listar);
router.get('/usuario/:id', usuarioController.buscarPorId);
router.post('/usuario', usuarioController.criar);
router.put('/usuario/:id', usuarioController.atualizar);
router.delete('/usuario/:id', usuarioController.deletar);

// Rotas de consumo
router.get('/consumo', consumoController.listar);
router.get('/consumo/:id', consumoController.buscarPorId);
router.post('/consumo', consumoController.criar);
router.put('/consumo/:id', consumoController.atualizar);
router.delete('/consumo/:id', consumoController.deletar);

module.exports = router;