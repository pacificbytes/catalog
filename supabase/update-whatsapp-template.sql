-- Update WhatsApp message template to include product link
-- This script updates the existing whatsapp_message_template to include the product link placeholder

UPDATE public.site_config 
SET value = 'Hi! I''m interested in the "{product_name}" product. Could you please provide more information?

Product Link: {product_link}',
    description = 'WhatsApp message template (use {product_name} and {product_link} as placeholders)'
WHERE key = 'whatsapp_message_template';

-- If the record doesn't exist, insert it
INSERT INTO public.site_config (key, value, description)
VALUES (
    'whatsapp_message_template', 
    'Hi! I''m interested in the "{product_name}" product. Could you please provide more information?

Product Link: {product_link}', 
    'WhatsApp message template (use {product_name} and {product_link} as placeholders)'
)
ON CONFLICT (key) DO NOTHING;
