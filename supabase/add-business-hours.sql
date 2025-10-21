-- Add Business Hours Configuration to Existing Site Config
-- Run this script to add business hours configuration to your existing site_config table

-- Insert business hours configuration (will not duplicate if already exists)
INSERT INTO public.site_config (key, value, description) VALUES
('business_hours_monday', '9:00 AM - 6:00 PM', 'Monday business hours'),
('business_hours_tuesday', '9:00 AM - 6:00 PM', 'Tuesday business hours'),
('business_hours_wednesday', '9:00 AM - 6:00 PM', 'Wednesday business hours'),
('business_hours_thursday', '9:00 AM - 6:00 PM', 'Thursday business hours'),
('business_hours_friday', '9:00 AM - 6:00 PM', 'Friday business hours'),
('business_hours_saturday', '10:00 AM - 4:00 PM', 'Saturday business hours'),
('business_hours_sunday', 'Closed', 'Sunday business hours')
ON CONFLICT (key) DO NOTHING;

-- Verify the business hours were added
SELECT key, value, description 
FROM public.site_config 
WHERE key LIKE 'business_hours_%' 
ORDER BY key;
