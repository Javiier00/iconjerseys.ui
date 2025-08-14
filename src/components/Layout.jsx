import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react"

const Layout = ({ children }) => {
    const navigate = useNavigate()
    const { user, logout, validateToken } = useAuth()

    useEffect(() => {
        const interval = setInterval(() => {
            if (!validateToken()) {
                clearInterval(interval);
            }
        }, 60000);

        validateToken();

        return () => clearInterval(interval);
    }, [validateToken]);

    const handleLogout = () => {
        logout();
        navigate('/ventacamisetas.ui/login');

    }

    return (
        <div className="min-h-screen bg-blue-50">
            <div className="bg-white shadow-lg">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between items-center py-4 border-b border-gray-200">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">¡Bienvenido a la Mejor tienda de camisetas! 👕</h1>
                            <p className="text-gray-600">Hola {`${user.firstname} ${user.lastname}`}</p>
                        </div>
                        <button 
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                            onClick={handleLogout}
                        >
                            Cerrar Sesión
                        </button>
                    </div>

                    <nav className="py-4">
                        <ul className="flex space-x-8">
                            <li>
                                <button 
                                    className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    <span className="mr-2">🏠</span>
                                    Inicio
                                </button>
                            </li>
                                <li>
                                <button 
                                    className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium"
                                    onClick={() => navigate('/futbol-teams')}
                                >
                                    <span className="mr-2">🛡️</span>
                                    Futbol Teams
                                </button>
                                </li>
                            <li>
                                <button 
                                    className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium"
                                    onClick={() => navigate('/shirts')}
                                >
                                    <span className="mr-2">👕</span>
                                    Shirts
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {children}
            </div>
        </div>
    )
}

export default Layout