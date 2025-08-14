import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, validatePassword, getPasswordStrength } from "../utils/validators";
import cr7Image from "../assets/cr7.png";
import balonImage from "../assets/balon.png";

const SignupScreen = () => {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { register } = useAuth(); // Removemos loading del contexto para el signup también
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar errores cuando el usuario empiece a escribir
        if (error) setError('');
    };

    const handleSignup = async () => {
        // Evitar múltiples envíos
        if (isSubmitting) {
            return;
        }
        
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        // Validaciones básicas
        if (!formData.name.trim()) {
            setError('El nombre es requerido');
            setIsSubmitting(false);
            return;
        }
        if (!formData.lastname.trim()) {
            setError('El apellido es requerido');
            setIsSubmitting(false);
            return;
        }
        if (!formData.email.trim()) {
            setError('El email es requerido');
            setIsSubmitting(false);
            return;
        }
        
        // Validación de formato de email
        if (!isValidEmail(formData.email)) {
            setError('Por favor ingresa un email válido');
            setIsSubmitting(false);
            return;
        }
        
        // Validaciones de contraseña
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.message);
            setIsSubmitting(false);
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await register(formData.name, formData.lastname, formData.email, formData.password);
            if (result) {
                setSuccess('¡Cuenta creada exitosamente! Redirigiendo al login...');

                // Limpiar formulario
                setFormData({
                    name: '',
                    lastname: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });


                navigate('/login', { replace: true });
            }
        } catch (error) {
            console.error('Error en registro:', error);
            setError(error.message || 'Error al crear la cuenta. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden">

            {/* Header con imagen */}
            <div className="text-center mb-8 relative">
                <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-4 border-4 border-white-400 shadow-lg">
                    <img
                        src={balonImage}
                        alt="Cristiano Ronaldo"
                        className="w-full h-full object-cover"
                    />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">Icon Jerseys</h1>
                <p className="text-gray-600">Crea tu cuenta nueva</p>
            </div>

            {/* Mensajes de error y éxito */}
            {error && (
                <div className={`mb-4 p-3 rounded-md border ${
                    error.includes('email ya está registrado') || error.includes('usuario ya existe')
                        ? 'bg-orange-100 border-orange-400 text-orange-700'
                        : 'bg-red-100 border-red-400 text-red-700'
                } flex items-center`}>
                    <span className="mr-2">
                        {error.includes('email ya está registrado') || error.includes('usuario ya existe')
                            ? '⚠️'
                            : '❌'
                        }
                    </span>
                    <span>{error}</span>
                </div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-md flex items-center">
                    <span className="mr-2">✅</span>
                    <span>{success}</span>
                </div>
            )}

            {/* Formulario */}
            <form className="space-y-5" noValidate>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-yellow-700 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-800"
                            placeholder="Juan"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastname" className="block text-sm font-medium text-yellow-700 mb-1">
                            Apellido
                        </label>
                        <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-800"
                            placeholder="Pérez"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-yellow-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-800"
                        placeholder="usuario@example.com"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-yellow-700 mb-1">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-800"
                        placeholder="8-64 caracteres, 1 mayúscula, 1 número, 1 especial"
                    />
                    {formData.password && (
                        <div className="mt-2 space-y-1 text-xs">
                            {(() => {
                                const strength = getPasswordStrength(formData.password);
                                return (
                                    <>
                                        <div className={`flex items-center ${strength.isValidLength ? 'text-blue-600' : 'text-gray-400'}`}>
                                            <span className="mr-1">{strength.isValidLength ? '✓' : '○'}</span>
                                            8-64 caracteres
                                        </div>
                                        <div className={`flex items-center ${strength.hasUppercase ? 'text-blue-600' : 'text-gray-400'}`}>
                                            <span className="mr-1">{strength.hasUppercase ? '✓' : '○'}</span>
                                            Al menos una mayúscula
                                        </div>
                                        <div className={`flex items-center ${strength.hasNumber ? 'text-blue-600' : 'text-gray-400'}`}>
                                            <span className="mr-1">{strength.hasNumber ? '✓' : '○'}</span>
                                            Al menos un número
                                        </div>
                                        <div className={`flex items-center ${strength.hasSpecialChar ? 'text-blue-600' : 'text-gray-400'}`}>
                                            <span className="mr-1">{strength.hasSpecialChar ? '✓' : '○'}</span>
                                            Carácter especial (@$!%*?&)
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-yellow-700 mb-1">
                        Confirmar Contraseña
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-800"
                        placeholder="Confirma tu contraseña"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSignup(); }}
                    />
                </div>

                <button
                    type="button"
                    onClick={handleSignup}
                    disabled={isSubmitting}
                    className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg shadow-md hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                </button>
            </form>

            {/* Link de login */}
            <p className="text-center text-sm text-gray-600 mt-6">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-yellow-400 font-medium hover:text-yellow-500">
                    Inicia sesión
                </Link>
            </p>

            {/* Fondo decorativo */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-yellow-100 rounded-full opacity-20 pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-yellow-200 rounded-full opacity-20 pointer-events-none"></div>
        </div>
    </div>
);

};

export default SignupScreen;