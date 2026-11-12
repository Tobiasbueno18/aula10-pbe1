const db = require("../db");

async function listar(req, res) {
    try {
        const [usuarios] = await db.query(
            "SELECT id, nome, email FROM usuario ORDER BY id"
        );
        res.json(usuarios);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao listar usuários.", erro: erro.message });
    }
}

async function buscarPorId(req, res) {
    try {
        const [usuarios] = await db.query(
            "SELECT id, nome, email FROM usuario WHERE id = ?",
            [req.params.id]
        );
        if (usuarios.length === 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }
        res.json(usuarios[0]);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar usuário.", erro: erro.message });
    }
}

async function criar(req, res) {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Informe nome, email e senha." });
    }

    try {
        const [resultado] = await db.query(
            "INSERT INTO usuario (nome, email, senha) VALUES (?, ?, PASSWORD(?))",
            [nome, email, senha]
        );
        res.status(201).json({ mensagem: "Usuário cadastrado com sucesso.", id: resultado.insertId });
    } catch (erro) {
        const status = erro.code === "ER_DUP_ENTRY" ? 409 : 500;
        res.status(status).json({ mensagem: "Não foi possível cadastrar o usuário.", erro: erro.message });
    }
}

async function atualizar(req, res) {
    const { nome, email, senha } = req.body;
    if (!nome || !email) {
        return res.status(400).json({ mensagem: "Informe nome e email." });
    }

    try {
        let sql = "UPDATE usuario SET nome = ?, email = ?";
        const valores = [nome, email];
        if (senha) {
            sql += ", senha = PASSWORD(?)";
            valores.push(senha);
        }
        sql += " WHERE id = ?";
        valores.push(req.params.id);

        const [resultado] = await db.query(sql, valores);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }
        res.json({ mensagem: "Usuário atualizado com sucesso." });
    } catch (erro) {
        const status = erro.code === "ER_DUP_ENTRY" ? 409 : 500;
        res.status(status).json({ mensagem: "Não foi possível atualizar o usuário.", erro: erro.message });
    }
}

async function excluir(req, res) {
    try {
        const [resultado] = await db.query(
            "DELETE FROM usuario WHERE id = ?",
            [req.params.id]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }
        res.json({ mensagem: "Usuário excluído com sucesso." });
    } catch (erro) {
        const status = erro.code === "ER_ROW_IS_REFERENCED_2" ? 409 : 500;
        res.status(status).json({
            mensagem: status === 409
                ? "Este usuário possui ocorrências vinculadas e não pode ser excluído."
                : "Erro ao excluir usuário.",
            erro: erro.message
        });
    }
}

async function login(req, res) {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Informe email e senha." });
    }

    try {
        const [usuarios] = await db.query(
            "SELECT id, nome, email FROM usuario WHERE email = ? AND senha = PASSWORD(?)",
            [email, senha]
        );
        if (usuarios.length === 0) {
            return res.status(401).json({ mensagem: "Email ou senha inválidos." });
        }
        res.json({ mensagem: "Login realizado com sucesso.", usuario: usuarios[0] });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao realizar login.", erro: erro.message });
    }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir, login };
