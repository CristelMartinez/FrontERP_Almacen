import { useState } from "react"
import api from "../../api/api"
import { toast } from "react-hot-toast"
import Table from "../../components/Table"
import ReporteLayout from "../../components/ReporteLayout"
import DateFilter from "../../components/DateFilter"

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
    key: "folio",
    label: "Folio",
    render: (row) => (
      <span className="font-mono text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded">
        {row.folio || "—"}
      </span>
    ),
  },
  {
    key: "numero_pedido",
    label: "No. Pedido",
    render: (row) => (
      <span className="text-xs text-gray-500">{row.numero_pedido || "—"}</span>
    ),
  },
  {
    key: "sku",
    label: "SKU",
    render: (row) => (
      <span className="font-mono text-xs text-gray-500">{row.sku || "—"}</span>
    ),
  },
  {
    key: "producto",
    label: "Producto",
    render: (row) => (
      <div>
        <p className="text-gray-800 font-medium text-sm">{row.producto}</p>
        {row.modelo && (
          <p className="text-gray-400 text-xs mt-0.5">{row.modelo}</p>
        )}
      </div>
    ),
  },
]

export default function ReporteApartados() {
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [datos, setDatos] = useState([])
  const [cargando, setCargando] = useState(false)

  const params = () => ({
    ...(fechaInicio && { fecha_inicio: fechaInicio }),
    ...(fechaFin && { fecha_fin: fechaFin }),
  })

  const generarReporte = async () => {
    setCargando(true)
    try {
      const res = await api.get("/reportes/apartados", { params: params() })
      setDatos(res.data)
    } catch {
      toast.error("Error generando reporte")
    } finally {
      setCargando(false)
    }
  }

  const descargar = async (format, nombre) => {
    try {
      const res = await api.get("/reportes/apartados", {
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
      titulo="Apartados"
      subtitulo="Detalle de apartados realizados por rango de fechas"
      onExcelClick={datos.length ? () => descargar("xlsx", "apartados.xlsx") : null}
      onPDFClick={datos.length ? () => descargar("pdf", "apartados.pdf") : null}
      filtros={
        <DateFilter
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          onChangeInicio={setFechaInicio}
          onChangeFin={setFechaFin}
          onGenerar={generarReporte}
          cargando={cargando}
        />
      }
    >
      {cargando ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <Table columns={columns} data={datos} />
      )}
    </ReporteLayout>
  )
}
