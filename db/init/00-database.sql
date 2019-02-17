/*Connect to database*/
\connect listof



/*Create base schema to store application data*/
CREATE SCHEMA base;



/*Install pgcrypto exstension to hash user passwords*/
CREATE EXTENSION IF NOT EXISTS pgcrypto;



/*Create function to get Id of the current user based on his database user role*/
/*This is used to update the created_by_id and updated_by_id columns*/
CREATE OR REPLACE FUNCTION base.get_current_user_id()
RETURNS INTEGER AS $$
DECLARE
    user_id INTEGER;
BEGIN
    IF CURRENT_USER LIKE 'user_%' THEN
      SELECT SUBSTRING(CURRENT_USER, 6) INTO user_id;
    ELSE
      SELECT 0 INTO user_id;
    END IF;
    RETURN user_id;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.get_current_user_id IS
'Function used to get Id of the current user based on his database user role.';



/*Create function to update updated_date column*/
CREATE OR REPLACE FUNCTION base.update_updated_date()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = now();
    RETURN NEW;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.update_updated_date IS
'Function used to automatically update the updated_date column in tables.';



/*Create function to delete children record*/
CREATE OR REPLACE FUNCTION base.delete_children()
RETURNS TRIGGER AS $$
DECLARE
    children_table TEXT;
    parent_column TEXT;
    parent_value INTEGER;
BEGIN
    children_table = TG_ARGV[0];
    parent_column = TG_ARGV[1];
    parent_value = OLD.id;
    EXECUTE 'DELETE FROM base.' || children_table || ' WHERE ' || parent_column || '=' || parent_value;
    RETURN OLD;
END;
$$ language plpgsql;

COMMENT ON FUNCTION base.delete_children IS
'Function used to automate cascade delete on children tables.';
