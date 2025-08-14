import { useState, useEffect } from 'react';
import { shirtService, futbolTeamService } from '../services';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import ShirtForm from './ShirtForm';

const ShirtsList = () => {
    const [shirts, setShirts] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingShirt, setEditingShirt] = useState(null);
    const [recentlyUpdated, setRecentlyUpdated] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const { validateToken } = useAuth();

    useEffect(() => { loadData(); }, []);

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

    const loadData = async () => {
        if (!validateToken()) return;
        try {
            setLoading(true);
            setError('');
            const shirtsData = await shirtService.getAll();
            setShirts(shirtsData);

            try {
                const teamsData = await futbolTeamService.getAll();
                setTeams(teamsData);
            } catch (teamError) {
                console.warn('Error al cargar equipos:', teamError);
                setTeams([]);
            }

        } catch (err) {
            console.error('Error al cargar camisetas:', err);
            setError(err.message || 'Error al cargar camisetas');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingShirt(null);
        setShowForm(true);
    };

    const handleEdit = (shirt) => {
        setEditingShirt(shirt);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta camiseta?")) return;
        try {
            await shirtService.deactivate(id);
            setShirts(shirts.filter(shirt => shirt.id !== id));
            setSuccessMessage("Camiseta eliminada exitosamente");
        } catch (err) {
            console.error("Error al eliminar la camiseta:", err);
            setError(err.message || "Error al eliminar la camiseta");
        }
    };

    const handleFormSuccess = async (savedShirt, isEdit = false) => {
        await loadData();
        setSuccessMessage(isEdit ? 'Camiseta actualizada' : 'Camiseta creada');
        setShowForm(false);
        setEditingShirt(null);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingShirt(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-600">Cargando camisetas...</div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Camisetas</h1>
                <button
                    onClick={handleCreate}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                    + Nueva Camiseta
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descuento</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Final</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talla</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {shirts.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                    No hay camisetas registradas
                                </td>
                            </tr>
                        ) : (
                            shirts.map((shirt) => (
                                <tr
                                    key={shirt.id}
                                    className={`hover:bg-gray-50 transition-colors ${
                                        recentlyUpdated === shirt.id ? 'bg-green-50 border-l-4 border-green-400' : ''
                                    }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shirt.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {teams.find(t => t.id === shirt.team_id)?.name || 'Equipo no encontrado'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">L. {shirt.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shirt.discount || 0}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        L. {(shirt.price * (1 - (shirt.discount || 0)/100)).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shirt.size}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(shirt)}
                                            className="text-blue-600 hover:text-blue-900 mr-2"
                                        >
                                            Editar 
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(shirt.id)}
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
                <ShirtForm
                    item={editingShirt}
                    teams={teams}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            )}
        </Layout>
    );
};

export default ShirtsList;