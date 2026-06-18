import express from 'express';

import { showHomePage } from './controllers/index.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';
import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm,
    addVolunteerToProject,
    removeVolunteerFromProject
} from './controllers/projects.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
} from './controllers/categories.js';

// ========================================
// 🆕 IMPORTACIÓN ACTUALIZADA: Controlador de Usuarios (Registro + Login/Logout + Dashboard + requireRole)
// ========================================
import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage  // 🆕 Importamos el controlador de lista de usuarios
} from './controllers/users.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// ========================================
// RUTAS PÚBLICAS (accesibles para todos)
// ========================================
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// ========================================
// 🔒 RUTAS PROTEGIDAS: Categorías (solo admin)
// ========================================

// Route for new category page
router.get('/new-category', requireRole('admin'), showNewCategoryForm);

// Route to handle new category form submission
// requireRole('admin') acts as security guard, categoryValidation checks data
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);

// Route to display the edit category form
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);

// Route to handle edit category form submission
// requireRole('admin') acts as security guard, categoryValidation checks data
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

// ========================================
// 🔒 RUTAS PROTEGIDAS: Organizaciones (solo admin)
// ========================================

// Route for new organization page
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);

// Handle form submission for creating a new organization
// requireRole('admin') acts as security guard, organizationValidation checks data
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// ========================================
// 🔒 RUTAS PROTEGIDAS: Proyectos (solo admin)
// ========================================

// Route for new project page
router.get('/new-project', requireRole('admin'), showNewProjectForm);

// Route to handle new project form submission
// requireRole('admin') acts as security guard, projectValidation checks data
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

// Route to display the edit project form
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);

// Route to handle edit project form submission
// requireRole('admin') acts as security guard, projectValidation checks data
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

// ========================================
// RUTAS: Registro de Usuarios
// ========================================

// When user visits /register in browser (GET) - Show the registration form
router.get('/register', showUserRegistrationForm);

// When user submits the registration form (POST) - Process the registration
router.post('/register', processUserRegistrationForm);

// ========================================
// RUTAS: Login/Logout de Usuarios
// ========================================

// When user visits /login in browser (GET) - Show the login form
router.get('/login', showLoginForm);

// When user submits the login form (POST) - Process the login
router.post('/login', processLoginForm);

// When user clicks logout (GET) - Destroy session and redirect to login
router.get('/logout', processLogout);

// ========================================
// RUTAS PROTEGIDAS: Dashboard (requiere autenticación)
// ========================================

// Protected dashboard route - requireLogin middleware checks authentication before showDashboard
router.get('/dashboard', requireLogin, showDashboard);

// ========================================
// 🔒 RUTAS PROTEGIDAS: Gestión de Usuarios (solo admin)
// ========================================

// Protected users list route - only accessible by admin users
router.get('/users', requireRole('admin'), showUsersPage);

// ========================================
// 🔒 RUTAS PROTEGIDAS: Voluntariado de Proyectos (requiere autenticación)
// ========================================

// Route to add current user as volunteer to a project
router.post('/project/:id/volunteer', requireLogin, addVolunteerToProject);

// Route to remove current user as volunteer from a project
router.post('/project/:id/unvolunteer', requireLogin, removeVolunteerFromProject);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;