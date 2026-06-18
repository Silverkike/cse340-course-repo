-- ========================================
-- SETUP.SQL - Base de datos CSE340
-- Última actualización: Semana 05
-- ========================================

-- ========================================
-- SECUENCIAS (para los campos SERIAL)
-- ========================================

CREATE SEQUENCE public.organization_organization_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.service_projects_project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- ========================================
-- CREACIÓN DE TABLAS
-- ========================================

-- Tabla: organization
CREATE TABLE public.organization (
    organization_id integer NOT NULL,
    name character varying(150) NOT NULL,
    description text NOT NULL,
    contact_email character varying(255) NOT NULL,
    logo_filename character varying(255) NOT NULL
);

-- Tabla: service_projects
CREATE TABLE public.service_projects (
    project_id integer NOT NULL,
    organization_id integer,
    title character varying(100) NOT NULL,
    description text NOT NULL,
    location character varying(100) NOT NULL,
    date date NOT NULL
);

-- Tabla: categories
CREATE TABLE public.categories (
    category_id integer NOT NULL,
    name character varying(100) NOT NULL
);

-- Tabla: project_categories (Junction Table)
CREATE TABLE public.project_categories (
    project_id integer NOT NULL,
    category_id integer NOT NULL
);

-- Tabla: project_volunteers (Junction Table for Volunteers)
CREATE TABLE public.project_volunteers (
    project_id integer NOT NULL,
    user_id integer NOT NULL
);

-- Tabla: roles (Control de Acceso RBAC)
CREATE TABLE public.roles (
    role_id integer NOT NULL,
    role_name character varying(50) NOT NULL,
    role_description text
);

-- Tabla: users (Control de Acceso RBAC)
CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- CONFIGURACIÓN DE VALORES POR DEFECTO
-- ========================================

ALTER TABLE ONLY public.organization ALTER COLUMN organization_id SET DEFAULT nextval('public.organization_organization_id_seq'::regclass);
ALTER TABLE ONLY public.service_projects ALTER COLUMN project_id SET DEFAULT nextval('public.service_projects_project_id_seq'::regclass);
ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);
ALTER TABLE ONLY public.roles ALTER COLUMN role_id SET DEFAULT nextval('public.roles_role_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);

-- ========================================
-- CONSTRAINTS - PRIMARY KEYS
-- ========================================

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (organization_id);

ALTER TABLE ONLY public.service_projects
    ADD CONSTRAINT service_projects_pkey PRIMARY KEY (project_id);

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);

ALTER TABLE ONLY public.project_categories
    ADD CONSTRAINT project_categories_pkey PRIMARY KEY (project_id, category_id);

ALTER TABLE ONLY public.project_volunteers
    ADD CONSTRAINT project_volunteers_pkey PRIMARY KEY (project_id, user_id);

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);

-- ========================================
-- CONSTRAINTS - UNIQUE
-- ========================================

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);

-- ========================================
-- CONSTRAINTS - FOREIGN KEYS
-- ========================================

ALTER TABLE ONLY public.service_projects
    ADD CONSTRAINT service_projects_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(organization_id);

ALTER TABLE ONLY public.project_categories
    ADD CONSTRAINT project_categories_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.service_projects(project_id);

ALTER TABLE ONLY public.project_categories
    ADD CONSTRAINT project_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id);

ALTER TABLE ONLY public.project_volunteers
    ADD CONSTRAINT project_volunteers_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.service_projects(project_id);

ALTER TABLE ONLY public.project_volunteers
    ADD CONSTRAINT project_volunteers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id);

-- ========================================
-- DATOS DE PRUEBA - ORGANIZATIONS
-- ========================================

