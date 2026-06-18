// Import any needed model functions
import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject,
    addVolunteer,
    removeVolunteer,
    getUserVolunteerProjects
} from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define validation and sanitization rules for project form
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const categories = await getCategoriesByProjectId(projectId);
    const title = project.title;
    const isLoggedIn = !!req.session.user;
    let isVolunteer = false;

    if (isLoggedIn) {
        try {
            const volunteeredProjects = await getUserVolunteerProjects(req.session.user.user_id);
            isVolunteer = volunteeredProjects.some(p => String(p.project_id) === String(projectId));
        } catch (error) {
            console.error('Error checking volunteer status:', error);
            isVolunteer = false;
        }
    }

    res.render('project', {
        title,
        project,
        categories,
        isLoggedIn: isLoggedIn,
        isVolunteer: isVolunteer
    });
};

// Create showNewProjectForm function
const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';
    res.render('new-project', { title, organizations });
};

// Create processNewProjectForm function
const processNewProjectForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }

    try {
        const { title, description, location, date, organizationId } = req.body;

        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const projectDetails = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();
    const title = 'Edit Service Project';

    res.render('update-project', { title, projectId, projectDetails, organizations });
};

const processEditProjectForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit project form
        return res.redirect(`/edit-project/${req.params.id}`);
    }

    try {
        const projectId = req.params.id;
        const { title, description, location, date, organizationId } = req.body;

        await updateProject(projectId, title, description, location, date, organizationId);

        req.flash('success', 'Service project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        req.flash('error', 'There was an error updating the service project.');
        res.redirect(`/edit-project/${req.params.id}`);
    }
};

// Add volunteer controller functions
const addVolunteerToProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    try {
        await addVolunteer(projectId, userId);
        req.flash('success', 'You are now volunteering for this project!');
    } catch (error) {
        console.error('Error adding volunteer:', error);
        req.flash('error', 'There was an error signing up to volunteer.');
    }

    res.redirect(`/project/${projectId}`);
};

const removeVolunteerFromProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    try {
        await removeVolunteer(projectId, userId);
        req.flash('success', 'You have been removed as a volunteer from this project.');
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'There was an error removing your volunteer signup.');
    }

    res.redirect(`/project/${projectId}`);
};

// Export any controller functions
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm,
    addVolunteerToProject,
    removeVolunteerFromProject
};