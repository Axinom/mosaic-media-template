--! Previous: sha1:b74cde38f51e59d36d33923a186339559759f757
--! Hash: sha1:ed29a209c0cda142f10ecec524ea11c0f209d8bf
--! Message: Make sort_order auto-increment in collection_relations

-- create or replace the trigger to set the sort order to MAX + 1 for that specific collection if no value provided for sort_order
CREATE OR REPLACE FUNCTION app_public.set_sort_order()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sort_order IS NULL THEN
        NEW.sort_order := COALESCE((SELECT MAX(sort_order) FROM app_public.collection_relations WHERE collection_id = NEW.collection_id), 0) + 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_sort_order_trigger ON app_public.collection_relations;

CREATE TRIGGER set_sort_order_trigger
BEFORE INSERT ON app_public.collection_relations
FOR EACH ROW EXECUTE FUNCTION app_public.set_sort_order();
