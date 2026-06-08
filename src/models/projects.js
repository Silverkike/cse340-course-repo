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

export {
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails,
    getProjectsByOrganizationId,
    createProject
}