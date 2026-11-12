document.getElementById('btnGerar').addEventListener('click', gerarComando);
document.getElementById('btnCopiar').addEventListener('click', copiarComando);

function gerarComando() {
    const projeto = document.getElementById('projectName').value.trim() || 'backend_projeto';
    const sql = document.getElementById('sqlInput').value.trim();

    if (!sql) {
        alert("Por favor, cole um código SQL primeiro!");
        return;
    }

    // 1. Extrair tabelas e colunas do SQL usando Regex
    const regexTabela = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?(\w+)`?\s*\(([\s\S]*?)\);/gi;
    let match;
    const tabelas = [];

    while ((match = regexTabela.exec(sql)) !== null) {
        const nomeTabela = match[1].toLowerCase();
        const corpoTabela = match[2];
        
        const linhas = corpoTabela.split(',');
        const colunas = [];

        linhas.forEach(linha => {
            const limpa = linha.trim();
            if (limpa && !/^(PRIMARY|FOREIGN|KEY|UNIQUE|CONSTRAINT|INDEX)/i.test(limpa)) {
                const nomeColuna = limpa.split(/\s+/)[0].replace(/`/g, '');
                if (nomeColuna.toLowerCase() !== 'id') {
                    colunas.push(nomeColuna);
                }
            }
        });

        tabelas.push({ nome: nomeTabela, colunas });
    }

    if (tabelas.length === 0) {
        alert("Nenhuma instrução 'CREATE TABLE ... ();' válida foi encontrada.");
        return;
    }

    // 2. Montar o conteúdo de cada arquivo
    const arquivos = {};

    arquivos[`db/script.sql`] = sql;
    arquivos[`docs/der_${projeto.replace('backend_', '')}.sql`] = sql;

    arquivos[`src/db.js`] = `const mysql = require('mysql2/promise');\n\nconst pool = mysql.createPool({\n    host: 'localhost',\n    user: 'root',\n    password: '',\n    database: '${projeto}'\n});\n\nmodule.exports = pool;`;

    tabelas.forEach(t => {
        const cols = t.colunas.join(', ');
        const placeholders = t.colunas.map(() => '?').join(', ');
        const reqBody = t.colunas.map(c => `req.body.${c}`).join(', ');
        const updates = t.colunas.map(c => `${c} = ?`).join(', ');

        arquivos[`src/controllers/${t.nome}.js`] = `const db = require('../db');

exports.listar = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ${t.nome}');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM ${t.nome} WHERE id = ?', [id]);
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
        const [result] = await db.query('INSERT INTO ${t.nome} (${cols}) VALUES (${placeholders})', [${reqBody}]);
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('UPDATE ${t.nome} SET ${updates} WHERE id = ?', [${reqBody}, id]);
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
        const [result] = await db.query('DELETE FROM ${t.nome} WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Registro não encontrado para deletar' });
        }
        res.json({ mensagem: 'Deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};`;
    });

    let importsRoutes = `const express = require('express');\nconst router = express.Router();\n`;
    let defsRoutes = `\n`;

    tabelas.forEach(t => {
        importsRoutes += `const ${t.nome}Controller = require('./controllers/${t.nome}');\n`;
        defsRoutes += `// Rotas de ${t.nome}\n`;
        defsRoutes += `router.get('/${t.nome}', ${t.nome}Controller.listar);\n`;
        defsRoutes += `router.get('/${t.nome}/:id', ${t.nome}Controller.buscarPorId);\n`;
        defsRoutes += `router.post('/${t.nome}', ${t.nome}Controller.criar);\n`;
        defsRoutes += `router.put('/${t.nome}/:id', ${t.nome}Controller.atualizar);\n`;
        defsRoutes += `router.delete('/${t.nome}/:id', ${t.nome}Controller.deletar);\n\n`;
    });

    arquivos[`src/routes.js`] = `${importsRoutes}${defsRoutes}module.exports = router;`;

    arquivos[`server.js`] = `const express = require('express');\nconst cors = require('cors');\nconst routes = require('./src/routes');\n\nconst app = express();\napp.use(cors());\napp.use(express.json());\napp.use(routes);\n\napp.listen(3000, () => {\n    console.log('Servidor rodando na porta 3000');\n});`;

    // 3. Montar script com caminhos absolutos
    let comandoFinal = `$raiz = Join-Path (Get-Location) '${projeto}'; `;
    comandoFinal += `New-Item -ItemType Directory -Force -Path "$raiz/db", "$raiz/docs", "$raiz/src/controllers" | Out-Null; `;
    
    comandoFinal += `Push-Location "$raiz"; `;
    comandoFinal += `if (!(Test-Path "package.json")) { npm init -y *>&1 | Out-Null }; `;
    comandoFinal += `npm install express mysql2 cors *>&1 | Out-Null; `;

    for (const [caminho, conteudo] of Object.entries(arquivos)) {
        const base64 = btoa(unescape(encodeURIComponent(conteudo)));
        comandoFinal += `[System.IO.File]::WriteAllText((Join-Path "$raiz" '${caminho}'), [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${base64}'))); `;
    }

    comandoFinal += `Pop-Location; `;
    comandoFinal += `Write-Host "Estrutura '${projeto}' criada com sucesso!" -ForegroundColor Green;`;

    document.getElementById('cmdOutput').value = comandoFinal;
}

function copiarComando() {
    const output = document.getElementById('cmdOutput');
    if (!output.value) return;
    
    output.select();
    document.execCommand('copy');
    alert("Comando copiado! Cole no terminal do PowerShell do VS Code.");
}