import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { futbolTeamService } from '../services';

const FutbolTeamForm = ({ item, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: item?.name || '',
        country: item?.country || ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { validateToken } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        if (!validateToken()) return;

        if (!formData.name.trim()) {
            setError('El nombre del equipo es requerido');
            return;
        }

        if (!formData.country.trim()) {
            setError('El país del equipo es requerido');
            return;
        }

        const pattern = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
        if (!pattern.test(formData.name)) {
            setError('El nombre solo puede contener letras, espacios, apostrofes y guiones');
            return;
        }

        if (!pattern.test(formData.country)) {
            setError('El país solo puede contener letras, espacios, apostrofes y guiones');
            return;
        }

        setIsSubmitting(true);

        try {
            setError('');
            let savedTeam;
            if (item) {
                savedTeam = await futbolTeamService.update(item.id, formData);
                if (!savedTeam) savedTeam = { ...item, ...formData };
                onSuccess(savedTeam, true);
            } else {
                savedTeam = await futbolTeamService.create(formData);
                if (!savedTeam) savedTeam = { id: Date.now(), ...formData };
                onSuccess(savedTeam, false);
            }
        } catch (err) {
            console.error('Error al guardar:', err);
            setError(err.message || 'Error al guardar el equipo de fútbol');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isSubmitting) handleSubmit();
        if (e.key === 'Escape') onCancel();
    };

return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-black bg-opacity-80 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">

                <h2 className="text-xl font-bold text-yellow-400 mb-4">
                    {item ? 'Editar Equipo de Fútbol' : 'Nuevo Equipo de Fútbol'}
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
                        <label htmlFor="name" className="block text-sm font-medium text-yellow-200 mb-1">
                            Nombre del Equipo *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onKeyDown={handleKeyPress}
                            className="w-full px-3 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-black text-yellow-200 placeholder-yellow-300"
                            placeholder="Ej: Real Madrid"
                            maxLength="100"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-yellow-200 mb-1">
                            País *
                        </label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            onKeyDown={handleKeyPress}
                            className="w-full px-3 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-black text-yellow-200 placeholder-yellow-300"
                            placeholder="Ej: España"
                            maxLength="50"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-yellow-200 bg-yellow-900 hover:bg-yellow-800 rounded-md transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 rounded-md disabled:opacity-50 transition-colors"
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>

            </div>
        </div>
    </div>
);

}

export default FutbolTeamForm;
