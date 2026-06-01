import { useEffect, useState } from "react"
import api from "../api/api"
import toast from "react-hot-toast"
import Table from "../components/Table"
import ModalMovimiento from "../components/movimientos/ModalMovimiento"
import ModalEntradaMovimiento from "../components/movimientos/ModalEntradaMovimiento"
import ModalSalidaMovimiento from "../components/movimientos/ModalSalidaMovimiento"
import ModalDetalleMovimiento from "../components/movimientos/ModalDetalleMovimiento"
import {
  FiSearch,
  FiX,
  FiArrowDownCircle,
  FiArrowUpCircle,
} from "react-icons/fi"

/* ─── BADGE TIPO ─────────────────────────────────────────────── */
function TipoBadge({ tipo }) {
  const upper = tipo?.toUpperCase()

  if (upper === "ENTRADA")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Entrada
      </span>
    )

  if (upper === "SALIDA")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-500">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        Salida
      </span>
    )

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
      {tipo}
    </span>
  )
}

/* ─── MOVIMIENTOS ────────────────────────────────────────────── */
export default function Movimientos() {
  const [movimientos, setMovimientos] = useState([])
  const [tiposMovimiento, setTiposMovimiento] = useState([])
  const [almacenes, setAlmacenes] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [cargando, setCargando] = useState(true)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarEntrada, setMostrarEntrada] = useState(false)
  const [mostrarSalida, setMostrarSalida] = useState(false)
  const [mostrarDetalle, setMostrarDetalle] = useState(false)
  const [detalleMovimiento, setDetalleMovimiento] = useState(null)

  useEffect(() => {
    cargarCatalogos()
    cargarMovimientos()
  }, [])

  const cargarCatalogos = async () => {
    try {
      const res = await api.get("/catalogos")
      setTiposMovimiento(res.data.tipos_movimiento)
      setAlmacenes(res.data.almacenes)
      setProveedores(res.data.proveedores)
      setProductos(res.data.productos)
    } catch (error) {
      console.error("Error cargando catálogos", error)
    }
  }

  const cargarMovimientos = async () => {
    setCargando(true)
    try {
      const res = await api.get("/movimientos?limit=20")
      setMovimientos(res.data)
    } catch (error) {
      console.error("Error cargando movimientos", error)
    } finally {
      setCargando(false)
    }
  }

  const verDetalle = async (id) => {
    try {
      const res = await api.get(`/movimientos/${id}/detalle`)
      const base = movimientos.find((m) => m.id_movimiento === id)
      setDetalleMovimiento({ ...base, detalles: res.data })
      setMostrarDetalle(true)
    } catch {
      toast.error("Error al obtener el detalle del movimiento")
    }
  }

  /* FILTRO LOCAL */
  const datos = movimientos.filter((m) => {
    if (!busqueda) return true
    const q = busqueda.toLowerCase()
    return (
      m.folio?.toLowerCase().includes(q) ||
      m.usuario?.toLowerCase().includes(q) ||
      m.tipo_movimiento?.toLowerCase().includes(q) ||
      (m.numero_pedido || "").toLowerCase().includes(q) ||
      new Date(m.fecha).toLocaleDateString().includes(q)
    )
  })

  /* CONTADORES */
  const totalEntradas = movimientos.filter(
    (m) => m.tipo_movimiento?.toUpperCase() === "ENTRADA"
  ).length

  const totalSalidas = movimientos.filter(
    (m) => m.tipo_movimiento?.toUpperCase() === "SALIDA"
  ).length

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
      key: "tipo_movimiento",
      label: "Tipo",
      render: (row) => <TipoBadge tipo={row.tipo_movimiento} />,
    },
    {
      key: "usuario",
      label: "Usuario",
      render: (row) => (
        <span className="text-gray-600">{row.usuario}</span>
      ),
    },
    {
      key: "numero_pedido",
      label: "Pedido",
      render: (row) => (
        <span className="text-gray-400">{row.numero_pedido || "—"}</span>
      ),
    },
    {
      key: "fecha",
      label: "Fecha",
      render: (row) => (
        <span className="text-gray-500 text-xs">
          {new Date(row.fecha).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">

      {/* ENCABEZADO */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Movimientos</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Historial de entradas y salidas del almacén
          </p>
        </div>

        {/* BOTONES ENTRADA / SALIDA */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setMostrarEntrada(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
          >
            <FiArrowDownCircle size={15} />
            Entrada
          </button>
          <button
            onClick={() => setMostrarSalida(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
          >
            <FiArrowUpCircle size={15} />
            Salida
          </button>
        </div>
      </div>

      {/* CONTADORES RÁPIDOS */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-lg">
          <FiArrowDownCircle size={13} />
          {totalEntradas} entradas
        </div>
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs font-medium px-3 py-1.5 rounded-lg">
          <FiArrowUpCircle size={13} />
          {totalSalidas} salidas
        </div>
        <span className="text-xs text-gray-400">
          Últimos 20 movimientos
        </span>
      </div>

      {/* BUSCADOR */}
      <div className="relative max-w-sm">
        <FiSearch
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
        />
        <input
          type="text"
          placeholder="Buscar por folio, usuario, tipo o pedido..."
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
          <Table
            columns={columns}
            data={datos}
            onRowClick={(row) => verDetalle(row.id_movimiento)}
          />
        )}
      </div>

      {/* CONTADOR */}
      {!cargando && datos.length > 0 && (
        <p className="text-xs text-gray-400">
          {datos.length} {datos.length === 1 ? "movimiento" : "movimientos"}
          {busqueda && ` para "${busqueda}"`}
        </p>
      )}

      {/* HINT CLICK */}
      {!cargando && datos.length > 0 && (
        <p className="text-xs text-gray-300 -mt-3">
          Haz clic en cualquier fila para ver el detalle del movimiento
        </p>
      )}

      {/* MODALES */}
      {mostrarModal && (
        <ModalMovimiento
          cerrar={() => {
            setMostrarModal(false)
          }}
          tiposMovimiento={tiposMovimiento}
          almacenes={almacenes}
          proveedores={proveedores}
          productos={productos}
          recargar={cargarMovimientos}
        />
      )}

      {mostrarEntrada && (
        <ModalEntradaMovimiento
          cerrar={() => setMostrarEntrada(false)}
          recargar={cargarMovimientos}
        />
      )}

      {mostrarSalida && (
        <ModalSalidaMovimiento
          cerrar={() => setMostrarSalida(false)}
          recargar={cargarMovimientos}
        />
      )}

      {mostrarDetalle && detalleMovimiento && (
        <ModalDetalleMovimiento
          data={detalleMovimiento}
          cerrar={() => {
            setMostrarDetalle(false)
            setDetalleMovimiento(null)
          }}
        />
      )}

    </div>
  )
}