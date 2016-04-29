CREATE TABLE t_inventory
(
  inventory_key   INTEGER NOT NULL AUTO_INCREMENT
, inventory_name  VARCHAR(128)         NOT NULL
, description         TEXT  NOT NULL
, miscellaneous       TEXT
, status  VARCHAR(16)  NOT NULL default 'active'
, created_at       DATETIME          NOT NULL
, last_modified       DATETIME       NOT NULL
, identity_key	INTEGER
, operator_modified   INTEGER
, PRIMARY KEY ( inventory_key )
, FOREIGN KEY (identity_key) 
       REFERENCES t_identity(identity_key)
       ON DELETE CASCADE
, FOREIGN KEY (operator_modified) 
       REFERENCES t_identity(identity_key)
       ON DELETE CASCADE
);

CREATE INDEX i_t_inventory_identity_key
ON t_inventory
(identity_key)
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

CREATE VIEW v_inventory
AS 
SELECT
  A.inventory_key
, A.inventory_name
, A.description
, B.external_id "staff_number"
, B.first_name "person_first_name"
, B.last_name "person_last_name"
, A.miscellaneous
, A.status
, A.created_at
, A.last_modified
, A.identity_key
, A.operator_modified
FROM t_inventory A, t_identity B
WHERE A.identity_key = B.identity_key 
;