INSERT INTO public.organization (organization_id, name, description, contact_email, logo_filename) VALUES
(1, 'BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
(2, 'GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
(3, 'UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png'),
(4, 'Test Organization', 'This a test organization created during the W04 activity.', 'test@example.com', 'placeholder-logo.png'),
(5, 'Test Organization 2', 'Organizacion que estoy usando para probar los mensajes flash y ahora el nombre fue editado.', 'test2@example.com', 'placeholder-logo.png'),
(6, 'My New Organization', 'This is a perfect valid description.', 'contacto@myorganization.com', 'placeholder-logo.png'),
(7, 'Test Organization 4', 'This a perfect organization description', 'final@ejemplo.com', 'placeholder-logo.png'),
(8, 'grader tester', 'example', 'example@gmail.com', 'placeholder-logo.png');

-- ========================================
-- DATOS DE PRUEBA - SERVICE PROJECTS
-- ========================================

INSERT INTO public.service_projects (project_id, organization_id, title, description, location, date) VALUES
(1, 1, 'Community Playground Renovation', 'Renovating playground equipment for local families.', 'San Salvador', '2026-06-15'),
(2, 1, 'Bridge Repair Initiative', 'Repairing damaged pedestrian bridges in rural communities.', 'Santa Ana', '2026-07-10'),
(3, 1, 'Affordable Housing Project', 'Building affordable homes for low-income families.', 'Soyapango', '2026-08-05'),
(4, 1, 'School Roof Replacement', 'Replacing damaged roofs in public schools.', 'Apopa', '2026-09-12'),
(5, 1, 'Community Center Expansion', 'Expanding the local community activity center.', 'Mejicanos', '2026-10-01'),
(6, 2, 'Urban Garden Workshop', 'Teaching urban gardening techniques to residents.', 'San Miguel', '2026-06-20'),
(7, 2, 'Community Compost Program', 'Launching a city-wide compost education campaign.', 'Santa Tecla', '2026-07-18'),
(8, 2, 'School Farming Initiative', 'Helping schools create educational gardens.', 'Ilopango', '2026-08-14'),
(9, 2, 'Neighborhood Tree Planting', 'Planting trees in urban neighborhoods.', 'San Salvador', '2026-09-03'),
(10, 2, 'Farmers Market Support', 'Supporting local farmers with community events.', 'La Libertad', '2026-10-22'),
(11, 3, 'Food Drive Campaign', 'Collecting and distributing food to families in need.', 'Apopa', '2026-06-11'),
(12, 3, 'Senior Assistance Program', 'Providing support and companionship for senior citizens.', 'San Vicente', '2026-07-25'),
(13, 3, 'Beach Cleanup Day', 'Organizing volunteers to clean coastal areas.', 'La Libertad', '2026-08-30'),
(14, 3, 'Back-to-School Donation Event', 'Providing school supplies for children.', 'Cuscatancingo', '2026-09-15'),
(15, 3, 'Holiday Volunteer Festival', 'Community volunteer event during the holidays.', 'San Salvador', '2026-12-05'),
(16, 2, 'Central Park Cleaning', 'Central park Cleaning and Maintenance journal', 'City Park Central', '2026-06-15'),
(17, 2, 'Proyecto de Limpieza', 'Jornada de limpieza comunitaria', 'Parque Central', '2026-06-14'),
(18, 3, 'Help to Elder People and Children', 'Carry food and clothes for Elder People and children', 'Ilopango', '2026-06-10'),
(19, 8, 'grader', 'example', 'example', '2026-06-10');

-- ========================================
-- DATOS DE PRUEBA - CATEGORIES
-- ========================================

INSERT INTO public.categories (category_id, name) VALUES
(1, 'Education'),
(2, 'Environment'),
(3, 'Food Assistance'),
(4, 'Spiritual Aid'),
(5, 'grader tester');

-- ========================================
-- DATOS DE PRUEBA - PROJECT CATEGORIES
-- ========================================

INSERT INTO public.project_categories (project_id, category_id) VALUES
(1, 1),
(2, 2),
(3, 1),
(4, 1),
(5, 1),
(6, 2),
(7, 2),
(8, 1),
(9, 2),
(10, 2),
(11, 3),
(12, 3),
(13, 2),
(14, 1),
(15, 3),
(18, 4);

-- ========================================
-- DATOS DE PRUEBA - ROLES
-- ========================================

INSERT INTO public.roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- ========================================
-- ACTUALIZACIÓN DE SECUENCIAS
-- (Para que los próximos INSERT continúen desde el último ID)
-- ========================================

SELECT pg_catalog.setval('public.organization_organization_id_seq', 8, true);
SELECT pg_catalog.setval('public.service_projects_project_id_seq', 19, true);
SELECT pg_catalog.setval('public.categories_category_id_seq', 5, true);
SELECT pg_catalog.setval('public.roles_role_id_seq', 2, true);
SELECT pg_catalog.setval('public.users_user_id_seq', 0, true);

-- ========================================
-- FIN DEL ARCHIVO setup.sql
-- ========================================