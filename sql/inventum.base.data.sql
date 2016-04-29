INSERT INTO t_inventory (inventory_name, description, identity_key, miscellaneous, operator_modified)
VALUES ( '1 Microsoft Office', 'AAA xhaFUhXS /view?usp=sharing 32 bit'
	, ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='dk' )
	, 'owner: dk'
	, ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='gess' )
	 ) ;
INSERT INTO t_inventory (inventory_name, description, identity_key, miscellaneous, operator_modified)
VALUES ( '2 Microsoft Office', 'BBB xhaFUhXS /view?usp=sharing 33 bit'
	, ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='dk' )
, 'owner: dk'
	, ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='gess' )
 ) ;
INSERT INTO t_inventory (inventory_name, description, identity_key, miscellaneous, operator_modified)
VALUES ( '3 Microsoft Office', 'CCC xhaFUhXS /view?usp=sharing 34 bit'
	, ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='bu' )
, 'owner: bu'
	, ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='gess' )
 ) ;
INSERT INTO t_inventory (inventory_name, description, identity_key, miscellaneous, operator_modified)
VALUES ( '4 Microsoft Office', 'DDDxhaFUhXS /view?usp=sharing 35 bit'
	, ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='gess' )
, 'owner: gess'
	, ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='gess' )
 ) ;

