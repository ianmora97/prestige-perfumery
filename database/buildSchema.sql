-- -----------------------------------------------------
-- create schema flask
-- -----------------------------------------------------

CREATE SCHEMA IF NOT EXISTS `flask` DEFAULT CHARACTER SET latin1;
USE `flask` ;

-- -----------------------------------------------------
-- table usuario
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `flask`.`usuario` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `foto` VARCHAR(100) NULL,
  `nombre` VARCHAR(155) NOT NULL,
  `usuario` VARCHAR(85) NULL DEFAULT NULL,
  `correo` VARCHAR(85) NULL DEFAULT NULL,
  `clave` VARCHAR(85) NULL DEFAULT NULL,
  `rol` INT NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- table cliente
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `flask`.`cliente` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `foto` VARCHAR(100) NULL,
  `nombre` VARCHAR(155) NOT NULL,
  `telefono` INT(11) NOT NULL,
  `correo` VARCHAR(85) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- table cars
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `flask`.`cars` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `marca` VARCHAR(155) NOT NULL,
  `modelo` VARCHAR(100) NOT NULL,
  `anio` VARCHAR(85) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- view vt_client
-- -----------------------------------------------------

CREATE VIEW vt_client
AS 
SELECT 
    id, 
    foto, 
    nombre, 
    telefono, 
    correo,
    date_format(created_at,'%d-%m-%Y-%h-%i') as created_at
FROM
    cliente;

-- -----------------------------------------------------
-- view vt_cars
-- -----------------------------------------------------

CREATE VIEW vt_cars
AS 
SELECT 
    id, 
    marca, 
    modelo, 
    anio, 
    date_format(created_at,'%d-%m-%Y-%h-%i') as created_at
FROM
    cars;


-- -----------------------------------------------------
-- procedure p_update_car
-- -----------------------------------------------------

DELIMITER $$
USE `flask`$$
CREATE ROCEDURE 'p_update_car'(
    in i_id int,
    in i_marca varchar(80),
    in i_modelo varchar(80),
    in i_year varchar(80)
)
begin
	update cars 
    set marca = i_marca,
        modelo = i_modelo,
        anio = i_year 
    where id = i_id;
end$$
DELIMITER ;