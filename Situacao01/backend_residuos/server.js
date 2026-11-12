require("dotenv").config();

const express = require("express");
const cors = require("cors");
const routes = require("./src/routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(routes);

app.get("/", (req, res) => {
    res.json({ mensagem: "API Gestão de Resíduos funcionando." });
});

app.use((req, res) => {
    res.status(404).json({ mensagem: "Rota não encontrada." });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
