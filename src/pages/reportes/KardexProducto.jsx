import { useState } from "react"
import api from "../../api/api"
import { toast } from "react-hot-toast"
import { FiSearch, FiX } from "react-icons/fi"
import Table from "../../components/Table"
import ReporteLayout from "../../components/ReporteLayout"
import DateFilter from "../../components/DateFilter"

/* ─── BADGE TIPO MOVIMIENTO ──────────────────────────── */
function TipoBadge({ tipo }) {
  const entrada = tipo?.toLowerCase().includes("entrada")
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        entrada ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"
      }`}
    >
      {tipo}
    </span>
  )
}

/* ─── COLUMNAS ──────────────────────────────────────── */
const columns = [
  {
    key: "fecha",
    label: "Fecha",
    render: (row) => (
      <span className="text-xs text-gray-400">
        {new Date(row.fecha).toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    key: "tipo_movimiento",
    label: "Tipo",
    render: (row) => <TipoBadge tipo={row.tipo_movimiento} />,
  },
  {
    key: "sku",
    label: "SKU",
    render: (row) => (
      <span className="font-mono text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
        {row.sku || "—"}
      </span>
    ),
  },
  {
    key: "descripcion",
    label: "Producto",
    render: (row) => (
      <span className="text-gray-800 font-medium text-sm">{row.descripcion}</span>
    ),
  },
  {
    key: "cantidad",
    label: "Cantidad",
    render: (row) => <span className="text-gray-700">{row.cantidad}</span>,
  },
  {
    key: "costo_unitario",
    label: "Costo unitario",
    render: (row) =>
      row.costo_unitario == 0 ? (
        <span className="text-gray-300 text-xs">N/A</span>
      ) : (
        <span className="text-gray-600 text-sm">
          ${Number(row.costo_unitario).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
        </span>
      ),
  },
  {
    key: "costo_total",
    label: "Costo total",
    render: (row) =>
      row.costo_total == 0 ? (
        <span className="text-gray-300 text-xs">N/A</span>
      ) : (
        <span className="text-gray-700 font-medium text-sm">
          ${Number(row.costo_total).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
        </span>
      ),
  },
  {
    key: "stock_restante",
    label: "Stock",
    render: (row) => (
      <span className="text-gray-700 font-semibold">{row.stock_restante}</span>
    ),
  },
]

/* ─── BUSCADOR DE PRODUCTO ──────────────────────────── */
function BuscadorProducto({ seleccionado, onSeleccionar, onLimpiar }) {
  const [busqueda, setBusqueda] = useState("")
  const [resultados, setResultados] = useState([])

  const buscar = async (valor) => {
    setBusqueda(valor)
    if (!valor.trim()) { setResultados([]); return }
    try {
      const res = await api.get(`/productos/buscar?q=${valor}`)
      setResultados(res.data)
    } catch {
      setResultados([])
    }
  }

  const limpiar = () => {
    setBusqueda("")
    setResultados([])
    onLimpiar()
  }

  if (seleccionado) {
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Producto
        </label>
        <div className="flex items-center gap-2 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm text-blue-700 font-medium flex-1 truncate">
            {seleccionado.nombre_completo || seleccionado.nombre}
          </span>
          <button
            onClick={limpiar}
            className="text-blue-400 hover:text-blue-600 transition"
          >
            <FiX size={14} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1.5 relative">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Producto
      </label>
      <div className="relative">
        <FiSearch
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
        />
        <input
          value={busqueda}
          onChange={(e) => buscar(e.target.value)}
          placeholder="Buscar por nombre o SKU…"
          className="w-64 pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
        />
      </div>

      {busqueda && resultados.length > 0 && (
        <div className="absolute z-20 top-full mt-1 left-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {resultados.map((p) => (
            <div
              key={p.id_producto}
              onClick={() => {
                onSeleccionar(p)
                setBusqueda("")
                setResultados([])
              }}
              className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 transition border-b border-gray-50 last:border-0"
            >
              <p className="font-medium">
                {p.nombre_completo || p.nombre}
              </p>
              {p.sku && (
                <p className="text-xs text-gray-400 mt-0.5">{p.sku}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── PÁGINA PRINCIPAL ──────────────────────────────── */
export default function KardexProducto() {
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [datos, setDatos] = useState([])
  const [cargando, setCargando] = useState(false)

  const params = () => ({
    id_producto: productoSeleccionado?.id_producto,
    ...(fechaInicio && { fecha_inicio: fechaInicio }),
    ...(fechaFin && { fecha_fin: fechaFin }),
  })

  const generarReporte = async () => {
    if (!productoSeleccionado) {
      toast.error("Selecciona un producto primero")
      return
    }
    setCargando(true)
    try {
      const res = await api.get("/reportes/kardex", { params: params() })
      setDatos(res.data)
    } catch {
      toast.error("Error generando reporte")
    } finally {
      setCargando(false)
    }
  }

  const descargar = async (format, nombre) => {
    if (!productoSeleccionado) {
      toast.error("Selecciona un producto primero")
      return
    }
    try {
      const res = await api.get("/reportes/kardex", {
        params: { ...params(), format },
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", nombre)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch {
      toast.error(`Error al descargar ${format.toUpperCase()}`)
    }
  }

  return (
    <ReporteLayout
      titulo="Kardex por producto"
      subtitulo="Detalle de movimientos de un producto en un período"
      onExcelClick={datos.length ? () => descargar("xlsx", "kardex.xlsx") : null}
      onPDFClick={datos.length ? () => descargar("pdf", "kardex.pdf") : null}
      filtros={
        <>
          <BuscadorProducto
            seleccionado={productoSeleccionado}
            onSeleccionar={setProductoSeleccionado}
            onLimpiar={() => { setProductoSeleccionado(null); setDatos([]) }}
          />
          <DateFilter
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            onChangeInicio={setFechaInicio}
            onChangeFin={setFechaFin}
            onGenerar={generarReporte}
            cargando={cargando}
          />
        </>
      }
    >
      {cargando ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : !productoSeleccionado ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <p className="text-sm text-gray-400">Selecciona un producto para generar el kardex</p>
        </div>
      ) : (
        <Table columns={columns} data={datos} />
      )}
    </ReporteLayout>
  )
}
