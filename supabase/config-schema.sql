-- Configuration table for editable site settings
-- This table stores all configurable site settings that can be edited via the admin settings page
-- Run this script to set up the site_config table with default values
create table if not exists public.site_config (
	id uuid primary key default gen_random_uuid(),
	key text unique not null,
	value text not null,
	description text,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

-- Insert default configuration values
INSERT INTO public.site_config (key, value, description) VALUES
('company_name', 'Chahar Printing Press', 'Company name displayed in footer'),
('company_address', '123 Business Street, City, State 12345', 'Company address'),
('company_phone', '+91 9876543210', 'Company phone number'),
('company_email', 'info@chaharprinting.com', 'Company email address'),
('whatsapp_number', '+91 9876543210', 'WhatsApp contact number'),
('whatsapp_message_template', 'Hi! I''m interested in the "{product_name}" product. Could you please provide more information?\n\nProduct Link: {product_link}', 'WhatsApp message template (use {product_name} and {product_link} as placeholders)'),
('directions_url', '', 'Directions link for company location (Google Maps, Apple Maps, etc.)'),
('copyright_text', '© 2024 Chahar Printing Press. All rights reserved.', 'Copyright text'),
('facebook_url', '', 'Facebook page URL'),
('instagram_url', '', 'Instagram profile URL'),
('linkedin_url', '', 'LinkedIn company page URL'),
-- Business Hours Configuration
('business_hours_monday', '9:00 AM - 6:00 PM', 'Monday business hours'),
('business_hours_tuesday', '9:00 AM - 6:00 PM', 'Tuesday business hours'),
('business_hours_wednesday', '9:00 AM - 6:00 PM', 'Wednesday business hours'),
('business_hours_thursday', '9:00 AM - 6:00 PM', 'Thursday business hours'),
('business_hours_friday', '9:00 AM - 6:00 PM', 'Friday business hours'),
('business_hours_saturday', '10:00 AM - 4:00 PM', 'Saturday business hours'),
('business_hours_sunday', 'Closed', 'Sunday business hours')
ON CONFLICT (key) DO NOTHING;
