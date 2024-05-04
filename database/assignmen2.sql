-- Selecting a single record from the inventory table using the primary key
SELECT * FROM public.inventory WHERE inv_id = 1;

-- Updating a single record in the inventory table using the primary key
UPDATE public.inventory SET inv_price = 30000 WHERE inv_id = 1;

-- Deleting a single record from the inventory table using the primary key
DELETE FROM public.inventory WHERE inv_id = 1;

-- 5.1Create an account with firstname, lastname,email and password
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 5.2 Change account Type 

UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- 5.3 Delete Tonny stark from the database 

DELETE FROM public.account 
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark'; 

-- 5.4 Modify the "GM Hummer" record to read "a huge interior" 
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

--  5.5
SELECT inv.inv_make, inv.inv_model, cls.classification_name
FROM public.inventory AS inv
INNER JOIN public.classification AS cls ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';

-- 5.6

UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');




