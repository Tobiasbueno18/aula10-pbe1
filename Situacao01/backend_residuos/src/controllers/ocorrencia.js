const db = require("../db");

async function listar(req, res) {
    try {
        const [ocorrencias] = await db.query(`
            SELECT o.id, o.local, o.tipoResiduo, o.nivelRisco, o.data,
                   o.status, o.usuarioId, u.nome AS usuario
            FROM ocorrencia o
            INNER JOIN usuario u ON u.id = o.usuarioId
            ORDER BY o.id
        `);
        res.json(ocorrencias);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao listar ocorrências.", erro: erro.message });
    }
}

async function buscarPorId(req, res) {
    try {
        const [ocorrencias] = await db.query(`
            SELECT o.id, o.local, o.tipoResiduo, o.nivelRisco, o.data,
                   o.status, o.usuarioId, u.nome AS usuario
            FROM ocorrencia o
            INNER JOIN usuario u ON u.id = o.usuarioId
            WHERE o.id = ?
        `, [req.params.id]);

        if (ocorrencias.length === 0) {
            return res.status(404).json({ mensagem: "Ocorrência não encontrada." });
        }
        res.json(ocorrencias[0]);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar ocorrência.", erro: erro.message });
    }
}

async function criar(req, res) {
    const { local, tipoResiduo, nivelRisco, data, status, usuarioId } = req.body;
    if (!local || !tipoResiduo || !nivelRisco || !usuarioId) {
        return res.status(400).json({
            mensagem: "Informe local, tipoResiduo, nivelRisco e usuarioId."
        });
    }
    if (!["Baixo", "Medio", "Alto"].includes(nivelRisco)) {
        return res.status(400).json({ mensagem: "nivelRisco deve ser Baixo, Medio ou Alto." });
    }
    if (status && !["Novo", "Tratado", "Pendente"].includes(status)) {
        return res.status(400).json({ mensagem: "status deve ser Novo, Tratado ou Pendente." });
    }

    try {
        const [resultado] = await db.query(
            `INSERT INTO ocorrencia (local, tipoResiduo, nivelRisco, data, status, usuarioId)
             VALUES (?, ?, ?, COALESCE(?, CURRENT_DATE), COALESCE(?, 'Novo'), ?)`,
            [local, tipoResiduo, nivelRisco, data || null, status || null, usuarioId]
        );
        res.status(201).json({ mensagem: "Ocorrência cadastrada com sucesso.", id: resultado.insertId });
    } catch (erro) {
        const statusCode = erro.code === "ER_NO_REFERENCED_ROW_2" ? 400 : 500;
        res.status(statusCode).json({ mensagem: "Não foi possível cadastrar a ocorrência.", erro: erro.message });
    }
}

async function atualizar(req, res) {
    const { local, tipoResiduo, nivelRisco, data, status, usuarioId } = req.body;
    if (!local || !tipoResiduo || !nivelRisco || !status || !usuarioId) {
        return res.status(400).json({
            mensagem: "Informe local, tipoResiduo, nivelRisco, status e usuarioId."
        });
    }
    if (!["Baixo", "Medio", "Alto"].includes(nivelRisco) ||
        !["Novo", "Tratado", "Pendente"].includes(status)) {
        return res.status(400).json({ mensagem: "Confira os valores de nivelRisco e status." });
    }

    try {
        const [resultado] = await db.query(
            `UPDATE ocorrencia
             SET local = ?, tipoResiduo = ?, nivelRisco = ?, data = ?, status = ?, usuarioId = ?
             WHERE id = ?`,
            [local, tipoResiduo, nivelRisco, data || new Date().toISOString().slice(0, 10),
             status, usuarioId, req.params.id]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Ocorrência não encontrada." });
        }
        res.json({ mensagem: "Ocorrência atualizada com sucesso." });
    } catch (erro) {
        const statusCode = erro.code === "ER_NO_REFERENCED_ROW_2" ? 400 : 500;
        res.status(statusCode).json({ mensagem: "Não foi possível atualizar a ocorrência.", erro: erro.message });
    }
}

async function excluir(req, res) {
    try {
        const [resultado] = await db.query(
            "DELETE FROM ocorrencia WHERE id = ?",
            [req.params.id]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Ocorrência não encontrada." });
        }
        res.json({ mensagem: "Ocorrência excluída com sucesso." });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao excluir ocorrência.", erro: erro.message });
    }
}

async function resumo(req, res) {
    try {
        const [resultado] = await db.query(`
            SELECT COUNT(*) AS totalOcorrencias,
                   SUM(CASE WHEN status = 'Tratado' THEN 1 ELSE 0 END) AS ocorrenciasTratadas,
                   SUM(CASE WHEN status = 'Pendente' THEN 1 ELSE 0 END) AS ocorrenciasPendentes,
                   SUM(CASE WHEN status = 'Novo' THEN 1 ELSE 0 END) AS ocorrenciasNovas
            FROM ocorrencia
        `);
        res.json(resultado[0]);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao gerar resumo.", erro: erro.message });
    }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir, resumo };
