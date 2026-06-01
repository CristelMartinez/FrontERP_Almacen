import { useState } from "react"
import api from "../../api/api"
import toast from "react-hot-toast"
import Modal from "../Modal"

export default function ModalAjustarStock({ cerrar, recargar }) {

  const [codigo, setCodigo] = useState("")
  const [producto, setProducto] = useState(null)
  const [cantidad, setCantidad] = useState("")
  const [motivo, setMotivo] = useState("")
  const [resultadosBusqueda, setResultadosBusqueda] = useState([])

  // Buscar producto por codigo

  const handleScan = async (e) => {

    const value = e.target.value

    setCodigo(value)

    if (!value) {
      setResultadosBusqueda([])
      setProducto(null)
      return
    }

    try {

      // 🔥 búsqueda general
      const res = await api.get(`/productos/buscar?q=${value}`)

      setResultadosBusqueda(res.data)

      // 🔥 si solo hay uno → autoseleccionar
      if (res.data.length === 1) {
        setProducto(res.data[0])
        setResultadosBusqueda([])
      }

    } catch (error) {
      console.error(error)
    }

  }

  const seleccionarProducto = async (p) => {

    // 🔥 PRIMERO setear producto (instantáneo)
    setProducto(p)
    setCodigo(p.nombre)
    setResultadosBusqueda([])

    // 🔥 DESPUÉS pedir stock
    try {
      const res = await api.get(`/inventario/stock/${p.id_producto}/1`)

      setProducto(prev => ({
        ...prev,
        stock_actual: res.data.stock_actual
      }))

    } catch (error) {
      console.error(error)
    }

  }


  // guardar ajuste
  const guardarAjuste = async () => {

    if (!producto) {
      toast.error("Debe escanear un producto")
      return
    }

    if (!cantidad) {
      toast.error("Debe ingresar una cantidad")
      return
    }

    try {

      const payload = {
        id_producto: producto.id_producto,
        id_almacen: 1,
        cantidad: Number(cantidad),
        motivo
      }

      await api.post("/inventario/ajuste", payload)

      toast.success("Stock ajustado correctamente")

      // limpiar modal
      setCodigo("")
      setProducto(null)
      setCantidad("")
      setMotivo("")

      recargar()
      cerrar()

    } catch (error) {

      console.error(error)

      const mensaje =
        error.response?.data?.message ||
        "Error ajustando stock"

      toast.error(mensaje)

    }

  }

  const stockFinal =
    producto && cantidad
      ? Number(producto.stock_actual) + Number(cantidad)
      : null

  return (
    <Modal ancho="max-w-md">

      <h2 className="text-lg font-semibold mb-4">
        Ajustar Stock
      </h2>

      {/* Escaner */}
      <input
        value={codigo}
        onChange={handleScan}
        placeholder="Buscar producto por nombre o SKU"
        className="border rounded-lg px-3 py-2 w-full mb-4 text-center"
      />

      {resultadosBusqueda.length > 0 && (
        <div className="border rounded-lg mt-1 max-h-40 overflow-y-auto bg-white shadow">
          {resultadosBusqueda.map(p => (
            <div
              key={p.id_producto}
              onClick={() => seleccionarProducto(p)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {p.nombre} — {p.sku}
            </div>
          ))}
        </div>
      )}

      {/* Producto */}
      {producto && (
        <div className="bg-gray-100 p-3 rounded mb-4 text-sm">
          <p><b>Producto:</b> {producto.nombre}</p>
          <p><b>Stock actual:</b> {producto.stock_actual}</p>
        </div>
      )}

      {/* Cantidad */}
      <input
        type="number"
        placeholder="Cantidad ajuste (+ o -)"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
        className="border rounded-lg px-3 py-2 w-full mb-4"
      />

      {/* Stock final */}
      {stockFinal !== null && (
        <div className="bg-blue-50 p-2 rounded mb-4 text-sm">
          <b>Stock después del ajuste:</b> {stockFinal}
        </div>
      )}

      {/* Motivo */}
      <input
        placeholder="Motivo"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        className="border rounded-lg px-3 py-2 w-full mb-4"
      />

      {/* Botones */}
      <div className="flex justify-between">
        <button
          onClick={cerrar}
          className="bg-gray-300 px-4 py-2 rounded-lg"
        >
          Cancelar
        </button>

        <button
          onClick={guardarAjuste}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Guardar
        </button>
      </div>

    </Modal>
  )

}