import { useState, useEffect } from "react"
import api from "../../api/api"
import toast from "react-hot-toast"
import { FiPlus, FiTrash, FiSave, FiX } from "react-icons/fi"
import Modal from "../Modal"
import InputField from "../InputField"
import SelectField from "../SelectField"

export default function ModalEntradaMovimiento({ cerrar, recargar }) {

  const usuario = JSON.parse(localStorage.getItem("usuario"))

  const [proveedores, setProveedores] = useState([])
  const [almacenes, setAlmacenes] = useState([])
  

  const [form, setForm] = useState({
    id_proveedor: "",
    id_almacen: "",
    numero_pedido: "",
    factura: "",
    observaciones: ""
  })

  const [busqueda, setBusqueda] = useState("")
  const [resultadosBusqueda, setResultadosBusqueda] = useState([])

  const [producto, setProducto] = useState({
    id_producto: "",
    codigo_barras: "",
    sku: "",
    nombre: "",
    cantidad: "",
    costo_unitario: ""
  })

  const [detalles, setDetalles] = useState([])

  useEffect(() => {
    cargarCatalogos()
  }, [])

  const cargarCatalogos = async () => {

    try {

      const res = await api.get("/catalogos")

      setProveedores(res.data.proveedores)
      setAlmacenes(res.data.almacenes)

    } catch (error) {

      console.error("Error cargando catálogos", error)

    }

  }

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }

  const handleProducto = (e) => {

    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    })

  }

  const buscarProducto = async (valor) => {

    if (!valor) {
      setResultadosBusqueda([])
      return
    }

    try {

      const res = await api.get(`/productos/buscar?q=${valor}`)

      setResultadosBusqueda(res.data)

    } catch (error) {

      console.error("Error buscando producto", error)

    }

  }

  const handleBusqueda = (e) => {

    const valor = e.target.value

    setBusqueda(valor)

    buscarProducto(valor)

  }

  const seleccionarProducto = (p) => {

    setProducto({
      id_producto: p.id_producto,
      codigo_barras: p.codigo_barras || "",
      sku: p.sku || "",
      nombre: p.nombre,
      cantidad: "",
      costo_unitario: ""
    })

    setBusqueda(p.nombre)
    setResultadosBusqueda([])

  }

