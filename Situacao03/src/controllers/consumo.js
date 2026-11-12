const db = require('../db');

exports.listar = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM consumo');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM consumo WHERE id = ?', [id]);
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
        const [result] = await db.query('INSERT INTO consumo (usuarioId, local, equipamento, consumoKwh, 2), mesReferencia, status, 'Normal', 'Elevado')) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [req.body.usuarioId, req.body.local, req.body.equipamento, req.body.consumoKwh, req.body.2), req.body.mesReferencia, req.body.status, req.body.'Normal', req.body.'Elevado')]);
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('UPDATE consumo SET usuarioId = ?, local = ?, equipamento = ?, consumoKwh = ?, 2) = ?, mesReferencia = ?, status = ?, 'Normal' = ?, 'Elevado') = ? WHERE id = ?', [req.body.usuarioId, req.body.local, req.body.equipamento, req.body.consumoKwh, req.body.2), req.body.mesReferencia, req.body.status, req.body.'Normal', req.body.'Elevado'), id]);
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
        const [result] = await db.query('DELETE FROM consumo WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Registro não encontrado para deletar' });
        }
        res.json({ mensagem: 'Deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};