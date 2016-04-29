-- Identity Types--------------------------------------------------

INSERT INTO t_identity_type ( IDENTITY_TYPE_KEY, IDENTITY_TYPE_NAME ) VALUES ( 1, 'Person' ) ;

INSERT INTO t_identity_type ( IDENTITY_TYPE_KEY, IDENTITY_TYPE_NAME ) VALUES ( 2, 'Group' ) ;

-- Rights ----------------------------------------------------
INSERT INTO t_right ( RIGHT_NAME ) VALUES ( 'CAN_EDIT_INVENTORY' ) ;
INSERT INTO t_right ( RIGHT_NAME ) VALUES ( 'CAN_EDIT_INVENTORY_ALL' ) ;
INSERT INTO t_right ( RIGHT_NAME ) VALUES ( 'CAN_EDIT_INVENTORY_OWN' ) ;

INSERT INTO t_right ( RIGHT_NAME ) VALUES ( 'CAN_VIEW_INVENTORY' ) ;
INSERT INTO t_right ( RIGHT_NAME ) VALUES ( 'CAN_VIEW_INVENTORY_ALL' ) ;
INSERT INTO t_right ( RIGHT_NAME ) VALUES ( 'CAN_VIEW_INVENTORY_OWN' ) ;

-- Group ----------------------------------------------------
INSERT INTO t_identity ( IDENTITY_NAME, IDENTITY_TYPE_KEY, DESCRIPTION, ENABLED, LOGIN_ENABLED )
VALUES ( 'EmployeeGroup', ( select IDENTITY_TYPE_KEY from t_identity_type where IDENTITY_TYPE_NAME='Group' ), 'Employee group', '1', '0' ) ;

INSERT INTO t_identity ( IDENTITY_NAME, IDENTITY_TYPE_KEY, DESCRIPTION, ENABLED, LOGIN_ENABLED )
VALUES ( 'AccountingGroup', ( select IDENTITY_TYPE_KEY from t_identity_type where IDENTITY_TYPE_NAME='Group' ), 'Accounting / Buchhaltung', '1', '0' ) ;

INSERT INTO t_identity ( IDENTITY_NAME, IDENTITY_TYPE_KEY, DESCRIPTION, ENABLED, LOGIN_ENABLED )
VALUES ( 'ManagementGroup', ( select IDENTITY_TYPE_KEY from t_identity_type where IDENTITY_TYPE_NAME='Group' ), 'Management group', '1', '0' ) ;

INSERT INTO t_identity_to_right ( IDENTITY_KEY, RIGHT_KEY )
VALUES ( (select IDENTITY_KEY from t_identity where IDENTITY_NAME='ManagementGroup')
       , (select RIGHT_KEY from t_right where RIGHT_NAME='CAN_VIEW_INVENTORY_ALL') );

INSERT INTO t_identity_to_right ( IDENTITY_KEY, RIGHT_KEY )
VALUES ( (select IDENTITY_KEY from t_identity where IDENTITY_NAME='ManagementGroup')
       , (select RIGHT_KEY from t_right where RIGHT_NAME='CAN_EDIT_INVENTORY_ALL') );

INSERT INTO t_identity_to_right ( IDENTITY_KEY, RIGHT_KEY )
VALUES ( (select IDENTITY_KEY from t_identity where IDENTITY_NAME='AccountingGroup')
       , (select RIGHT_KEY from t_right where RIGHT_NAME='CAN_VIEW_INVENTORY_ALL'));

INSERT INTO t_identity_to_right ( IDENTITY_KEY, RIGHT_KEY )
VALUES ( (select IDENTITY_KEY from t_identity where IDENTITY_NAME='EmployeeGroup')
       , (select RIGHT_KEY from t_right where RIGHT_NAME='CAN_EDIT_INVENTORY_OWN') );

INSERT INTO t_identity_to_right ( IDENTITY_KEY, RIGHT_KEY )
VALUES ( (select IDENTITY_KEY from t_identity where IDENTITY_NAME='EmployeeGroup')
       , (select RIGHT_KEY from t_right where RIGHT_NAME='CAN_VIEW_INVENTORY_ALL') );

-- User --------------------------------------------------------------------------------------------------------------
INSERT INTO t_identity ( IDENTITY_NAME, IDENTITY_TYPE_KEY, DESCRIPTION, ENABLED, LOGIN_ENABLED, PWD, FIRST_NAME, LAST_NAME, EXTERNAL_ID )
VALUES ( 'dk'
	, ( select IDENTITY_TYPE_KEY from t_identity_type where IDENTITY_TYPE_NAME='Person' )
	, 'CEO'
	, '1'
	, '1'
	, '654321'
	, 'Dietmar'
	, 'Kauer'
	, '01001'
) ;

INSERT INTO t_identity_to_identity ( parent_identity_key, IDENTITY_KEY )
VALUES ( ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='ManagementGroup' ), ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='dk' ) ) ;

INSERT INTO t_identity_to_identity ( parent_identity_key, IDENTITY_KEY )
VALUES ( ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='EmployeeGroup' ), ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='dk' ) ) ;

INSERT INTO t_identity ( IDENTITY_NAME, IDENTITY_TYPE_KEY, DESCRIPTION, ENABLED, LOGIN_ENABLED, PWD, FIRST_NAME, LAST_NAME, EXTERNAL_ID )
VALUES ( 'gess'
	, ( select IDENTITY_TYPE_KEY from t_identity_type where IDENTITY_TYPE_NAME='Person' )
	, 'Employee'
	, '1'
	, '1'
	, '654321'
	, 'Hans Jürgen'
	, 'Gessinger'
	, '02055'
) ;

INSERT INTO t_identity_to_identity ( parent_identity_key, IDENTITY_KEY )
VALUES ( ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='EmployeeGroup' ), ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='gess' ) ) ;

INSERT INTO t_identity ( IDENTITY_NAME, IDENTITY_TYPE_KEY, DESCRIPTION, ENABLED, LOGIN_ENABLED, PWD, FIRST_NAME, LAST_NAME, EXTERNAL_ID )
VALUES ( 'bu'
	, ( select IDENTITY_TYPE_KEY from t_identity_type where IDENTITY_TYPE_NAME='Person' )
	, 'Accounting Manager'
	, '1'
	, '1'
	, '654321'
	, 'Buch'
	, 'Halter'
	, '01002'
) ;

INSERT INTO t_identity_to_identity ( parent_identity_key, IDENTITY_KEY )
VALUES ( ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='AccountingGroup' ), ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='bu' ) ) ;

INSERT INTO t_identity_to_identity ( parent_identity_key, IDENTITY_KEY )
VALUES ( ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='EmployeeGroup' ), ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='bu' ) ) ;

