-- ========================================
-- Organization Table
-- ========================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),

('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),

('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Service Projects Table
-- ========================================

CREATE TABLE service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organization(organization_id),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100) NOT NULL,
    date DATE NOT NULL
);

-- ========================================
-- Insert sample data: Service Projects
-- ========================================

INSERT INTO service_projects
(organization_id, title, description, location, date)
VALUES

-- BrightFuture Builders
(1, 'Community Playground Renovation',
 'Renovating playground equipment for local families.',
 'San Salvador',
 '2026-06-15'),

(1, 'Bridge Repair Initiative',
 'Repairing damaged pedestrian bridges in rural communities.',
 'Santa Ana',
 '2026-07-10'),

(1, 'Affordable Housing Project',
 'Building affordable homes for low-income families.',
 'Soyapango',
 '2026-08-05'),

(1, 'School Roof Replacement',
 'Replacing damaged roofs in public schools.',
 'Apopa',
 '2026-09-12'),

(1, 'Community Center Expansion',
 'Expanding the local community activity center.',
 'Mejicanos',
 '2026-10-01'),

-- GreenHarvest Growers
(2, 'Urban Garden Workshop',
 'Teaching urban gardening techniques to residents.',
 'San Miguel',
 '2026-06-20'),

(2, 'Community Compost Program',
 'Launching a city-wide compost education campaign.',
 'Santa Tecla',
 '2026-07-18'),

(2, 'School Farming Initiative',
 'Helping schools create educational gardens.',
 'Ilopango',
 '2026-08-14'),

(2, 'Neighborhood Tree Planting',
 'Planting trees in urban neighborhoods.',
 'San Salvador',
 '2026-09-03'),

(2, 'Farmers Market Support',
 'Supporting local farmers with community events.',
 'La Libertad',
 '2026-10-22'),

-- UnityServe Volunteers
(3, 'Food Drive Campaign',
 'Collecting and distributing food to families in need.',
 'Apopa',
 '2026-06-11'),

(3, 'Senior Assistance Program',
 'Providing support and companionship for senior citizens.',
 'San Vicente',
 '2026-07-25'),

(3, 'Beach Cleanup Day',
 'Organizing volunteers to clean coastal areas.',
 'La Libertad',
 '2026-08-30'),

(3, 'Back-to-School Donation Event',
 'Providing school supplies for children.',
 'Cuscatancingo',
 '2026-09-15'),

(3, 'Holiday Volunteer Festival',
 'Community volunteer event during the holidays.',
 'San Salvador',
 '2026-12-05');