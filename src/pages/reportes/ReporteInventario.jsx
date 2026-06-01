import { useEffect, useState } from "react"
import api from "../../api/api"
import { toast } from "react-hot-toast"
import Table from "../../components/Table"
import ReporteLayout from "../../components/ReporteLayout"

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
      <span className="font-semibold text-gray-800">{row.stock_actual}</span>
    ),
  },
  {
    key: "stock_disponible",
    label: "Stock disponible",
    render: (row) => (
      <span className="text-gray-600">{row.stock_disponible ?? "—"}</span>
    ),
  },
]

const descargar = async (format, nombre) => {
  try {
    const res = await api.get(`/reportes/inventario?format=${format}`, {
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

export default function ReporteInventario() {
  const [data, setData] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    obtenerReporte()
  }, [])

  const obtenerReporte = async () => {
    setCargando(true)
    try {
      const res = await api.get("/reportes/inventario")
      setData(res.data)
    } catch {
      toast.error("Error al cargar el reporte")
    } finally {
      setCargando(false)
    }
  }

  return (
    <ReporteLayout
      titulo="Inventario"
      subtitulo="Stock actual de productos por almacén"
      onExcelClick={() => descargar("xlsx", "reporte_inventario.xlsx")}
      onPDFClick={() => descargar("pdf", "reporte_inventario.pdf")}
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