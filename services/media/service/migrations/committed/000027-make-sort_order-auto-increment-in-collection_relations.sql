--! Previous: sha1:b74cde38f51e59d36d33923a186339559759f757
--! Hash: sha1:e941d1e38e76fad134ba61f00361c4c83ddb6500
--! Message: Make sort_order auto-increment in collection_relations

-- create or replace the trigger to set the sort order to MAX + 1 for that specific collection if no value provided for sort_order
CREATE OR REPLACE FUNCTION app_public.set_sort_order()
RETURNS TRIGGER AS $$
DECLARE
    max_sort_order INTEGER;
BEGIN
    IF NEW.sort_order IS NULL THEN
        SELECT COALESCE(MAX(sort_order), 0)
        INTO max_sort_order
        FROM
        (
          SELECT sort_order FROM app_public.collection_relations
          WHERE collection_id = NEW.collection_id FOR UPDATE
        );
        NEW.sort_order := max_sort_order + 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_sort_order_trigger ON app_public.collection_relations;

CREATE TRIGGER set_sort_order_trigger
BEFORE INSERT ON app_public.collection_relations
FOR EACH ROW EXECUTE FUNCTION app_public.set_sort_order();
