import { useAuth } from "../context/AuthContext"
import Layout from "./Layout"
import camisetasMadrid from '../assets/camisetasMadrid.jpg';

const Dashboard = () => {
    const { user } = useAuth()

return (
    <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8">

            {/* Mensaje destacado con más impacto */}
            <div className="text-center mb-6">
                <h2 className="text-3xl font-extrabold text-black-400 drop-shadow-lg">
                    ¡Las mejores camisetas de fútbol, como estas del Real Madrid!
                </h2>
                <p className="text-black-200 mt-2 text-lg drop-shadow-md">
                    Encuentra tu camiseta favorita y luce con estilo en cada partido ⚽
                </p>
            </div>
            
            {/* Imagen de camisetas */}
            <div className="flex justify-center items-center py-10">
                <img
                    src={camisetasMadrid}
                    alt="Camisetas del Real Madrid"
                    className="w-96 h-auto rounded-lg shadow-2xl border-4 border-yellow-400"
                />
            </div>

        </div>
    </Layout>
);


}

export default Dashboard