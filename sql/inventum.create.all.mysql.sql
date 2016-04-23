CREATE TABLE t_inventory
(
  inventory_key   INTEGER NOT NULL AUTO_INCREMENT
, inventory_name  VARCHAR(128)         NOT NULL
, description         TEXT  NOT NULL
, staff_number        VARCHAR(16) NOT NULL
, person_first_name    VARCHAR(128) NOT NULL
, person_last_name    VARCHAR(128)
, miscellaneous       TEXT
, status  VARCHAR(16)  NOT NULL default 'active'
, created_at       DATETIME          NOT NULL
, last_modified       DATETIME       NOT NULL
, operator_modified   INTEGER
, PRIMARY KEY ( inventory_key )
-- , FOREIGN KEY (operator_modified) 
-- ,       REFERENCES t_identity(identity_key)
-- ,       ON DELETE CASCADE
);

CREATE INDEX i_t_inventory_name
ON t_inventory
(inventory_name)
;

CREATE INDEX i_t_inventory_person_last_name
ON t_inventory
(person_last_name)
;

delimiter //
CREATE TRIGGER tr_u_t_inventory_lm
BEFORE UPDATE ON t_inventory FOR EACH ROW
BEGIN
  set new.last_modified  = current_timestamp ;
END;//

delimiter //
CREATE TRIGGER tr_u_t_inventory_lm2
BEFORE INSERT ON t_inventory FOR EACH ROW
BEGIN
  set new.last_modified  = current_timestamp ;
  set new.created_at = current_timestamp ;
END;//
