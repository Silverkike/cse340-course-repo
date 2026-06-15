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
    processEditProjectForm
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
// 🆕 IMPORTACIÓN NUEVA: Controlador de Usuarios
// ========================================
import {
    showUserRegistrationForm,
    processUserRegistrationForm
} from './controllers/users.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// Route for new category page
router.get('/new-category', showNewCategoryForm);

// Route to handle new category form submission
// categoryValidation acts as a security guard that checks data before it reaches the controller
router.post('/new-category', categoryValidation, processNewCategoryForm);

// Route to display the edit category form
router.get('/edit-category/:id', showEditCategoryForm);

// Route to handle edit category form submission
// categoryValidation acts as a security guard that checks data before it reaches the controller
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', showNewOrganizationForm);

// Route for new project page
router.get('/new-project', showNewProjectForm);

// Route to handle new project form submission
// projectValidation acts as a security guard that checks data before it reaches the controller
router.post('/new-project', projectValidation, processNewProjectForm);

// Route to display the edit project form
router.get('/edit-project/:id', showEditProjectForm);

// Route to handle edit project form submission
// projectValidation acts as a security guard that checks data before it reaches the controller
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Handle form submission for creating a new organization
// organizationValidation acts as a security guard that checks data before it reaches the controller
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// ========================================
// 🆕 RUTAS NUEVAS: Registro de Usuarios
// ========================================

// When user visits /register in browser (GET) - Show the registration form
router.get('/register', showUserRegistrationForm);

// When user submits the registration form (POST) - Process the registration
router.post('/register', processUserRegistrationForm);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;