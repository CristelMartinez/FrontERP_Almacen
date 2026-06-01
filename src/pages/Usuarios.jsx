import { useEffect, useState } from "react"
import api from "../api/api"
import toast from "react-hot-toast"
import Table from "../components/Table"
import EstadoBadge from "../components/EstadoBadge"
import ModalUsuario from "../components/usuarios/ModalUsuario"
import ModalCambiarPassword from "../components/usuarios/ModalCambiarPassword"
import ModalEliminarUsuario from "../components/usuarios/ModalEliminarUsuario"
import {
  FiPlus,
  FiSearch,
  FiX,
  FiEdit2,
  FiKey,
  FiTrash2,
  FiRefreshCw,
  FiUsers,
} from "react-icons/fi"

/* ─── ROL BADGE ──────────────────────────────────────────────── */
function RolBadge({ rol }) {
  const esAdmin = rol?.toLowerCase() === "administrador" || rol?.toLowerCase() === "admin"

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        esAdmin
          ? "bg-blue-50 text-blue-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {rol}
    </span>
  )
}

/* ─── AVATAR ─────────────────────────────────────────────────── */
function Avatar({ nombre }) {
  const iniciales = nombre
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("") || "U"

  return (
    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
      <span className="text-[11px] font-semibold text-blue-700">{iniciales}</span>
    </div>
  )
}

/* ─── USUARIOS ───────────────────────────────────────────────── */
export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [cargando, setCargando] = useState(true)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [mostrarModalPassword, setMostrarModalPassword] = useState(false)
  const [usuarioPassword, setUsuarioPassword] = useState(null)
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false)
  const [usuarioEliminar, setUsuarioEliminar] = useState(null)

  const token = JSON.parse(atob(localStorage.getItem("token").split(".")[1]))
  const esAdmin = token.id_rol === 1

  useEffect(() => { cargarUsuarios() }, [])

  const cargarUsuarios = async () => {
    setCargando(true)
    try {
      const res = await api.get("/usuarios")
      setUsuarios(res.data)
    } catch {
      console.error("Error cargando usuarios")
    } finally {
      setCargando(false)
    }
  }

  const toggleUsuario = async (usuario) => {
    try {
      if (usuario.activo) {
        await api.delete(`/usuarios/${usuario.id_usuario}`)
        toast.success("Usuario desactivado")
      } else {
        await api.put(`/usuarios/${usuario.id_usuario}/activar`)
        toast.success("Usuario reactivado")
      }
      cargarUsuarios()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error actualizando usuario")
    }
  }

  const eliminarUsuario = async () => {
    try {
      await api.delete(`/usuarios/${usuarioEliminar.id_usuario}`)
      toast.success("Usuario desactivado correctamente")
      setMostrarModalEliminar(false)
      cargarUsuarios()
    } catch {
      toast.error("Error desactivando usuario")
    }
  }

  /* FILTRO LOCAL */
  const datos = usuarios.filter((u) => {
    if (!busqueda) return true
    const q = busqueda.toLowerCase()
    return (
      u.nombre?.toLowerCase().includes(q) ||
      u.correo?.toLowerCase().includes(q) ||
      u.rol?.toLowerCase().includes(q)
    )
  })

  /* CONTADORES */
  const totalActivos   = usuarios.filter((u) => u.activo).length
  const totalInactivos = usuarios.filter((u) => !u.activo).length

  const columns = [
    {
      key: "nombre",
      label: "Usuario",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar nombre={row.nombre} />
          <div>
            <p className="text-sm text-gray-700 font-medium leading-tight">{row.nombre}</p>
            <p className="text-xs text-gray-400 leading-tight">{row.correo}</p>
          </div>
        </div>
      ),
    },
    {
      key: "rol",
      label: "Rol",
      render: (row) => <RolBadge rol={row.rol} />,
    },
    {
      key: "activo",
      label: "Estado",
      render: (row) => <EstadoBadge activo={row.activo} />,
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-1">

          {/* EDITAR */}
          <button
            onClick={() => {
              setUsuarioSeleccionado(row)
              setMostrarModal(true)
            }}
            className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Editar usuario"
          >
            <FiEdit2 size={14} />
          </button>

          {/* CAMBIAR CONTRASEÑA — solo admin */}
          {esAdmin && (
            <button
              onClick={() => {
                setUsuarioPassword(row)
                setMostrarModalPassword(true)
              }}
              className="p-1.5 rounded-md text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition"
              title="Cambiar contraseña"
            >
              <FiKey size={14} />
            </button>
          )}

          {/* TOGGLE ACTIVO / INACTIVO */}
          {row.activo ? (
            <button
              onClick={() => toggleUsuario(row)}
              className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
              title="Desactivar usuario"
            >
              <FiTrash2 size={14} />
            </button>
          ) : (
            <button
              onClick={() => toggleUsuario(row)}
              className="p-1.5 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 transition"
              title="Reactivar usuario"
            >
              <FiRefreshCw size={14} />
            </button>
          )}

        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">

      {/* ENCABEZADO */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Usuarios</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Gestión de acceso y roles del sistema
          </p>
        </div>
        <button
          onClick={() => {
            setUsuarioSeleccionado(null)
            setMostrarModal(true)
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition flex-shrink-0"
        >
          <FiPlus size={15} />
          Nuevo usuario
        </button>
      </div>

      {/* CONTADORES */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg">
          <FiUsers size={13} />
          {usuarios.length} en total
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          {totalActivos} activos
        </div>
        {totalInactivos > 0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-500 text-xs font-medium px-3 py-1.5 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            {totalInactivos} inactivos
          </div>
        )}
      </div>

      {/* BUSCADOR */}
      <div className="relative max-w-sm">
        <FiSearch
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
        />
        <input
          type="text"
          placeholder="Buscar por nombre, correo o rol..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-9 pr-9 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
        />
        {busqueda && (
          <button
            onClick={() => setBusqueda("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
          >
            <FiX size={13} />
          </button>
        )}
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl border border-gray-100">
        {cargando ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <Table columns={columns} data={datos} />
        )}
      </div>

      {/* CONTADOR */}
      {!cargando && datos.length > 0 && (
        <p className="text-xs text-gray-400">
          {datos.length} {datos.length === 1 ? "usuario" : "usuarios"}
          {busqueda && ` para "${busqueda}"`}
        </p>
      )}

      {/* MODALES */}
      {mostrarModal && (
        <ModalUsuario
          cerrar={() => {
            setMostrarModal(false)
            setUsuarioSeleccionado(null)
          }}
          recargar={cargarUsuarios}
          usuario={usuarioSeleccionado}
        />
      )}

      {mostrarModalPassword && (
        <ModalCambiarPassword
          cerrar={() => {
            setMostrarModalPassword(false)
            setUsuarioPassword(null)
          }}
          usuario={usuarioPassword}
        />
      )}

      {mostrarModalEliminar && (
        <ModalEliminarUsuario
          usuario={usuarioEliminar}
          cerrar={() => {
            setMostrarModalEliminar(false)
            setUsuarioEliminar(null)
          }}
          confirmar={eliminarUsuario}
        />
      )}

    </div>
  )
}