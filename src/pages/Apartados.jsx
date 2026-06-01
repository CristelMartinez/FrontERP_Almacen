import { useEffect, useState } from "react"
import api from "../api/api"
import toast from "react-hot-toast"
import Table from "../components/Table"
import ModalApartado from "../components/apartados/ModalApartado"
import ModalDetalleApartado from "../components/apartados/ModalDetalleApartado"
import {
  FiPlus,
  FiSearch,
  FiX,
  FiEye,
  FiXCircle,
  FiCheckCircle,
  FiShoppingBag,
  FiClock,
  FiCheck,
} from "react-icons/fi"

/* ─── ESTADO BADGE ───────────────────────────────────────────── */
function EstadoApartado({ estado }) {
  const map = {
    activo: {
      label: "Activo",
      cls: "bg-amber-50 text-amber-700",
      dot: "bg-amber-400",
    },
    convertido: {
      label: "Convertido",
      cls: "bg-green-50 text-green-700",
      dot: "bg-green-500",
    },
    cancelado: {
      label: "Cancelado",
      cls: "bg-red-50 text-red-500",
      dot: "bg-red-400",
    },
  }

  const cfg = map[estado] ?? {
    label: estado,
    cls: "bg-gray-100 text-gray-500",
    dot: "bg-gray-400",
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

/* ─── APARTADOS ──────────────────────────────────────────────── */
export default function Apartados() {
  const [apartados, setApartados] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [cargando, setCargando] = useState(true)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarDetalle, setMostrarDetalle] = useState(false)
  const [detalle, setDetalle] = useState([])

  useEffect(() => { cargarApartados() }, [])

  const cargarApartados = async () => {
    setCargando(true)
    try {
      const res = await api.get("/apartados")
      setApartados(res.data)
    } catch {
      console.error("Error cargando apartados")
    } finally {
      setCargando(false)
    }
  }

  const verDetalle = async (id) => {
    try {
      const res = await api.get(`/apartados/${id}`)
      setDetalle(res.data)
      setMostrarDetalle(true)
    } catch {
      toast.error("Error cargando detalle del apartado")
    }
  }

  const cancelarApartado = async (id) => {
    try {
      await api.put(`/apartados/${id}/cancelar`)
      toast.success("Apartado cancelado")
      cargarApartados()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al cancelar apartado")
    }
  }

  const convertirApartado = async (id) => {
    try {
      await api.post(`/apartados/${id}/convertir`)
      toast.success("Apartado convertido a movimiento")
      cargarApartados()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al convertir apartado")
    }
  }

  /* FILTRO LOCAL */
  const datos = apartados.filter((a) => {
    if (!busqueda) return true
    const q = busqueda.toLowerCase()
    return (
      a.folio?.toLowerCase().includes(q) ||
      a.usuario?.toLowerCase().includes(q) ||
      a.estado?.toLowerCase().includes(q) ||
      new Date(a.fecha).toLocaleDateString().includes(q)
    )
  })

  /* CONTADORES */
  const totalActivos    = apartados.filter((a) => a.estado === "activo").length
  const totalConvertidos = apartados.filter((a) => a.estado === "convertido").length
  const totalCancelados  = apartados.filter((a) => a.estado === "cancelado").length

  const columns = [
    {
      key: "folio",
      label: "Folio",
      render: (row) => (
        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
          {row.folio}
        </span>
      ),
    },
    {
      key: "usuario",
      label: "Usuario",
      render: (row) => (
        <span className="text-gray-600">{row.usuario}</span>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => <EstadoApartado estado={row.estado} />,
    },
    {
      key: "total_productos",
      label: "Productos",
      render: (row) => (
        <span className="font-medium text-gray-700">{row.total_productos}</span>
      ),
    },
    {
      key: "fecha",
      label: "Fecha",
      render: (row) => (
        <span className="text-gray-400 text-xs">
          {new Date(row.fecha).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-1">

          {/* VER DETALLE */}
          <button
            onClick={() => verDetalle(row.id_apartado)}
            className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Ver detalle"
          >
            <FiEye size={14} />
          </button>

          {/* SOLO SI ACTIVO */}
          {row.estado === "activo" && (
            <>
              <button
                onClick={() => convertirApartado(row.id_apartado)}
                className="p-1.5 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 transition"
                title="Convertir a movimiento"
              >
                <FiCheckCircle size={14} />
              </button>
              <button
                onClick={() => cancelarApartado(row.id_apartado)}
                className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                title="Cancelar apartado"
              >
                <FiXCircle size={14} />
              </button>
            </>
          )}

        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">

      {/* ENCABEZADO */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Apartados</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Reservas de productos pendientes de despacho
          </p>
        </div>
        <button
          onClick={() => setMostrarModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition flex-shrink-0"
        >
          <FiPlus size={15} />
          Nuevo apartado
        </button>
      </div>

      {/* CONTADORES */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-lg">
          <FiClock size={13} />
          {totalActivos} activos
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-lg">
          <FiCheck size={13} />
          {totalConvertidos} convertidos
        </div>
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-500 text-xs font-medium px-3 py-1.5 rounded-lg">
          <FiX size={13} />
          {totalCancelados} cancelados
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="relative w-full sm:max-w-sm">
        <FiSearch
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
        />
        <input
          type="text"
          placeholder="Buscar por folio, usuario o estado..."
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
          {datos.length} {datos.length === 1 ? "apartado" : "apartados"}
          {busqueda && ` para "${busqueda}"`}
        </p>
      )}

      {/* MODALES */}
      {mostrarModal && (
        <ModalApartado
          cerrar={() => setMostrarModal(false)}
          recargar={cargarApartados}
        />
      )}

      {mostrarDetalle && (
        <ModalDetalleApartado
          cerrar={() => {
            setMostrarDetalle(false)
            setDetalle([])
          }}
          detalle={detalle}
        />
      )}

    </div>
  )
}