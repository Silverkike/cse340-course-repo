import db from './db.js'

const getAllCategories = async () => {
    const query = `
        SELECT
            category_id,
            name
        FROM public.categories
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getCategoryById = async (id) => {
    const query = `
        SELECT
            category_id,
            name
        FROM public.categories
        WHERE category_id = $1;
    `;

    const queryParams = [id];

    const result = await db.query(query, queryParams);

    return result.rows[0];
}

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            categories.category_id,
            categories.name
        FROM public.categories
        JOIN public.project_categories
        ON categories.category_id = project_categories.category_id
        WHERE project_categories.project_id = $1
        ORDER BY categories.name;
    `;

    const queryParams = [projectId];

    const result = await db.query(query, queryParams);

    return result.rows;
}

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            service_projects.project_id,
            service_projects.title,
            service_projects.description,
            service_projects.location,
            service_projects.date
        FROM public.service_projects
        JOIN public.project_categories
        ON service_projects.project_id = project_categories.project_id
        WHERE project_categories.category_id = $1
        ORDER BY service_projects.date;
    `;

    const queryParams = [categoryId];

    const result = await db.query(query, queryParams);

    return result.rows;
}

export { getAllCategories, getCategoryById, getCategoriesByProjectId, getProjectsByCategoryId }