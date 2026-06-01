import { useState } from "react"
import api from "../../api/api"
import { FiFileText, FiDownload } from "react-icons/fi"
import Table from "../../components/Table"

const ReporteApartados = () => {

  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [datos, setDatos] = useState([])

  // 🔥 GENERAR REPORTE
  const generarReporte = async () => {
    try {

      const res = await api.get("/reportes/apartados", {
        params: {
          ...(fechaInicio && { fecha_inicio: fechaInicio }),
          ...(fechaFin && { fecha_fin: fechaFin })
        }
      })

      setDatos(res.data)

    } catch (error) {
      console.error("Error generando reporte", error)
    }
  }

  // 🔥 EXCEL
  const descargarExcel = async () => {
    try {

      const res = await api.get("/reportes/apartados", {
        params: {
          ...(fechaInicio && { fecha_inicio: fechaInicio }),
          ...(fechaFin && { fecha_fin: fechaFin }),
          format: "xlsx"
        },
        responseType: "blob"
      })

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")

      link.href = url
      link.setAttribute("download", "apartados.xlsx")

      document.body.appendChild(link)
      link.click()

    } catch (error) {
      console.error("Error descargando Excel", error)
    }
  }

  // 🔥 PDF
  const descargarPDF = async () => {
    try {

      const res = await api.get("/reportes/apartados", {
        params: {
          ...(fechaInicio && { fecha_inicio: fechaInicio }),
          ...(fechaFin && { fecha_fin: fechaFin }),
          format: "pdf"
        },
        responseType: "blob"
      })

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")

      link.href = url
      link.setAttribute("download", "apartados.pdf")

      document.body.appendChild(link)
      link.click()

    } catch (error) {
      console.error("Error descargando PDF", error)
    }
  }

  // 🔥 COLUMNAS
  const columns = [
    {
      key: "fecha",
      label: "Fecha",
      render: (row) =>
        new Date(row.fecha).toLocaleDateString()
    },
    {
      key: "folio",
      label: "Folio"
    },
    {
      key: "numero_pedido",
      label: "No. Pedido"
    },
    {
      key: "sku",
      label: "SKU"
    },
    {
      key: "producto",
      label: "Producto"
    },
    {
      key: "modelo",
      label: "Modelo",
      render: (row) => row.modelo || "N/A"
    }
  ]

  return (

    <div className="p-4 sm:p-6">

      <h1 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center gap-2">
        <FiFileText />
        Reporte de Apartados
      </h1>

      {/* 🔥 FILTROS */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">

        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-auto"
        />

        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-auto"
        />

        <button
          onClick={generarReporte}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Generar reporte
        </button>

      </div>

      {/* 🔥 EXPORTAR */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">

        <button
          onClick={descargarExcel}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <FiDownload />
          Excel
        </button>

        <button
          onClick={descargarPDF}
          className="bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <FiDownload />
          PDF
        </button>

      </div>

      {/* 🔥 TABLA */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <Table columns={columns} data={datos} />
      </div>

    </div>

  )
}

export default ReporteApartados