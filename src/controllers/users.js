import bcrypt from 'bcrypt';
import { createUser } from '../models/users.js';

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

export { showUserRegistrationForm, processUserRegistrationForm };