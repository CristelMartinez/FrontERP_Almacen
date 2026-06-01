import { useState } from "react"
import api from "../../api/api"
import { toast } from "react-hot-toast"
import Table from "../../components/Table"
import ReporteLayout from "../../components/ReporteLayout"
import DateFilter from "../../components/DateFilter"

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
    key: "producto",
    label: "Producto",
    render: (row) => (
      <span className="text-gray-800 font-medium text-sm">{row.producto}</span>
    ),
  },
  {
    key: "cantidad",
    label: "Cantidad",
    render: (row) => <span className="text-gray-700">{row.cantidad}</span>,
  },
  {
    key: "costo_unitario",
    label: "Costo",
    render: (row) => (
      <span className="text-gray-600 text-sm">
        ${Number(row.costo_unitario ?? 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
      </span>
    ),
  },
  {
    key: "almacen",
    label: "Almacén",
    render: (row) => (
      <span className="text-xs text-gray-500">{row.almacen || "—"}</span>
    ),
  },
]

export default function ReporteMovimientos() {
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
      const res = await api.get("/reportes/movimientos", { params: params() })
      setDatos(res.data)
    } catch {
      toast.error("Error generando reporte")
    } finally {
      setCargando(false)
    }
  }

  const descargar = async (format, nombre) => {
    try {
      const res = await api.get("/reportes/movimientos", {
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
      titulo="Movimientos"
      subtitulo="Entradas y salidas por rango de fechas"
      onExcelClick={datos.length ? () => descargar("xlsx", "movimientos.xlsx") : null}
      onPDFClick={datos.length ? () => descargar("pdf", "movimientos.pdf") : null}
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