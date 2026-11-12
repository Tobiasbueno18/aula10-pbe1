CREATE DATABASE IF NOT EXISTS gestao_residuos
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE gestao_residuos;

CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS ocorrencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    local VARCHAR(180) NOT NULL,
    tipoResiduo VARCHAR(100) NOT NULL,
    nivelRisco ENUM('Baixo', 'Medio', 'Alto') NOT NULL,
    data DATE NOT NULL DEFAULT (CURRENT_DATE),
    status ENUM('Novo', 'Tratado', 'Pendente') NOT NULL DEFAULT 'Novo',
    usuarioId INT NOT NULL,
    CONSTRAINT fk_ocorrencia_usuario
      FOREIGN KEY (usuarioId) REFERENCES usuario(id)
      ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Senha de demonstração: senha123
-- O projeto usa a função PASSWORD() do MariaDB, compatível com o XAMPP/MariaDB 10.4.
INSERT IGNORE INTO usuario (id, nome, email, senha) VALUES
(1, 'Administrador', 'admin@residuos.com', PASSWORD('senha123')),
(2, 'Agente Ambiental', 'agente@residuos.com', PASSWORD('senha123'));

INSERT IGNORE INTO ocorrencia (id, local, tipoResiduo, nivelRisco, data, status, usuarioId) VALUES
(1, 'Rua das Flores, 120', 'Eletrônico', 'Alto', CURRENT_DATE, 'Novo', 1),
(2, 'Avenida Brasil, 450', 'Entulho', 'Medio', CURRENT_DATE, 'Pendente', 2),
(3, 'Rua do Comércio, 80', 'Móvel usado', 'Baixo', CURRENT_DATE, 'Tratado', 1),
(4, 'Estrada Municipal', 'Veículo usado', 'Alto', CURRENT_DATE, 'Novo', 2),
(5, 'Rua do Hospital, 25', 'Hospitalar', 'Alto', CURRENT_DATE, 'Pendente', 1);
