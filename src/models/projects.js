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

export { getAllProjects }