import { NavLink } from "react-router-dom"
import {
  FiHome,
  FiBox,
  FiBarChart2,
  FiRepeat,
  FiUsers,
  FiFileText,
  FiSettings,
  FiShoppingBag,
  FiChevronRight,
} from "react-icons/fi"

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      isActive
        ? "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 transition-all"
        : "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all"
    }
  >
    {({ isActive }) => (
      <>
        <Icon
          size={16}
          className={isActive ? "text-blue-600" : "text-gray-400"}
        />
        <span className="flex-1">{label}</span>
        {isActive && (
          <FiChevronRight size={13} className="text-blue-400 opacity-70" />
        )}
      </>
    )}
  </NavLink>
)

const SectionLabel = ({ children }) => (
  <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 select-none">
    {children}
  </p>
)

export default function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-100 flex flex-col py-4">

      {/* LOGO / MARCA */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
            <FiBox size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 leading-tight">ERP Almacén</p>
            <p className="text-[10px] text-gray-400 leading-tight">Viveza Textil</p>
          </div>
        </div>
      </div>

      {/* NAV PRINCIPAL */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3">

        <SectionLabel>Principal</SectionLabel>

        <NavItem to="/dashboard"   icon={FiHome}      label="Dashboard"   />
        <NavItem to="/productos"   icon={FiBox}       label="Productos"   />
        <NavItem to="/inventario"  icon={FiBarChart2} label="Inventario"  />
        <NavItem to="/movimientos" icon={FiRepeat}    label="Movimientos" />
        <NavItem to="/apartados"   icon={FiShoppingBag} label="Apartados" />

        <SectionLabel>Sistema</SectionLabel>

        <NavItem to="/reportes"    icon={FiFileText}  label="Reportes"    />
        <NavItem to="/usuarios"    icon={FiUsers}     label="Usuarios"    />

        <div className="my-2 border-t border-gray-100" />

        <NavItem to="/configuracion" icon={FiSettings} label="Configuración" />

      </nav>

      {/* VERSIÓN */}
      <div className="px-4 pt-4">
        <p className="text-[10px] text-gray-300 select-none">v1.0.0</p>
      </div>

    </aside>
  )
}