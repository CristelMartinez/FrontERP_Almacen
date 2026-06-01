import { useNavigate } from "react-router-dom"
import { FiLayers, FiPackage, FiTruck, FiHome, FiUsers, FiRefreshCw, FiMapPin, FiFolder, FiGitBranch} from "react-icons/fi"


export default function Configuracion() {

  const navigate = useNavigate()

  const cards = [
    {
      titulo: "Categorías",
      descripcion: "Administrar categorías de productos",
      icono: <FiLayers size={28} />,
      ruta: "/configuracion/categorias"
    },
    {
      titulo: "Unidades",
      descripcion: "Configurar unidades de medida",
      icono: <FiPackage size={28} />,
      ruta: "/configuracion/unidades"
    },
    {
      titulo: "Proveedores",
      descripcion: "Administrar proveedores",
      icono: <FiTruck size={28} />,
      ruta: "/configuracion/proveedores"
    },
    {
      titulo: "Almacenes",
      descripcion: "Gestionar almacenes del sistema",
      icono: <FiHome size={28} />,
      ruta: "/configuracion/almacenes"
    },
    {
      titulo: "Departamentos",
      descripcion: "Áreas que solicitan materiales",
      icono: <FiUsers size={28} />,
      ruta: "/configuracion/departamentos"
    },
    {
      titulo: "Tipos de movimiento",
      descripcion: "Configurar entradas y salidas",
      icono: <FiRefreshCw size={28} />,
      ruta: "/configuracion/tipos-movimiento"
    },
    {
      titulo: "Ubicaciones",
      descripcion: "Configurar las ubicaciones de los estantes",
      icono: <FiMapPin  size={28} />,
      ruta: "/configuracion/Ubicaciones"
    },
    {
      titulo: "Familias",
      descripcion: "Configurar las familias de productos",
      icono: <FiFolder  size={28} />,
      ruta: "/configuracion/familias"
    },
    {
      titulo: "Subfamilias",
      descripcion: "Configurar las subfamilias de productos",
      icono: <FiGitBranch size={28} />,
      ruta: "/configuracion/subfamilias"
    }


  ]

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Configuración
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {cards.map((card, index) => (

          <div
            key={index}
            onClick={() => navigate(card.ruta)}
            className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer p-6 flex items-start gap-4"
          >

            <div className="text-blue-600">
              {card.icono}
            </div>

            <div>

              <h2 className="font-semibold text-lg">
                {card.titulo}
              </h2>

              <p className="text-sm text-gray-500">
                {card.descripcion}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}