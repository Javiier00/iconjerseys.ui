import { useState, useEffect } from 'react';
import { futbolTeamService } from '../services';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import FutbolTeamForm from './FutbolTeamForm';

const FutbolTeamsList = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [recentlyUpdated, setRecentlyUpdated] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const { validateToken } = useAuth();

    useEffect(() => {
        loadTeams();
    }, []);

    useEffect(() => {
        if (recentlyUpdated) {
            const timer = setTimeout(() => setRecentlyUpdated(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [recentlyUpdated]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const loadTeams = async () => {
        if (!validateToken()) return;

        try {
            setLoading(true);
            setError('');
            const data = await futbolTeamService.getAll();
            setTeams(data);
        } catch (err) {
            console.error('Error al cargar equipos de fútbol:', err);
            setError(err.message || 'Error al cargar equipos de fútbol');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingTeam(null);
        setShowForm(true);
    };

    const handleEdit = (team) => {
        setEditingTeam(team);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este equipo?")) return;

        try {
            await futbolTeamService.deactivate(id);
            setTeams(teams.filter(team => team.id !== id)); 
            setSuccessMessage("Equipo eliminado exitosamente");
        } catch (err) {
            console.error("Error al eliminar equipo:", err);
            setError(err.message || "Error al eliminar el equipo");
        }
    };



    const handleFormSuccess = async (savedTeam, isEdit = false) => {
        await loadTeams(); // refresca la lista desde la API
        setRecentlyUpdated(savedTeam.id);
        const message = isEdit ? 'Equipo actualizado exitosamente' : 'Equipo creado exitosamente';
        setSuccessMessage(message);
        setShowForm(false);
        setEditingTeam(null);
        setError('');
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingTeam(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-600">Cargando equipos de fútbol...</div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Equipos de Fútbol</h1>
                <button
                    onClick={handleCreate}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                    + Nuevo Equipo
                </button>
            </div>

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">✅</span>
                        <span>{successMessage}</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">❌</span>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">País</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {teams.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                    No hay equipos registrados
                                </td>
                            </tr>
                        ) : (
                            teams.map((team) => (
                                <tr
                                    key={team.id}
                                    className={`hover:bg-gray-50 transition-colors ${
                                        recentlyUpdated === team.id ? 'bg-green-50 border-l-4 border-green-400' : ''
                                    }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.country}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(team)}
                                            className="text-blue-600 hover:text-blue-900 mr-2"
                                        >
                                            Editar 
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(team.id)}
                                            className="text-red-600 hover:text-red-900"   
                                        >    
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <FutbolTeamForm
                    item={editingTeam}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            )}
        </Layout>
    );
};

export default FutbolTeamsList;
