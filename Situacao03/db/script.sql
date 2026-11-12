drop database if exists gestao_residuos;
create database gestao_residuos;
use gestao_residuos;
-- DDL Criação das tabelas
create table usuario (
    id int not null auto_increment primary key,
    nome varchar(100) not null,
    email varchar(100) not null unique,
    senha varchar(100) not null
);
create table consumo (
    id int not null auto_increment primary key,
    usuarioId int not null,
    local varchar(100) not null,
    equipamento varchar(50) not null,
    consumoKwh decimal(10,2) not null,
    mesReferencia varchar(15) not null,
    status enum('Baixo','Normal','Elevado') default('Baixo') not null
);
alter table consumo add constraint fk_registra
foreign key (usuarioId) references usuario(id);

-- DML para inserir dados de exemplo nas tabelas
insert into usuario (nome, email, senha) values
('Jacinto Penna', 'jacinto@email.com', password('senha123')),
('Fujiro Nakombi', 'fujiro@email.com', password('senha123')),
('Lindo Omar', 'lindo@email.com', password('senha123'));

insert into consumo(usuarioId, local, equipamento, consumoKwh, mesReferencia, status) values
(1,'Sala de aula do 1 ano B','Ar condicionado', 185.4,'2026-09','Elevado'),
(1,'Sala de aula do 1 ano B','Projetor multimidia', 85.4,'2026-09','Normal'),
(2,'Sala de aula do 1 ano B','Computador do professor', 45.1,'2026-09','Baixo'),
(2,'Sala de aula do 1 ano A','Ar condicionado', 190.1,'2026-09','Elevado'),
(3,'Sala de aula do 1 ano A','Projetor multimidia', 86.1,'2026-09','Normal');

select * from usuario;
select * from consumo;
show tables;