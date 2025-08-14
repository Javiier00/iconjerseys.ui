import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import { isValidEmail, validatePassword } from "../utils/validators";
import balonImage from "../assets/balon.png"; 
import cr7Image from "../assets/cr7.png"; 

const LoginScreen = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth(); // Removemos loading del contexto
    const navigate = useNavigate();

    const handleLogin = async () => {
        // Evitar múltiples envíos
        if (isSubmitting) {
            return;
        }

        setError("");
        setIsSubmitting(true);

        // Validaciones básicas (solo formato, no complejidad)
        if (!email.trim()) {
            setError('El email es requerido');
            setIsSubmitting(false);
            return;
        }

        // Validación básica de formato de email (no tan estricta)
        if (!email.includes('@') || !email.includes('.')) {
            setError('Por favor ingresa un email válido');
            setIsSubmitting(false);
            return;
        }

        if (!password.trim()) {
            setError('La contraseña es requerida');
            setIsSubmitting(false);
            return;
        }
        
        // Sin validaciones complejas de contraseña para login
        // El servidor validará las credenciales

        try {
            console.log("Intentando login con:", { email, password: "***" });
            const result = await login(email, password);
            console.log("Resultado del login:", result);
            if (result) {
                navigate("/dashboard", { replace: true });
            }
        } catch (error) {
            console.error("Error en login:", error);
            setError(error.message || 'Error al iniciar sesión. Intenta nuevamente.');
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
                        alt="Balon de oro"
                        className="w-full h-full object-cover"
                    />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">Icon Jerseys</h1>
                <p className="text-gray-600">Inicia sesión en tu cuenta</p>
            </div>

            {/* Mensaje de error */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
                    <span className="mr-2">❌</span>
                    <span>{error}</span>
                </div>
            )}

            {/* Formulario */}
            <form className="space-y-5" noValidate>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-yellow-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        required
                        className="w-full px-4 py-3 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-800"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError('');
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleLogin();
                        }}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-yellow-700 mb-1">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        required
                        className="w-full px-4 py-3 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-800"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError('');
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleLogin();
                        }}
                    />
                </div>

                <button
                    type="button"
                    onClick={handleLogin}
                    disabled={isSubmitting}
                    className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg shadow-md hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
            </form>

            {/* Link de registro */}
            <p className="text-center text-sm text-gray-600 mt-6">
                ¿No tienes cuenta?{" "}
                <Link to="/signup" className="text-yellow-400 font-medium hover:text-yellow-500">
                    Regístrate
                </Link>
            </p>

            {/* Fondo decorativo */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-yellow-100 rounded-full opacity-20 pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-yellow-200 rounded-full opacity-20 pointer-events-none"></div>
        </div>
    </div>
);

}

export default LoginScreen