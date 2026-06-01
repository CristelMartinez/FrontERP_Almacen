import { useNavigate, useLocation } from "react-router-dom"
import { FiLogOut, FiBell, FiMenu } from "react-icons/fi"

const rutas = {
  "/dashboard":                      ["Dashboard"],
  "/productos":                      ["Productos"],
  "/inventario":                     ["Inventario"],
  "/movimientos":                    ["Movimientos"],
  "/apartados":                      ["Apartados"],
  "/usuarios":                       ["Usuarios"],
  "/reportes":                       ["Reportes"],
  "/reportes/movimientos":           ["Reportes", "Movimientos"],
  "/reportes/inventario":            ["Reportes", "Inventario"],
  "/reportes/productos":             ["Reportes", "Productos"],
  "/reportes/stock-bajo":            ["Reportes", "Stock bajo"],
  "/reportes/kardex":                ["Reportes", "Kárdex"],
  "/reportes/apartados":             ["Reportes", "Apartados"],
  "/configuracion":                  ["Configuración"],
  "/configuracion/categorias":       ["Configuración", "Categorías"],
  "/configuracion/unidades":         ["Configuración", "Unidades"],
  "/configuracion/proveedores":      ["Configuración", "Proveedores"],
  "/configuracion/departamentos":    ["Configuración", "Departamentos"],
  "/configuracion/tipos-movimiento": ["Configuración", "Tipos de movimiento"],
  "/configuracion/almacenes":        ["Configuración", "Almacenes"],
  "/configuracion/ubicaciones":      ["Configuración", "Ubicaciones"],
  "/configuracion/familias":         ["Configuración", "Familias"],
  "/configuracion/subfamilias":      ["Configuración", "Subfamilias"],
}

function getIniciales(nombre = "") {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("")
}

/**
 * Props:
 *  onMenuClick  fn  — abre el sidebar en móvil (viene de MainLayout)
 */
export default function Navbar({ onMenuClick }) {
  const navigate  = useNavigate()
  const location  = useLocation()

  const partes    = rutas[location.pathname] ?? ["Dashboard"]
  const usuario   = JSON.parse(localStorage.getItem("usuario") ?? "{}")
  const iniciales = getIniciales(usuario?.nombre)

  const cerrarSesion = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    navigate("/")
  }

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 shrink-0">

      {/* IZQUIERDA — hamburguesa (móvil) + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">

        {/* HAMBURGUESA — solo móvil */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition shrink-0"
          aria-label="Abrir menú"
        >
          <FiMenu size={18} />
        </button>

        {/* BREADCRUMB */}
        <nav
          className="flex items-center gap-1.5 text-sm min-w-0 overflow-hidden"
          aria-label="Breadcrumb"
        >
          <span className="text-gray-400 hidden sm:block shrink-0">Inicio</span>

          {partes.map((parte, i) => (
            <span key={i} className="flex items-center gap-1.5 min-w-0">
              <span className="text-gray-300 text-xs hidden sm:block">/</span>
              <span
                className={[
                  "truncate",
                  i === partes.length - 1
                    ? "text-gray-800 font-medium"
                    : "text-gray-400 hidden sm:block",
                ].join(" ")}
              >
                {parte}
              </span>
            </span>
          ))}
        </nav>

      </div>

      {/* DERECHA — notificaciones + usuario + logout */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">

        {/* NOTIFICACIONES */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition"
          aria-label="Notificaciones"
        >
          <FiBell size={16} />
        </button>

        {/* SEPARADOR */}
        <div className="w-px h-5 bg-gray-100" />

        {/* USUARIO */}
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0"
            title={usuario?.nombre}
          >
            <span className="text-[11px] font-semibold text-blue-700 leading-none">
              {iniciales || "U"}
            </span>
          </div>
          {/* Nombre — oculto en móvil pequeño */}
          <span className="text-sm text-gray-600 hidden md:block">
            {usuario?.nombre || "Usuario"}
          </span>
        </div>

        {/* LOGOUT */}
        <button
          onClick={cerrarSesion}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
        >
          <FiLogOut size={15} />
        </button>

      </div>

    </header>
  )
}