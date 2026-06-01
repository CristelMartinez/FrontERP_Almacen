import { useState, useEffect } from "react"
import api from "../../api/api"
import { FiFileText } from "react-icons/fi"
import Table from "../../components/Table"
import { toast } from "react-hot-toast"

const KardexProducto = () => {

    const [fechaInicio, setFechaInicio] = useState("")
    const [fechaFin, setFechaFin] = useState("")
    const [productos, setProductos] = useState([])
    const [datos, setDatos] = useState([])

    const [busqueda, setBusqueda] = useState("")
    const [resultados, setResultados] = useState([])
    const [productoSeleccionado, setProductoSeleccionado] = useState(null)

    const buscarProducto = async (valor) => {
        if (!valor) {
            setResultados([])
            return
        }

        try {
            const res = await api.get(`/productos/buscar?q=${valor}`)
            setResultados(res.data)
        } catch (error) {
            console.error(error)
        }
    }


    // 🔥 GENERAR REPORTE
    const generarReporte = async () => {
        try {

            if (!productoSeleccionado) {
                toast.error("Selecciona un producto")
                return
            }

            const res = await api.get(
                `/reportes/kardex`,
                {
                    params: {
                        id_producto: productoSeleccionado.id_producto,
                        ...(fechaInicio && { fecha_inicio: fechaInicio }),
                        ...(fechaFin && { fecha_fin: fechaFin })
                    }
                }
            )

            console.log("KARDEX:", res.data)
            setDatos(res.data)

        } catch (error) {
            console.error("Error generando kardex", error)
            toast.error("Error generando reporte")
        }
    }
    const formatearFecha = (fecha) => {
        const f = new Date(fecha)
        return f.toLocaleDateString("es-MX") + " " + f.toLocaleTimeString("es-MX")
    }

    const descargarExcel = async () => {
        const res = await api.get(
            `/reportes/kardex`,
            {
                params: {
                    id_producto: productoSeleccionado.id_producto,
                    ...(fechaInicio && { fecha_inicio: fechaInicio }),
                    ...(fechaFin && { fecha_fin: fechaFin }),
                    format: "xlsx"
                },
                responseType: "blob"
            }
        )

        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", "kardex.xlsx")
        link.click()
    }
    const descargarPDF = async () => {
        try {

            if (!productoSeleccionado) {
                alert("Selecciona un producto")
                return
            }

            const res = await api.get( 
                `/reportes/kardex/`,
                {
                    params: {
                        id_producto: productoSeleccionado.id_producto,
                        ...(fechaInicio && { fecha_inicio: fechaInicio }),
                        ...(fechaFin && { fecha_fin: fechaFin }),
                        format: "pdf"
                    },
                    responseType: "blob"
                }
            )

            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement("a")

            link.href = url
            link.setAttribute("download", "kardex.pdf")

            document.body.appendChild(link)
            link.click()

        } catch (error) {
            console.error("Error descargando PDF", error)
        }
    }

    // 🔥 COLUMNAS (igual estilo que movimientos)
    const columns = [
        {
            key: "fecha",
            label: "Fecha",
            render: (row) =>
                new Date(row.fecha).toLocaleDateString()
        },
        {
            key: "tipo_movimiento",
            label: "Tipo",
            render: (row) => (
                <span
                    className={`
            font-medium
            ${row.tipo_movimiento === "ENTRADA" ? "text-green-600" : ""}
            ${row.tipo_movimiento === "SALIDA" ? "text-red-600" : ""}
          `}
                >
                    {row.tipo_movimiento}
                </span>
            )
        },
        {
            key: "sku",
            label: "SKU"
        },
        {
            key: "descripcion",
            label: "Producto"
        },
        {
            key: "cantidad",
            label: "Cantidad"
        },
        {
            key: "costo_unitario",
            label: "Costo Unitario",
            render: (row) =>
                row.costo_unitario == 0 ? "N/A" : `$${row.costo_unitario}`
        },
        {
            key: "costo_total",
            label: "Costo Total",
            render: (row) =>
                row.costo_total == 0 ? "N/A" : `$${row.costo_total}`
        },
        {
            key: "stock_restante",
            label: "Stock"
        }
    ]

    return (

        <div className="p-4 sm:p-6">

            <h1 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center gap-2">
                <FiFileText />
                Kardex por Producto
            </h1>

            {/* 🔥 FILTROS */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">

                {/* BUSCADOR DE PRODUCTO */}

                <div className="relative w-full sm:w-80">

                    <input
                        value={busqueda}
                        onChange={(e) => {
                            setBusqueda(e.target.value)
                            buscarProducto(e.target.value)
                        }}
                        placeholder="Buscar producto (nombre, SKU)"
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {busqueda && resultados.length > 0 && (
                        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto z-20">

                            {resultados.map((p) => (
                                <div
                                    key={p.id_producto}
                                    onClick={() => {
                                        setProductoSeleccionado(p)
                                        setBusqueda(p.nombre_completo || p.nombre)
                                        setResultados([])
                                    }}
                                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm transition last:border-b-0"
                                >
                                    {p.nombre_completo || `${p.nombre} (${p.modelo || "Sin modelo"}) - ${p.sku}`}
                                </div>
                            ))}

                        </div>
                    )}

                </div>

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
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">

                <button
                    onClick={descargarExcel}
                    className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    Excel
                </button>

                <button
                    onClick={descargarPDF}
                    className="bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    PDF
                </button>

            </div>

            {/* 🔥 TABLE */}
            <div className="bg-white rounded-xl shadow-lg p-8">
                <Table columns={columns} data={datos} />
            </div>

        </div>

    )
}

export default KardexProducto