const db = require('../db');

exports.listar = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM usuario');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM usuario WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensagem: 'Registro não encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.criar = async (req, res) => {
    try {
        const [result] = await db.query('INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)', [req.body.nome, req.body.email, req.body.senha]);
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('UPDATE usuario SET nome = ?, email = ?, senha = ? WHERE id = ?', [req.body.nome, req.body.email, req.body.senha, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Registro não encontrado para atualizar' });
        }
        res.json({ mensagem: 'Atualizado com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.deletar = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM usuario WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Registro não encontrado para deletar' });
        }
        res.json({ mensagem: 'Deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};