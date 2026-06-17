import bcrypt from 'bcrypt';

// ========================================
// IMPORTACIÓN ACTUALIZADA: Agregamos authenticateUser
// ========================================
import { createUser, authenticateUser } from '../models/users.js';

/**
 * Muestra el formulario de registro
 */
const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

/**
 * Procesa el formulario de registro, hashea la contraseña y guarda el usuario
 */
const processUserRegistrationForm = async (req, res) => {
    // 1. Extraer los datos del formulario
    const { name, email, password } = req.body;

    try {
        // 2. Generar el "salt" (la sal aleatoria) y hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Crear el usuario en la base de datos usando el modelo
        const userId = await createUser(name, email, passwordHash);

        // 4. Manejo de éxito
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');

    } catch (error) {
        // 5. Manejo de errores (ej: email duplicado)
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

// ========================================
// FUNCIONES PARA LOGIN/LOGOUT
// ========================================

/**
 * Muestra el formulario de login
 */
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

/**
 * Procesa el formulario de login, verifica credenciales y crea sesión
 */
const processLoginForm = async (req, res) => {
    // 1. Extraer email y password del formulario
    const { email, password } = req.body;

    try {
        // 2. Autenticar al usuario usando el modelo
        const user = await authenticateUser(email, password);

        if (user) {
            // 3. Login exitoso: guardar usuario en la sesión
            req.session.user = user;
            req.flash('success', 'Login successful!');

            // 4. Log para debugging (solo en desarrollo)
            if (process.env.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            // 5. Redirigir al dashboard
            res.redirect('/dashboard');
        } else {
            // 6. Login fallido: credenciales inválidas
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        // 7. Manejo de errores inesperados
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

/**
 * Procesa el logout: destruye la sesión y redirige al login
 */
const processLogout = async (req, res) => {
    // 1. Eliminar el usuario de la sesión (si existe)
    if (req.session.user) {
        delete req.session.user;
    }

    // 2. Mensaje de éxito
    req.flash('success', 'Logout successful!');

    // 3. Redirigir al login
    res.redirect('/login');
};

// ========================================
// MIDDLEWARE DE PROTECCIÓN DE RUTAS
// ========================================

/**
 * Middleware que verifica si el usuario está logueado
 * Se usa para proteger rutas que requieren autenticación
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const requireLogin = (req, res, next) => {
    // Verificar si existe la sesión y si hay un usuario logueado
    if (!req.session || !req.session.user) {
        // ❌ NO está logueado → Crear mensaje de error y redirigir a login
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }

    // ✅ SÍ está logueado → Continuar al siguiente middleware/controlador
    next();
};

// ========================================
// 🆕 MIDDLEWARE FACTORY: Verificación de Roles
// ========================================

/**
 * Middleware factory para requerir un rol específico para acceder a una ruta
 * Retorna un middleware que verifica si el usuario tiene el rol requerido
 * 
 * @param {string} role - El nombre del rol requerido (ej: 'admin', 'user')
 * @returns {Function} Middleware de Express
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Paso 1: Verificar si el usuario está logueado
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Paso 2: Verificar si el rol del usuario coincide con el rol requerido
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // Paso 3: El usuario tiene el rol requerido, continuar
        next();
    };
};

// ========================================
// CONTROLADOR DEL DASHBOARD
// ========================================

/**
 * Muestra el dashboard del usuario con su información personalizada
 * Esta ruta está protegida por el middleware requireLogin
 * @param {Object} req - Request object (contiene req.session.user)
 * @param {Object} res - Response object
 */
const showDashboard = (req, res) => {
    // 1. Obtener el usuario de la sesión
    const user = req.session.user;

    // 2. Renderizar la vista del dashboard pasando los datos del usuario
    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

// ========================================
// EXPORTS: Exportamos todas las funciones que las rutas necesitan
// ========================================
export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,  // 🆕 Exportamos el middleware factory de roles
    showDashboard
};