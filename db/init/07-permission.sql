/*Connect to database*/
\connect listof



/*Create standard user role*/
CREATE ROLE standard;
GRANT USAGE ON SCHEMA base TO standard;
GRANT SELECT ON base.sys_user TO standard;
GRANT SELECT ON base.sys_user_group TO standard;
GRANT SELECT ON base.sys_user_group_user TO standard;
GRANT SELECT ON base.sys_data_type TO standard;
GRANT SELECT ON base.sys_list TO standard;
GRANT SELECT ON base.sys_attribute TO standard;



/*Create standard user role*/
CREATE ROLE advanced;
GRANT standard TO advanced;
GRANT UPDATE, INSERT, DELETE ON base.sys_list TO advanced;
GRANT UPDATE, INSERT, DELETE ON base.sys_attribute TO advanced;



/*Create admin user role*/
CREATE ROLE admin;
GRANT advanced TO admin;
GRANT UPDATE, INSERT, DELETE ON base.sys_user TO admin;
GRANT UPDATE, INSERT, DELETE ON base.sys_user_group TO admin;
GRANT UPDATE, INSERT, DELETE ON base.sys_user_group_user TO admin;
GRANT UPDATE, INSERT, DELETE ON base.sys_data_type TO admin;



/*Create row level security for lists*/
ALTER TABLE base.sys_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_group_list_standard on base.sys_list
TO standard USING (pg_has_role('user_group_' || user_group_id, 'MEMBER'));

CREATE POLICY user_group_list_advanced on base.sys_list
TO advanced USING (pg_has_role('user_group_' || user_group_id, 'MEMBER'));



/*Create row level security for attribute*/
ALTER TABLE base.sys_attribute ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_group_attribute_standard on base.sys_attribute
TO standard USING (pg_has_role('user_group_' || user_group_id, 'MEMBER'));

CREATE POLICY user_group_attribute_advanced on base.sys_attribute
TO advanced USING (pg_has_role('user_group_' || user_group_id, 'MEMBER'));