INSERT INTO t_right ( RIGHT_NAME ) VALUES ( 'CAN_EDIT_INVENTORY' ) ; 

INSERT INTO t_right ( RIGHT_NAME ) VALUES ( 'CAN_VIEW_INVENTORY' ) ; 

-- Group ----------------------------------------------------
INSERT INTO t_identity ( IDENTITY_NAME, IDENTITY_TYPE_KEY, DESCRIPTION, ENABLED, LOGIN_ENABLED )
VALUES ( 'EmployeeGroup', ( select IDENTITY_TYPE_KEY from t_identity_type where IDENTITY_TYPE_NAME='Group' ), 'Employee group', '1', '0' ) ;

INSERT INTO t_identity ( IDENTITY_NAME, IDENTITY_TYPE_KEY, DESCRIPTION, ENABLED, LOGIN_ENABLED )
VALUES ( 'DeveloperGroup', ( select IDENTITY_TYPE_KEY from t_identity_type where IDENTITY_TYPE_NAME='Group' ), 'Developer group', '1', '0' ) ;

INSERT INTO t_identity ( IDENTITY_NAME, IDENTITY_TYPE_KEY, DESCRIPTION, ENABLED, LOGIN_ENABLED )
VALUES ( 'ManagementGroup', ( select IDENTITY_TYPE_KEY from t_identity_type where IDENTITY_TYPE_NAME='Group' ), 'Management group', '1', '0' ) ;

INSERT INTO t_identity_to_right ( IDENTITY_KEY, RIGHT_KEY )
VALUES ( (select IDENTITY_KEY from t_identity where IDENTITY_NAME='ManagementGroup')
       , (select RIGHT_KEY from t_right where RIGHT_NAME='CAN_EDIT_INVENTORY')
       );

INSERT INTO t_identity_to_right ( IDENTITY_KEY, RIGHT_KEY )
VALUES ( (select IDENTITY_KEY from t_identity where IDENTITY_NAME='DeveloperGroup')
       , (select RIGHT_KEY from t_right where RIGHT_NAME='CAN_VIEW_INVENTORY')
       );

INSERT INTO t_identity_to_right ( IDENTITY_KEY, RIGHT_KEY )
VALUES ( (select IDENTITY_KEY from t_identity where IDENTITY_NAME='EmployeeGroup')
       , (select RIGHT_KEY from t_right where RIGHT_NAME='CAN_VIEW_INVENTORY')
       );

-- User --------------------------------------------------------------------------------------------------------------
INSERT INTO t_identity ( IDENTITY_NAME, IDENTITY_TYPE_KEY, DESCRIPTION, ENABLED, LOGIN_ENABLED, PWD )
VALUES ( 'dk', ( select IDENTITY_TYPE_KEY from t_identity_type where IDENTITY_TYPE_NAME='Person' ), 'CEO', '1', '1', '654321' ) ;

INSERT INTO t_identity_to_identity ( parent_identity_key, IDENTITY_KEY )
VALUES ( ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='AdminGroup' ), ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='dk' ) ) ;

INSERT INTO t_identity_to_identity ( parent_identity_key, IDENTITY_KEY )
VALUES ( ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='ManagementGroup' ), ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='dk' ) ) ;

INSERT INTO t_identity_to_identity ( parent_identity_key, IDENTITY_KEY )
VALUES ( ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='EmployeeGroup' ), ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='dk' ) ) ;


INSERT INTO t_identity ( IDENTITY_NAME, IDENTITY_TYPE_KEY, DESCRIPTION, ENABLED, LOGIN_ENABLED, PWD )
VALUES ( 'hage', ( select IDENTITY_TYPE_KEY from t_identity_type where IDENTITY_TYPE_NAME='Person' ), 'Employee', '1', '1', '654321' ) ;

INSERT INTO t_identity_to_identity ( parent_identity_key, IDENTITY_KEY )
VALUES ( ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='EmployeeGroup' ), ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='hage' ) ) ;

INSERT INTO t_identity_to_identity ( parent_identity_key, IDENTITY_KEY )
VALUES ( ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='DeveloperGroup' ), ( select IDENTITY_KEY from t_identity where IDENTITY_NAME='hage' ) ) ;

