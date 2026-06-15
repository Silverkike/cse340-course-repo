import db from './db.js';

/**
 * Crea un nuevo usuario en la base de datos
 * @param {string} name - Nombre del usuario
 * @param {string} email - Email del usuario (será su username)
 * @param {string} passwordHash - Contraseña ya hasheada con bcrypt
 * @returns {Promise<number>} - El ID del usuario creado
 */
const createUser = async (name, email, passwordHash) => {
    // El rol por defecto será "user" (no "admin")
    const default_role = 'user';

    // Query SQL para insertar el usuario
    // Usamos un subquery para obtener el role_id del rol "user"
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;

    // Parámetros para la query (evitan SQL injection)
    const queryParams = [name, email, passwordHash, default_role];

    try {
        // Ejecutar la query en la base de datos
        const result = await db.query(query, queryParams);

        // Verificar que se creó el usuario
        if (result.rows.length === 0) {
            throw new Error('Failed to create user');
        }

        // Log opcional para debugging
        if (process.env.ENABLE_SQL_LOGGING === 'true') {
            console.log('Created new user with ID:', result.rows[0].user_id);
        }

        // Retornar el ID del usuario creado
        return result.rows[0].user_id;
    } catch (error) {
        console.error('Error in createUser:', error);
        throw error;
    }
};

export { createUser };