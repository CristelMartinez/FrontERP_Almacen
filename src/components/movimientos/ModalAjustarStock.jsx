import { useState } from "react"
import api from "../../api/api"
import toast from "react-hot-toast"
import { FiX, FiSave, FiSearch, FiPackage, FiAlertCircle } from "react-icons/fi"

export default function ModalAjustarStock({ cerrar, recargar }) {
  const [codigo, setCodigo] = useState("")
  const [producto, setProducto] = useState(null)
  const [cantidad, setCantidad] = useState("")
  const [motivo, setMotivo] = useState("")
  const [resultadosBusqueda, setResultadosBusqueda] = useState([])

  const handleScan = async (e) => {
    const value = e.target.value
    setCodigo(value)

    if (!value) {
      setResultadosBusqueda([])
      setProducto(null)
      return
    }

    try {
      const res = await api.get(`/productos/buscar?q=${value}`)
      setResultadosBusqueda(res.data)
      if (res.data.length === 1) {
        seleccionarProducto(res.data[0])
      }
    } catch (error) {
      console.error(error)
    }
  }

  const seleccionarProducto = async (p) => {
    setProducto(p)
    setCodigo(p.nombre)
    setResultadosBusqueda([])

    try {
      const res = await api.get(`/inventario/stock/${p.id_producto}/1`)
      setProducto((prev) => ({ ...prev, stock_actual: res.data.stock_actual }))
    } catch (error) {
      console.error(error)
    }
  }

  const guardarAjuste = async () => {
    if (!producto) return toast.error("Debe seleccionar un producto")
    if (!cantidad) return toast.error("Debe ingresar una cantidad")

    try {
      await api.post("/inventario/ajuste", {
        id_producto: producto.id_producto,
        id_almacen: 1,
        cantidad: Number(cantidad),
        motivo,
      })
      toast.success("Stock ajustado correctamente")
      setCodigo("")
      setProducto(null)
      setCantidad("")
      setMotivo("")
      recargar()
      cerrar()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error ajustando stock")
    }
  }

  const stockFinal =
    producto && cantidad !== ""
      ? Number(producto.stock_actual) + Number(cantidad)
      : null

  const ajustePositivo = Number(cantidad) > 0
  const ajusteNegativo = Number(cantidad) < 0

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-2xl shadow-xl flex flex-col max-h-[92dvh] sm:max-h-[85vh]">

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Ajustar stock</h2>
            <p className="text-xs text-gray-400 mt-0.5">Corrección manual del inventario</p>
          </div>
          <button
            onClick={cerrar}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

          {/* BÚSQUEDA */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Buscar producto
            </label>
            <div className="relative">
              <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
              <input
                value={codigo}
                onChange={handleScan}
                placeholder="Nombre, SKU o código de barras…"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
              />
            </div>

            {resultadosBusqueda.length > 0 && (
              <div className="border border-gray-200 rounded-lg shadow-lg bg-white max-h-44 overflow-y-auto">
                {resultadosBusqueda.map((p) => (
                  <div
                    key={p.id_producto}
                    onClick={() => seleccionarProducto(p)}
                    className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-0 transition"
                  >
                    <span className="font-medium">{p.nombre}</span>
                    {p.sku && <span className="text-gray-400 text-xs ml-2">{p.sku}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCTO SELECCIONADO */}
          {producto && (
            <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <FiPackage size={14} className="text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{producto.nombre}</p>
                <p className="text-xs text-gray-400">
                  Stock actual: <span className="font-semibold text-gray-600">{producto.stock_actual ?? "…"}</span>
                </p>
              </div>
            </div>
          )}

          {/* CANTIDAD */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Cantidad de ajuste <span className="normal-case text-gray-300">(use negativo para restar)</span>
            </label>
            <input
              type="number"
              placeholder="Ej: 10 o -5"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
            />
          </div>

          {/* STOCK FINAL PREVIEW */}
          {stockFinal !== null && (
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border ${
              ajusteNegativo && stockFinal < 0
                ? "bg-red-50 border-red-100 text-red-700"
                : ajustePositivo
                ? "bg-green-50 border-green-100 text-green-700"
                : "bg-orange-50 border-orange-100 text-orange-700"
            }`}>
              {ajusteNegativo && stockFinal < 0 && <FiAlertCircle size={14} />}
              <span>
                Stock después del ajuste:{" "}
                <span className="font-semibold">{stockFinal}</span>
              </span>
            </div>
          )}

          {/* MOTIVO */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Motivo
            </label>
            <input
              placeholder="Razón del ajuste (opcional)"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100 shrink-0">
          <button
            onClick={cerrar}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <FiX size={14} />
            Cancelar
          </button>
          <button
            onClick={guardarAjuste}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <FiSave size={14} />
            Guardar ajuste
          </button>
        </div>

      </div>
    </div>
  )
}