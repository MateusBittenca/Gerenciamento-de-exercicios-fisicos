-- UniFit: prescrição, sessão de treino, favoritos e perfil
-- Rodar uma vez no banco `unifit`.

ALTER TABLE lista
  ADD COLUMN objetivo VARCHAR(45) DEFAULT 'hipertrofia',
  ADD COLUMN dias_semana VARCHAR(32) DEFAULT NULL,
  ADD COLUMN lista_origem_id INT DEFAULT NULL;

ALTER TABLE lista_exercicios
  ADD COLUMN id INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST,
  ADD COLUMN ordem INT DEFAULT 1,
  ADD COLUMN series INT DEFAULT 3,
  ADD COLUMN reps VARCHAR(20) DEFAULT '10',
  ADD COLUMN carga_kg DECIMAL(6,2) DEFAULT NULL,
  ADD COLUMN descanso_seg INT DEFAULT 60,
  ADD COLUMN observacao TEXT DEFAULT NULL,
  ADD UNIQUE KEY uq_lista_exercicio (lista_idlista, exercicios_idexercicio);

ALTER TABLE usuarios
  ADD COLUMN Telefone VARCHAR(20) DEFAULT NULL,
  ADD COLUMN DataNascimento DATE DEFAULT NULL,
  ADD COLUMN Foto VARCHAR(255) DEFAULT NULL,
  ADD COLUMN Objetivo VARCHAR(50) DEFAULT NULL,
  ADD COLUMN MetaSemanal INT DEFAULT 4,
  ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP;

UPDATE usuarios SET createdAt = NOW() WHERE createdAt IS NULL;

CREATE TABLE IF NOT EXISTS usuario_afericoes (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  peso DECIMAL(5,2) DEFAULT NULL,
  altura DECIMAL(5,2) DEFAULT NULL,
  imc DECIMAL(5,2) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_afericao_usuario (usuario_id),
  CONSTRAINT fk_afericao_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (UsuarioID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS exercicios_favoritos (
  usuario_id INT NOT NULL,
  exercicio_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id, exercicio_id),
  KEY idx_fav_exercicio (exercicio_id),
  CONSTRAINT fk_fav_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (UsuarioID),
  CONSTRAINT fk_fav_exercicio FOREIGN KEY (exercicio_id) REFERENCES exercicios (idexercicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS treino_sessao (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  lista_id INT NOT NULL,
  status ENUM('em_andamento','concluida','cancelada') NOT NULL DEFAULT 'em_andamento',
  iniciada_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  encerrada_em DATETIME DEFAULT NULL,
  duracao_seg INT DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_sessao_usuario (usuario_id),
  KEY idx_sessao_lista (lista_id),
  CONSTRAINT fk_sessao_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (UsuarioID),
  CONSTRAINT fk_sessao_lista FOREIGN KEY (lista_id) REFERENCES lista (idlista)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS treino_serie (
  id INT NOT NULL AUTO_INCREMENT,
  sessao_id INT NOT NULL,
  lista_exercicio_id INT DEFAULT NULL,
  exercicio_id INT NOT NULL,
  numero_serie INT NOT NULL,
  carga_kg DECIMAL(6,2) DEFAULT NULL,
  reps_feitas INT DEFAULT NULL,
  concluida TINYINT(1) DEFAULT 0,
  concluida_em DATETIME DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_serie_sessao (sessao_id),
  KEY idx_serie_exercicio (exercicio_id),
  CONSTRAINT fk_serie_sessao FOREIGN KEY (sessao_id) REFERENCES treino_sessao (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
