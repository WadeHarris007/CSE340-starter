-- This creates the account for Tony Stark + details
insert into public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
values (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- This will modify Tony Stark account_type to Admin
update public.account
set account_type = 'Admin'
where account_id = 1;
-- This will delete Tony Stark!
delete from public.account
where account_id = 1;
-- This will modify the GM Hummer record
update public.inventory
set inv_description = replace(
        inv_description,
        'small interiors',
        'a huge interior'
    );
where inv_id = 10;
-- This will select vehicles from inventory that fall within the sport category
select *
from public.inventory i
    inner join public.classification c on i.classification_id = c.classification_id
where c.classification_name = 'Sport';
-- This will update the inv_image and inv_thumbnail records
update public.inventory
set inv_image = replace(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = replace(inv_thumbnail, '/images/', '/images/vehicles/');