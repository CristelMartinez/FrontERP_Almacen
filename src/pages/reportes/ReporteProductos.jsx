import { useEffect, useState } from "react"
import api from "../../api/api"
import { toast } from "react-hot-toast"
import Table from "../../components/Table"
import EstadoBadge from "../../components/EstadoBadge"
import ReporteLayout from "../../components/ReporteLayout"

const columns = [
  {
    key: "nombre",
    label: "Producto",
    render: (row) => (
      <span className="text-gray-800 font-medium text-sm">{row.nombre}</span>
    ),
  },
  {
    key: "categoria",
    label: "Categoría",
    render: (row) => (
      <span className="text-xs text-gray-500">{row.categoria || "—"}</span>
    ),
  },
  {
    key: "precio",
    label: "Precio",
    render: (row) => (
      <span className="text-gray-700 font-medium">
        ${Number(row.precio).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
      </span>
    ),
  },
  {
    key: "stock_minimo",
    label: "Stock mínimo",
    render: (row) => (
      <span className="text-xs text-gray-500">{row.stock_minimo}</span>
    ),
  },
  {
    key: "activo",
    label: "Estado",
    render: (row) => <EstadoBadge activo={row.activo} />,
  },
]

const descargar = async (format, nombre) => {
  try {
    const res = await api.get(`/reportes/productos?format=${format}`, {
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

export default function ReporteProductos() {
  const [data, setData] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    obtenerReporte()
  }, [])

  const obtenerReporte = async () => {
    setCargando(true)
    try {
      const res = await api.get("/reportes/productos")
      setData(res.data)
    } catch {
      toast.error("Error al cargar reporte de productos")
    } finally {
      setCargando(false)
    }
  }

  return (
    <ReporteLayout
      titulo="Productos"
      subtitulo="Catálogo completo con precios y estado"
      onExcelClick={() => descargar("xlsx", "reporte_productos.xlsx")}
      onPDFClick={() => descargar("pdf", "reporte_productos.pdf")}
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