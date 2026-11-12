const express = require("express");
const router = express.Router();

const usuario = require("./controllers/usuario");
const ocorrencia = require("./controllers/ocorrencia");

router.post("/usuarios", usuario.criar);
router.get("/usuarios", usuario.listar);
router.get("/usuarios/:id", usuario.buscarPorId);
router.put("/usuarios/:id", usuario.atualizar);
router.delete("/usuarios/:id", usuario.excluir);

router.post("/login", usuario.login);

router.post("/ocorrencias", ocorrencia.criar);
router.get("/ocorrencias", ocorrencia.listar);
router.get("/ocorrencias/:id", ocorrencia.buscarPorId);
router.put("/ocorrencias/:id", ocorrencia.atualizar);
router.delete("/ocorrencias/:id", ocorrencia.excluir);

router.get("/resumo", ocorrencia.resumo);

module.exports = router;
