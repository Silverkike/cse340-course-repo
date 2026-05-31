// Import any needed model functions
import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
} from '../models/categories.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);

    const projects = await getProjectsByCategoryId(categoryId);

    const title = category.name;

    res.render('category', {
        title,
        category,
        projects
    });
};

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };