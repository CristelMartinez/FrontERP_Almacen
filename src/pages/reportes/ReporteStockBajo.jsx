import { useEffect, useState } from "react"
import api from "../../api/api"
import { toast } from "react-hot-toast"
import Table from "../../components/Table"
import ReporteLayout from "../../components/ReporteLayout"

function StockBadge({ stock, minimo }) {
  const n = Number(stock)
  const m = Number(minimo)

  if (n === 0)
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
        {n} — Agotado
      </span>
    )

  if (n <= m)
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
        {n} — Bajo mínimo
      </span>
    )

  return <span className="text-gray-700">{n}</span>
}

const columns = [
  {
    key: "producto",
    label: "Producto",
    render: (row) => (
      <span className="text-gray-800 font-medium text-sm">{row.producto}</span>
    ),
  },
  {
    key: "almacen",
    label: "Almacén",
    render: (row) => (
      <span className="text-xs text-gray-500">{row.almacen || "—"}</span>
    ),
  },
  {
    key: "stock_actual",
    label: "Stock actual",
    render: (row) => (
      <StockBadge stock={row.stock_actual} minimo={row.stock_minimo} />
    ),
  },
  {
    key: "stock_minimo",
    label: "Stock mínimo",
    render: (row) => (
      <span className="text-xs text-gray-500">{row.stock_minimo}</span>
    ),
  },
]

const descargar = async (format, nombre) => {
  try {
    const res = await api.get(`/reportes/stock-bajo?format=${format}`, {
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

export default function ReporteStockBajo() {
  const [data, setData] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    obtenerReporte()
  }, [])

  const obtenerReporte = async () => {
    setCargando(true)
    try {
      const res = await api.get("/reportes/stock-bajo")
      setData(res.data)
    } catch {
      toast.error("Error al cargar reporte")
    } finally {
      setCargando(false)
    }
  }

  return (
    <ReporteLayout
      titulo="Stock bajo"
      subtitulo={
        data.length > 0
          ? `${data.length} producto${data.length !== 1 ? "s" : ""} requieren reposición`
          : "Productos que requieren reposición"
      }
      onExcelClick={() => descargar("xlsx", "reporte_stock_bajo.xlsx")}
      onPDFClick={() => descargar("pdf", "reporte_stock_bajo.pdf")}
    >
      {cargando ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <Table columns={columns} data={data} />
      )}
    </ReporteLayout>
  )
}