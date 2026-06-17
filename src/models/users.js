import db from './db.js';

// ========================================
// IMPORTACIÓN: bcrypt para verificar contraseñas
// ========================================
import bcrypt from 'bcrypt';

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

// ========================================
// FUNCIONES PARA LOGIN
// ========================================

/**
 * Busca un usuario en la base de datos por su email
 * @param {string} email - Email del usuario a buscar
 * @returns {Promise<Object|null>} - El objeto usuario con role_name o null si no existe
 */
const findUserByEmail = async (email) => {
    // ========================================
    // 🆕 CAMBIO: JOIN con roles para obtener role_name
    // ========================================
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const queryParams = [email];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }

    return result.rows[0];
};

/**
 * Verifica si una contraseña en texto plano coincide con un hash almacenado
 * @param {string} password - Contraseña en texto plano (la que el usuario ingresó)
 * @param {string} passwordHash - Hash almacenado en la base de datos
 * @returns {Promise<boolean>} - true si coinciden, false si no
 */
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

/**
 * Autentica a un usuario verificando email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<Object|null>} - El objeto usuario (sin password_hash) si es válido, o null si falla
 */
const authenticateUser = async (email, password) => {
    // Paso 1: Buscar el usuario por email
    const user = await findUserByEmail(email);

    // Si no se encontró el usuario, retornar null
    if (!user) {
        return null;
    }

    // Paso 2: Verificar la contraseña
    const isPasswordValid = await verifyPassword(password, user.password_hash);

    // Si la contraseña no es válida, retornar null
    if (!isPasswordValid) {
        return null;
    }

    // Paso 3: Si todo es correcto, eliminar el password_hash antes de retornar
    // (por seguridad, no queremos enviar el hash al controlador/sesión)
    const { password_hash, ...userWithoutPassword } = user;

    return userWithoutPassword;
};

// ========================================
// EXPORTS: Solo exportamos lo que el controlador necesita
// ========================================
export { createUser, authenticateUser };