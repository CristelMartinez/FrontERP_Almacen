import { useState, useEffect } from "react"
import api from "../../api/api"
import toast from "react-hot-toast"
import { FiPlus, FiTrash2, FiSave, FiX, FiSearch, FiMapPin } from "react-icons/fi"
import InputField from "../InputField"
import SelectField from "../SelectField"
import Modal from "../Modal"

function SectionDivider({ label }) {
  return (
    <div className="col-span-1 sm:col-span-2 pt-2 pb-1 border-b border-gray-100">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </p>
    </div>
  )
}

export default function ModalEntradaMovimiento({ cerrar, recargar }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"))

  const [proveedores, setProveedores]   = useState([])
  const [almacenes, setAlmacenes]       = useState([])
  const [ubicaciones, setUbicaciones]   = useState([])  // ← NUEVO: catálogo completo de ubicaciones

  const [form, setForm] = useState({
    id_proveedor:  "",
    id_almacen:    "",
    numero_pedido: "",
    factura:       "",
    observaciones: "",
  })

  const [busqueda, setBusqueda]                 = useState("")
  const [resultadosBusqueda, setResultadosBusqueda] = useState([])

  const [producto, setProducto] = useState({
    id_producto:    "",
    codigo_barras:  "",
    sku:            "",
    nombre:         "",
    cantidad:       "",
    costo_unitario: "",
    id_ubicacion:   "",  // ← NUEVO
  })

  const [detalles, setDetalles] = useState([])

  useEffect(() => { cargarCatalogos() }, [])

  const cargarCatalogos = async () => {
    try {
      const res = await api.get("/catalogos")
      setProveedores(res.data.proveedores)
      setAlmacenes(res.data.almacenes)
      // Cargar catálogo de ubicaciones (asume que viene en /catalogos o en un endpoint propio)
      // Si tu endpoint es diferente, ajusta la ruta aquí:
      if (res.data.ubicaciones) {
        setUbicaciones(res.data.ubicaciones)
      } else {
        // fallback: endpoint dedicado
        const resUb = await api.get("/catalogos/ubicaciones")
        setUbicaciones(resUb.data)
      }
    } catch (error) {
      console.error("Error cargando catálogos", error)
    }
  }

  const handleChange   = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleProducto = (e) => setProducto({ ...producto, [e.target.name]: e.target.value })

  const buscarProducto = async (valor) => {
    if (!valor) { setResultadosBusqueda([]); return }
    try {
      const res = await api.get(`/productos/buscar?q=${valor}`)
      setResultadosBusqueda(res.data)
    } catch (error) {
      console.error("Error buscando producto", error)
    }
  }

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value)
    buscarProducto(e.target.value)
  }

  const seleccionarProducto = (p) => {
    setProducto({
      id_producto:    p.id_producto,
      codigo_barras:  p.codigo_barras || "",
      sku:            p.sku || "",
      nombre:         p.nombre,
      cantidad:       "",
      costo_unitario: "",
      // Pre-rellenar con la ubicación actual del producto si existe
      id_ubicacion:   p.id_ubicacion ? String(p.id_ubicacion) : "",
    })
    setBusqueda(p.nombre)
    setResultadosBusqueda([])
  }

  const agregarProducto = () => {
    if (!producto.id_producto)                                        return toast.error("Seleccione un producto")
    if (!producto.cantidad || isNaN(producto.cantidad))               return toast.error("Ingrese una cantidad válida")
    if (Number(producto.cantidad) <= 0)                               return toast.error("La cantidad debe ser mayor a 0")
    if (!producto.costo_unitario || isNaN(producto.costo_unitario))   return toast.error("Ingrese un costo válido")
    if (!producto.id_ubicacion)                                       return toast.error("Seleccione una ubicación")

    // Nombre legible de la ubicación para mostrar en la tabla
    const ubicacionNombre = ubicaciones.find(
      u => String(u.id_ubicacion) === String(producto.id_ubicacion)
    )?.codigo || producto.id_ubicacion

    setDetalles([...detalles, {
      id_producto:       Number(producto.id_producto),
      codigo_barras:     producto.codigo_barras,
      sku:               producto.sku,
      nombre:            producto.nombre,
      cantidad:          Number(producto.cantidad),
      costo_unitario:    Number(producto.costo_unitario),
      numero_pedido:     form.numero_pedido,
      id_almacen:        Number(form.id_almacen),
      id_ubicacion:      Number(producto.id_ubicacion),   // ← NUEVO
      ubicacion_nombre:  ubicacionNombre,                  // solo para mostrar en tabla
    }])

    setProducto({
      id_producto: "", codigo_barras: "", sku: "",
      nombre: "", cantidad: "", costo_unitario: "", id_ubicacion: "",
    })
    setBusqueda("")
  }

  const eliminarProducto = (index) => setDetalles(detalles.filter((_, i) => i !== index))

  const registrarEntrada = async () => {
    if (!form.id_proveedor)    return toast.error("Seleccione un proveedor")
    if (!form.id_almacen)      return toast.error("Seleccione un almacén")
    if (detalles.length === 0) return toast.error("Agregue al menos un producto")

    try {
      await api.post("/movimientos", {
        id_tipo_movimiento: 1,
        id_proveedor:       Number(form.id_proveedor),
        id_almacen:         Number(form.id_almacen),
        numero_pedido:      form.numero_pedido,
        factura:            form.factura,
        observaciones:      form.observaciones,
        // Cada detalle ya incluye id_ubicacion
        detalles: detalles.map(d => ({
          id_producto:    d.id_producto,
          id_almacen:     d.id_almacen,
          id_ubicacion:   d.id_ubicacion,
          cantidad:       d.cantidad,
          costo_unitario: d.costo_unitario,
        })),
      })
      toast.success("Entrada registrada correctamente")
      recargar()
      cerrar()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error registrando entrada")
    }
  }

  return (
    <Modal ancho="max-w-4xl">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Registrar entrada</h2>
          <p className="text-xs text-gray-400 mt-0.5">Ingreso de productos al inventario</p>
        </div>
        <button
          onClick={cerrar}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
        >
          <FiX size={16} />
        </button>
      </div>

      {/* BODY */}
      <div className="overflow-y-auto max-h-[60vh] pr-1">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">

          <SectionDivider label="Información general" />

          <InputField label="Usuario" value={usuario?.nombre || ""} disabled />

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
            options={proveedores.map((p) => ({ id: p.id_proveedor, nombre: p.nombre }))}
          />

          <SelectField
            label="Almacén"
            name="id_almacen"
            value={form.id_almacen}
            onChange={handleChange}
            options={almacenes.map((a) => ({ id: a.id_almacen, nombre: a.nombre }))}
          />

          {/* ── BUSCAR PRODUCTO ─────────────────────────────────────────── */}
          <div className="col-span-1 sm:col-span-2 space-y-3">
            <SectionDivider label="Agregar producto" />

            <div className="space-y-1.5 relative">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Buscar producto (código / SKU / nombre)
              </label>
              <div className="relative">
                <FiSearch
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                />
                <input
                  value={busqueda}
                  onChange={handleBusqueda}
                  placeholder="Escanear código o escribir..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                />
              </div>

              {resultadosBusqueda.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-44 overflow-y-auto">
                  {resultadosBusqueda.map((p) => (
                    <div
                      key={p.id_producto}
                      onClick={() => seleccionarProducto(p)}
                      className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-0 transition"
                    >
                      <span className="font-medium">{p.nombre}</span>
                      {p.modelo && <span className="text-gray-400"> — {p.modelo}</span>}
                      {p.sku    && <span className="text-gray-400 text-xs ml-2">{p.sku}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <InputField label="Código de barras" value={producto.codigo_barras} disabled />
          <InputField label="SKU"               value={producto.sku}           disabled />

          <div className="col-span-1 sm:col-span-2">
            <InputField label="Producto" value={producto.nombre} disabled />
          </div>

          <InputField
            label="Cantidad"
            name="cantidad"
            type="number"
            min="1"
            value={producto.cantidad}
            onChange={handleProducto}
          />

          <InputField
            label="Costo de compra"
            name="costo_unitario"
            type="number"
            value={producto.costo_unitario}
            onChange={handleProducto}
          />

          {/* ── UBICACIÓN ── NUEVO CAMPO ───────────────────────────────── */}
          <div className="col-span-1 sm:col-span-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <FiMapPin size={11} />
                Ubicación en almacén
              </label>
              <select
                name="id_ubicacion"
                value={producto.id_ubicacion}
                onChange={handleProducto}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
              >
                <option value="">— Seleccionar ubicación —</option>
                {ubicaciones.map((u) => (
                  <option key={u.id_ubicacion} value={u.id_ubicacion}>
                    {u.codigo}{u.descripcion ? ` — ${u.descripcion}` : ""}
                  </option>
                ))}
              </select>
              {producto.id_ubicacion && (
                <p className="text-[11px] text-blue-600 flex items-center gap-1">
                  <FiMapPin size={10} />
                  El producto quedará registrado en esta ubicación
                </p>
              )}
            </div>
          </div>
          {/* ─────────────────────────────────────────────────────────────── */}

          <div className="col-span-1 sm:col-span-2 flex justify-end">
            <button
              onClick={agregarProducto}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FiPlus size={14} />
              Agregar producto
            </button>
          </div>

        </div>

        {/* TABLA */}
        {detalles.length > 0 && (
          <div className="mt-5 border border-gray-100 rounded-xl overflow-x-auto">
            <table className="w-full min-w-[750px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Código</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">SKU</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Producto</th>
                  <th className="text-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Cant.</th>
                  <th className="text-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Costo</th>
                  {/* ← NUEVA COLUMNA */}
                  <th className="text-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Ubicación</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {detalles.map((d, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{d.codigo_barras || "—"}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-500">{d.sku || "—"}</td>
                    <td className="px-4 py-2.5 text-gray-800 font-medium">{d.nombre}</td>
                    <td className="px-4 py-2.5 text-center">{d.cantidad}</td>
                    <td className="px-4 py-2.5 text-center">${d.costo_unitario}</td>
                    {/* ← NUEVA CELDA */}
                    <td className="px-4 py-2.5 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                        <FiMapPin size={10} />
                        {d.ubicacion_nombre}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <button
                        onClick={() => eliminarProducto(i)}
                        className="p-1 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 transition"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* OBSERVACIONES */}
        <div className="mt-5">
          <InputField
            label="Observaciones"
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            placeholder="Notas adicionales (opcional)"
          />
        </div>

      </div>

      {/* FOOTER */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
        <button
          onClick={cerrar}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <FiX size={14} />
          Cancelar
        </button>
        <button
          onClick={registrarEntrada}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          <FiSave size={14} />
          Registrar entrada
        </button>
      </div>

    </Modal>
  )
}