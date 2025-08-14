import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { shirtService } from '../services';
import { useNavigate } from 'react-router-dom'; // <-- Importa useNavigate

const ShirtForm = ({ item, teams, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        team_id: item?.team_id || '',
        name: item?.name || '',
        description: item?.description || '',
        image: item?.image || '',
        price: item?.price || '',
        discount: item?.discount || 0,
        size: item?.size || ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { validateToken } = useAuth();
    const navigate = useNavigate(); // <-- Inicializa navigate

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        if (!validateToken()) return;

        if (!formData.team_id.trim()) { setError('El equipo es requerido'); return; }
        if (!formData.name.trim()) { setError('El nombre es requerido'); return; }
        const namePattern = /^[0-9A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
        if (!namePattern.test(formData.name)) { setError('El nombre solo puede contener letras, números, espacios, apostrofes y guiones'); return; }
        if (!formData.description.trim()) { setError('La descripción es requerida'); return; }
        if (!formData.image.trim()) { setError('La URL de la imagen es requerida'); return; }
        if (!formData.price || parseFloat(formData.price) <= 0) { setError('El precio debe ser mayor a 0'); return; }
        const discount = parseInt(formData.discount) || 0;
        if (discount < 0 || discount > 100) { setError('El descuento debe estar entre 0 y 100'); return; }
        if (!formData.size.trim()) { setError('La talla es requerida'); return; }

        setIsSubmitting(true);
        try {
            setError('');
            let savedItem;
            if (item) {
                savedItem = await shirtService.update(item.id, formData);
                if (!savedItem) savedItem = { ...item, ...formData };
                onSuccess(savedItem, true);
            } else {
                savedItem = await shirtService.create(formData);
                if (!savedItem) savedItem = { id: Date.now().toString(), ...formData };
                onSuccess(savedItem, false);
            }

            // <-- Redirige a la lista de camisetas después de guardar
            navigate('/shirts');

        } catch (err) {
            console.error('Error al guardar camiseta:', err);
            setError(err.message || 'Error al guardar la camiseta');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isSubmitting) handleSubmit();
        if (e.key === 'Escape') onCancel();
    };

    const activeTeams = teams; // mostrar todos los equipos

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {item ? 'Editar Camiseta' : 'Nueva Camiseta'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            <div className="flex items-center">
                                <span className="mr-2">❌</span>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="team_id" className="block text-sm font-medium text-gray-700 mb-1">
                                Equipo *
                            </label>
                            <select
                                id="team_id"
                                name="team_id"
                                value={formData.team_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Seleccionar equipo...</option>
                                {activeTeams.map((team) => (
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: Camiseta Visita 2025"
                                maxLength="100"
                                autoFocus={!item}
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Descripción de la camiseta..."
                                maxLength="500"
                            />
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                URL de Imagen *
                            </label>
                            <input
                                type="text"
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://ejemplo.com/camiseta.jpg"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                    Precio (HNL) *
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyPress}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                    min="0.01"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                                    Descuento (%)
                                </label>
                                <input
                                    type="number"
                                    id="discount"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyPress}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                                Talla *
                            </label>
                            <input
                                type="text"
                                id="size"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: S, M, L, XL"
                                maxLength="5"
                            />
                        </div>

                        {formData.price && formData.discount > 0 && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <div className="text-sm text-blue-800"><strong>Precio con descuento:</strong></div>
                                <div className="text-lg font-medium text-blue-900">
                                    <span className="line-through text-gray-500 mr-2">
                                        L. {parseFloat(formData.price).toFixed(2)}
                                    </span>
                                    L. {(parseFloat(formData.price) * (1 - formData.discount / 100)).toFixed(2)}
                                    <span className="text-sm text-blue-700 ml-2">({formData.discount}% descuento)</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShirtForm;
