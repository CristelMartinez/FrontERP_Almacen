import { useNavigate } from "react-router-dom"
import {
  FiPackage,
  FiRepeat,
  FiList,
  FiAlertTriangle,
  FiBookOpen,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi"

const REPORTES = [
  {
    icon: FiPackage,
    iconColor: "bg-blue-50 text-blue-500",
    titulo: "Inventario",
    descripcion: "Stock actual por producto y almacén",
    ruta: "/reportes/inventario",
  },
  {
    icon: FiRepeat,
    iconColor: "bg-violet-50 text-violet-500",
    titulo: "Movimientos",
    descripcion: "Entradas y salidas por rango de fechas",
    ruta: "/reportes/movimientos",
  },
  {
    icon: FiList,
    iconColor: "bg-emerald-50 text-emerald-500",
    titulo: "Productos",
    descripcion: "Catálogo completo con precios y estado",
    ruta: "/reportes/productos",
  },
  {
    icon: FiAlertTriangle,
    iconColor: "bg-red-50 text-red-500",
    titulo: "Stock bajo",
    descripcion: "Productos que requieren reposición",
    ruta: "/reportes/stock-bajo",
  },
  {
    icon: FiBookOpen,
    iconColor: "bg-amber-50 text-amber-500",
    titulo: "Kardex",
    descripcion: "Detalle de movimientos por producto",
    ruta: "/reportes/kardex",
  },
  {
    icon: FiShoppingBag,
    iconColor: "bg-pink-50 text-pink-500",
    titulo: "Apartados",
    descripcion: "Detalle de apartados realizados",
    ruta: "/reportes/apartados",
  },
]

function ReporteCard({ icon: Icon, iconColor, titulo, descripcion, ruta }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(ruta)}
      className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-4 text-left hover:border-blue-200 hover:shadow-sm transition-all group"
    >
      {/* ICONO + FLECHA */}
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconColor}`}>
          <Icon size={16} />
        </div>
        <FiArrowRight
          size={14}
          className="text-gray-200 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all"
        />
      </div>

      {/* TEXTO */}
      <div>
        <p className="text-sm font-semibold text-gray-800">{titulo}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{descripcion}</p>
      </div>
    </button>
  )
}

export default function Reportes() {
  return (
    <div className="flex flex-col gap-6">

      {/* ENCABEZADO */}
      <div>
        <h1 className="text-lg font-semibold text-gray-800">Reportes</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Consulta y exporta información del sistema
        </p>
      </div>

      {/* GRID DE REPORTES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {REPORTES.map((r) => (
          <ReporteCard key={r.ruta} {...r} />
        ))}
      </div>

    </div>
  )
}