import db from './db.js'

const getAllProjects = async () => {
    const query = `
        SELECT 
            service_projects.project_id,
            service_projects.title,
            service_projects.description,
            service_projects.location,
            service_projects.date,
            organization.name AS organization_name
        FROM public.service_projects
        JOIN public.organization
        ON service_projects.organization_id = organization.organization_id
        ORDER BY service_projects.date;
    `;
    const result = await db.query(query);
    return result.rows;
}

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            service_projects.project_id,
            service_projects.title,
            service_projects.description,
            service_projects.location,
            service_projects.date,
            service_projects.organization_id,
            organization.name AS organization_name
        FROM public.service_projects
        JOIN public.organization
        ON service_projects.organization_id = organization.organization_id
        WHERE service_projects.date >= CURRENT_DATE
        ORDER BY service_projects.date ASC
        LIMIT $1;
    `;
    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);
    return result.rows;
}

const getProjectDetails = async (id) => {
    const query = `
        SELECT
            service_projects.project_id,
            service_projects.title,
            service_projects.description,
            service_projects.location,
            service_projects.date,
            service_projects.organization_id,
            organization.name AS organization_name
        FROM public.service_projects
        JOIN public.organization
        ON service_projects.organization_id = organization.organization_id
        WHERE service_projects.project_id = $1;
    `;
    const queryParams = [id];
    const result = await db.query(query, queryParams);
    return result.rows[0];
}

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM public.service_projects
        WHERE organization_id = $1
        ORDER BY date;
    `;
    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);
    return result.rows;
}

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
    INSERT INTO public.service_projects (title, description, location, date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;
    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(`Created new project with ID: ${result.rows[0].project_id}`);
    }

    return result.rows[0].project_id;
}

const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `
        UPDATE public.service_projects
        SET title = $1,
            description = $2,
            location = $3,
            date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;
    const queryParams = [title, description, location, date, organizationId, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to update project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(`Updated project with ID: ${result.rows[0].project_id}`);
    }

    return result.rows[0].project_id;
}

const addVolunteer = async (projectId, userId) => {
    const query = `
        INSERT INTO public.project_volunteers (project_id, user_id)
        VALUES ($1, $2);
    `;
    const queryParams = [projectId, userId];
    const result = await db.query(query, queryParams);

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(`User ${userId} added as volunteer to project ${projectId}`);
    }

    return result;
}

const removeVolunteer = async (projectId, userId) => {
    const query = `
        DELETE FROM public.project_volunteers
        WHERE project_id = $1 AND user_id = $2;
    `;
    const queryParams = [projectId, userId];
    const result = await db.query(query, queryParams);

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(`User ${userId} removed as volunteer from project ${projectId}`);
    }

    return result;
}

const getUserVolunteerProjects = async (userId) => {
    const query = `
        SELECT 
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.date,
            o.name AS organization_name
        FROM public.project_volunteers pv
        JOIN public.service_projects sp ON pv.project_id = sp.project_id
        JOIN public.organization o ON sp.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY sp.date;
    `;
    const queryParams = [userId];
    const result = await db.query(query, queryParams);
    return result.rows;
}

export {
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails,
    getProjectsByOrganizationId,
    createProject,
    updateProject,
    addVolunteer,
    removeVolunteer,
    getUserVolunteerProjects
}
