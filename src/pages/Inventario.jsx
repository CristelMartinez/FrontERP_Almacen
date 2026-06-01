import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import api from "../api/api"
import Table from "../components/Table"
import ModalAjustarStock from "../components/movimientos/ModalAjustarStock"
import { FiSliders, FiSearch, FiX, FiAlertTriangle } from "react-icons/fi"

/* ─── ESTADO DE STOCK ────────────────────────────────────────── */
function EstadoStock({ stock, minimo }) {
  const n = Number(stock)
  const m = Number(minimo)

  if (n === 0)
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        Sin stock
      </span>
    )

  if (n <= m)
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        Bajo
      </span>
    )

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
      OK
    </span>
  )
}

/* ─── INVENTARIO ─────────────────────────────────────────────── */
export default function Inventario() {
  const [inventario, setInventario] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [mostrarModal, setMostrarModal] = useState(false)
  const [cargando, setCargando] = useState(true)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const filtroStock = searchParams.get("stock")

  const cargarInventario = async () => {
    setCargando(true)
    try {
      const res = filtroStock === "bajo"
        ? await api.get("/productos/stock-bajo")
        : await api.get("/inventario")
      setInventario(res.data)
    } catch (error) {
      console.error("Error cargando inventario", error)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargarInventario() }, [filtroStock])

  /* FILTRO LOCAL POR BÚSQUEDA */
  const datos = inventario.filter((item) => {
    if (!busqueda) return true
    const q = busqueda.toLowerCase()
    return (
      item.producto?.toLowerCase().includes(q) ||
      item.codigo_barras?.toLowerCase().includes(q) ||
      item.categoria?.toLowerCase().includes(q)
    )
  })

  const columns = [
    {
      key: "producto",
      label: "Producto",
    },
    {
      key: "codigo_barras",
      label: "Cód. barras",
      render: (row) =>
        row.codigo_barras ? (
          <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {row.codigo_barras}
          </span>
        ) : (
          <span className="text-gray-300">—</span>
        ),
    },
    {
      key: "categoria",
      label: "Categoría",
      render: (row) => (
        <span className="text-gray-500">{row.categoria || "—"}</span>
      ),
    },
    {
      key: "stock_actual",
      label: "Stock",
      render: (row) => (
        <span className="font-medium text-gray-700">{row.stock_actual}</span>
      ),
    },
    {
      key: "stock_apartado",
      label: "Apartado",
      render: (row) => (
        <span className="text-gray-400">{row.stock_apartado ?? 0}</span>
      ),
    },
    {
      key: "stock_disponible",
      label: "Disponible",
      render: (row) => (
        <span className="font-semibold text-blue-600">{row.stock_disponible}</span>
      ),
    },
    {
      key: "stock_minimo",
      label: "Mínimo",
      render: (row) => (
        <span className="text-gray-400">{row.stock_minimo}</span>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => (
        <EstadoStock stock={row.stock_actual} minimo={row.stock_minimo} />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">

      {/* ENCABEZADO */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Inventario</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Stock actual, apartado y disponible por producto
          </p>
        </div>

        <button
          onClick={() => setMostrarModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition flex-shrink-0"
        >
          <FiSliders size={14} />
          Ajustar stock
        </button>
      </div>

      {/* FILTRO STOCK BAJO */}
      {filtroStock === "bajo" && (
        <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-2.5 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <FiAlertTriangle size={14} className="text-red-500 flex-shrink-0" />
            Mostrando solo productos con stock bajo o agotado
          </div>
          <button
            onClick={() => navigate("/inventario")}
            className="flex items-center gap-1 text-xs font-medium text-red-600 bg-white border border-red-200 px-3 py-1 rounded-md hover:bg-red-50 transition flex-shrink-0"
          >
            <FiX size={12} />
            Quitar filtro
          </button>
        </div>
      )}

      {/* BUSCADOR */}
      <div className="relative max-w-sm">
        <FiSearch
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
        />
        <input
          type="text"
          placeholder="Buscar por producto, categoría o código..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
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

      {/* RESUMEN */}
      {!cargando && datos.length > 0 && (
        <p className="text-xs text-gray-400">
          {datos.length} {datos.length === 1 ? "producto" : "productos"} encontrados
          {busqueda && ` para "${busqueda}"`}
        </p>
      )}

      {/* MODAL */}
      {mostrarModal && (
        <ModalAjustarStock
          cerrar={() => setMostrarModal(false)}
          recargar={cargarInventario}
        />
      )}

    </div>
  )
}