const agregarProducto = () => {

  if (!producto.id_producto) {
    toast.error("Seleccione un producto")
    return
  }

  if (!producto.cantidad || isNaN(producto.cantidad)) {
    toast.error("Ingrese una cantidad válida")
    return
  }

  if (Number(producto.cantidad) <= 0) {
    toast.error("La cantidad debe ser mayor a 0")
    return
  }

  if (!producto.costo_unitario || isNaN(producto.costo_unitario)) {
    toast.error("Ingrese un costo válido")
    return
  }

  setDetalles([
    ...detalles,
    {
      id_producto: Number(producto.id_producto),
      codigo_barras: producto.codigo_barras,
      sku: producto.sku,
      nombre: producto.nombre,
      cantidad: Number(producto.cantidad),
      costo_unitario: Number(producto.costo_unitario),
      numero_pedido: form.numero_pedido,
      id_almacen: Number(form.id_almacen)
    }
  ])

  setProducto({
    id_producto: "",
    codigo_barras: "",
    sku: "",
    nombre: "",
    cantidad: "",
    costo_unitario: ""
  })

  setBusqueda("")
}

  const eliminarProducto = (index) => {

    const nuevos = detalles.filter((_, i) => i !== index)

    setDetalles(nuevos)

  }

 const registrarEntrada = async () => {

  if (!form.id_proveedor) {
    toast.error("Seleccione un proveedor")
    return
  }

  if (!form.id_almacen) {
    toast.error("Seleccione un almacén")
    return
  }

  if (detalles.length === 0) {
    toast.error("Agregue al menos un producto")
    return
  }

  try {

    const payload = {
      id_tipo_movimiento: 1, // 🔥 number
      id_proveedor: Number(form.id_proveedor),
      id_almacen: Number(form.id_almacen),
      numero_pedido: form.numero_pedido,
      factura: form.factura,
      observaciones: form.observaciones,
      detalles
    }

    await api.post("/movimientos", payload)

    toast.success("Entrada registrada correctamente")

    recargar()
    cerrar()

  } catch (error) {

    const mensaje =
      error.response?.data?.message ||
      "Error registrando entrada"

    toast.error(mensaje)

  }

}

  return (

    <Modal ancho="max-w-4xl">
      <div className="max-h-[85vh] overflow-y-auto pr-2"> 

      {/* HEADER */}

      <div className="bg-green-600 text-white px-6 py-3 rounded-lg mb-6 flex justify-between">

        <h2 className="text-lg font-semibold">
          Registrar Entrada
        </h2>

        <span className="text-sm opacity-90">
          Ingreso de productos al inventario
        </span>

      </div>

      {/* FORM */}

      <div className="grid grid-cols-2 gap-6">

        <InputField
          label="Usuario"
          value={usuario?.nombre || ""}
          disabled
        />

        <InputField
          label="Número de pedido"
          name="numero_pedido"
          value={form.numero_pedido}
          onChange={handleChange}
        />

        <InputField
          label="Factura"
          name="factura"
          value={form.factura}
          onChange={handleChange}
        />

        <SelectField
          label="Proveedor"
          name="id_proveedor"
          value={form.id_proveedor}
          onChange={handleChange}
          options={proveedores.map(p => ({
            id: p.id_proveedor,
            nombre: p.nombre
          }))}
        />

        <SelectField
          label="Almacén"
          name="id_almacen"
          value={form.id_almacen}
          onChange={handleChange}
          options={almacenes.map(a => ({
            id: a.id_almacen,
            nombre: a.nombre
          }))}
        />

      </div>

      {/* BUSQUEDA PRODUCTO */}

      <div className="mt-6">

        <label className="text-sm">Buscar producto (Código / SKU / Nombre)</label>

        <input
          value={busqueda}
          onChange={handleBusqueda}
          placeholder="Escanear código o escribir"
          className="w-full border rounded-lg px-3 py-2"
        />

        {resultadosBusqueda.length > 0 && (

          <div className="border rounded-lg mt-1 max-h-40 overflow-y-auto bg-white">

            {resultadosBusqueda.map(p => (

              <div
                key={p.id_producto}
                onClick={() => seleccionarProducto(p)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {p.nombre} - {p.modelo}- {p.sku} 
              </div>

            ))}

          </div>

        )}

      </div>

      {/* PRODUCTO SELECCIONADO */}

      <div className="grid grid-cols-4 gap-4 mt-6">

        <InputField
          label="Código barras"
          value={producto.codigo_barras}
          disabled
        />

        <InputField
          label="SKU"
          value={producto.sku}
          disabled
        />

        <InputField
          label="Producto"
          value={producto.nombre}
          disabled
        />

        <div></div>

        <InputField
          label="Cantidad"
          name="cantidad"
          type="number"
          min="1"
          value={producto.cantidad}
          onChange={handleProducto}
        />

        <InputField
          label="Costo compra"
          name="costo_unitario"
          type="number"
          value={producto.costo_unitario}
          onChange={handleProducto}
        />

        <div className="flex items-end">

          <button
            onClick={agregarProducto}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <FiPlus />
            Agregar
          </button>

        </div>

      </div>

      {/* TABLA PRODUCTOS */}

      {detalles.length > 0 && (

        <table className="w-full mt-6 text-sm">

          <thead>

            <tr className="border-b text-gray-600">

              <th className="text-left py-2">Código</th>
              <th className="text-left">SKU</th>
              <th className="text-left">Producto</th>
              <th className="text-center">Cantidad</th>
              <th className="text-center">Costo</th>
              <th className="text-center w-12"></th>

            </tr>

          </thead>

          <tbody>

            {detalles.map((d, i) => (

              <tr key={i} className="border-b hover:bg-gray-50">

                <td className="py-2">{d.codigo_barras}</td>
                <td>{d.sku}</td>
                <td>{d.nombre}</td>
                <td className="text-center">{d.cantidad}</td>
                <td className="text-center">${d.costo_unitario}</td>

                <td className="text-center">

                  <button
                    onClick={() => eliminarProducto(i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

      {/* OBSERVACIONES */}

      <div className="mt-6">

        <InputField
          label="Observaciones"
          name="observaciones"
          value={form.observaciones}
          onChange={handleChange}
        />

      </div>

      {/* BOTONES */}

      <div className="flex justify-between mt-8">

        <button
          onClick={cerrar}
          className="bg-gray-200 px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <FiX />
          Cancelar
        </button>

        <button
          onClick={registrarEntrada}
          className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <FiSave />
          Registrar entrada
        </button>

      </div>
     </div>  

    </Modal>

  )

}