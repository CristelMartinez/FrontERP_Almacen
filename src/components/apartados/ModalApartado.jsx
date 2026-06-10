import { useState, useEffect } from "react"
import api from "../../api/api"
import toast from "react-hot-toast"
import { FiPlus, FiTrash2, FiSave, FiX, FiSearch, FiMapPin, FiAlertCircle } from "react-icons/fi"
import Modal from "../Modal"
import InputField from "../InputField"
import SelectField from "../SelectField"

function SectionDivider({ label }) {
  return (
    <div className="sm:col-span-2 pt-2 pb-1 border-b border-gray-100">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </p>
    </div>
  )
}

export default function ModalApartado({ cerrar, recargar }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"))

  const [almacenes, setAlmacenes]         = useState([])
  const [departamentos, setDepartamentos] = useState([])

  // ── NUEVO: ubicaciones disponibles del producto seleccionado ──────────────
  const [ubicacionesProducto, setUbicacionesProducto] = useState([])
  const [cargandoUbicaciones, setCargandoUbicaciones] = useState(false)
  // ─────────────────────────────────────────────────────────────────────────

  const [stockDisponible, setStockDisponible] = useState(null)

  const [form, setForm] = useState({
    id_almacen:           "",
    id_departamento:      "",
    responsable_solicita: "",
    observaciones:        "",
    numero_pedido:        "",
  })

  const [busqueda, setBusqueda]                     = useState("")
  const [resultadosBusqueda, setResultadosBusqueda] = useState([])

  const [producto, setProducto] = useState({
    id_producto:   "",
    codigo_barras: "",
    sku:           "",
    nombre:        "",
    cantidad:      "",
    id_ubicacion:  "",  // ← NUEVO
  })

  const [detalles, setDetalles] = useState([])

  useEffect(() => { cargarCatalogos() }, [])

  const cargarCatalogos = async () => {
    try {
      const res = await api.get("/catalogos")
      setAlmacenes(res.data.almacenes)
      setDepartamentos(res.data.departamentos)
    } catch (error) {
      console.error("Error cargando catálogos", error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    // Al cambiar almacén limpiar stock y ubicaciones del producto actual
    if (name === "id_almacen") {
      setStockDisponible(null)
      setUbicacionesProducto([])
      setProducto(prev => ({ ...prev, id_ubicacion: "" }))
    }
  }

  const handleProducto = (e) => {
    const { name, value } = e.target
    setProducto({ ...producto, [name]: value })

    // Al cambiar la ubicación manualmente, recalcular stock disponible de esa rama
    if (name === "id_ubicacion" && producto.id_producto && form.id_almacen) {
      cargarStockPorUbicacion(producto.id_producto, form.id_almacen, value)
    }
  }

  // ── Carga ubicaciones con stock para el producto seleccionado ─────────────
  const cargarUbicacionesConStock = async (id_producto, id_almacen) => {
    if (!id_almacen) return

    setCargandoUbicaciones(true)
    try {
      const res = await api.get(`/inventario/ubicaciones/${id_producto}/${id_almacen}`)
      const ubicaciones = res.data || []
      setUbicacionesProducto(ubicaciones)

      if (ubicaciones.length === 1) {
        // Una sola ubicación → asignar automáticamente sin molestar al usuario
        const u = ubicaciones[0]
        setProducto(prev => ({ ...prev, id_ubicacion: String(u.id_ubicacion) }))
        setStockDisponible(Number(u.stock_disponible))
      } else if (ubicaciones.length === 0) {
        setStockDisponible(0)
      } else {
        // Más de una → limpiar selección para forzar al usuario a elegir
        setProducto(prev => ({ ...prev, id_ubicacion: "" }))
        setStockDisponible(null)
      }
    } catch (error) {
      console.error("Error cargando ubicaciones", error)
      // Fallback: usar endpoint de stock general
      try {
        const res = await api.get(`/inventario/stock/${id_producto}/${id_almacen}`)
        setStockDisponible(Number(res.data?.stock_disponible ?? res.data?.stock_actual ?? 0))
      } catch {
        setStockDisponible(0)
      }
    } finally {
      setCargandoUbicaciones(false)
    }
  }

  // Recalcula stock al cambiar ubicación manualmente
  const cargarStockPorUbicacion = (id_producto, id_almacen, id_ubicacion) => {
    const ub = ubicacionesProducto.find(u => String(u.id_ubicacion) === String(id_ubicacion))
    if (ub) setStockDisponible(Number(ub.stock_disponible))
  }
  // ─────────────────────────────────────────────────────────────────────────

  const buscarProducto = async (valor) => {
    if (!valor) { setResultadosBusqueda([]); return }
    try {
      const res = await api.get(`/productos/buscar?q=${valor}`)
      setResultadosBusqueda(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value)
    buscarProducto(e.target.value)
  }

  const seleccionarProducto = async (p) => {
    setProducto({
      id_producto:   p.id_producto,
      codigo_barras: p.codigo_barras || "",
      sku:           p.sku || "",
      nombre:        p.nombre,
      cantidad:      "",
      id_ubicacion:  "",
    })

    setUbicacionesProducto([])
    setStockDisponible(null)

    // Cargar ubicaciones disponibles con stock
    if (form.id_almacen) {
      await cargarUbicacionesConStock(p.id_producto, form.id_almacen)
    }

    setBusqueda(p.nombre)
    setResultadosBusqueda([])
  }

  const agregarProducto = () => {
    if (!form.id_almacen)                               return toast.error("Seleccione almacén primero")
    if (!producto.id_producto)                          return toast.error("Seleccione un producto")

    // Si hay más de una ubicación, es obligatorio elegir
    if (ubicacionesProducto.length > 1 && !producto.id_ubicacion) {
      return toast.error("Este producto está en varias ubicaciones. Seleccione de cuál se tomará")
    }

    if (!producto.cantidad || isNaN(producto.cantidad))  return toast.error("Ingrese una cantidad válida")
    if (Number(producto.cantidad) <= 0)                  return toast.error("La cantidad debe ser mayor a 0")
    if (stockDisponible === null)                        return toast.error("No se pudo validar el stock disponible")
    if (Number(producto.cantidad) > stockDisponible)     return toast.error(`Stock insuficiente. Disponible: ${stockDisponible}`)

    // Nombre legible de la ubicación seleccionada
    const ub = ubicacionesProducto.find(u => String(u.id_ubicacion) === String(producto.id_ubicacion))
    const ubicacionNombre = ub?.ubicacion_codigo || (ubicacionesProducto.length === 0 ? "Sin ubicación" : "")

    setDetalles([...detalles, {
      id_producto:      Number(producto.id_producto),
      codigo_barras:    producto.codigo_barras,
      sku:              producto.sku,
      nombre:           producto.nombre,
      cantidad:         Number(producto.cantidad),
      id_almacen:       Number(form.id_almacen),
      id_ubicacion:     producto.id_ubicacion ? Number(producto.id_ubicacion) : null,  // ← NUEVO
      ubicacion_nombre: ubicacionNombre,
    }])

    setProducto({ id_producto: "", codigo_barras: "", sku: "", nombre: "", cantidad: "", id_ubicacion: "" })
    setBusqueda("")
    setStockDisponible(null)
    setUbicacionesProducto([])
  }

  const eliminarProducto = (index) => setDetalles(detalles.filter((_, i) => i !== index))

  const crearApartado = async () => {
    if (!form.id_almacen)      return toast.error("Seleccione un almacén")
    if (!form.numero_pedido)   return toast.error("El número de pedido es obligatorio")
    if (detalles.length === 0) return toast.error("Agregue al menos un producto")

    try {
      await api.post("/apartados", {
        id_almacen:           Number(form.id_almacen),
        id_departamento:      form.id_departamento ? Number(form.id_departamento) : null,
        responsable_solicita: form.responsable_solicita,
        observaciones:        form.observaciones,
        numero_pedido:        form.numero_pedido,
        // Cada detalle ya incluye id_ubicacion
        detalles: detalles.map(d => ({
          id_producto:  d.id_producto,
          id_almacen:   d.id_almacen,
          id_ubicacion: d.id_ubicacion,
          cantidad:     d.cantidad,
        })),
      })
      toast.success("Apartado creado correctamente")
      recargar()
      cerrar()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creando apartado")
    }
  }

  return (
    <Modal ancho="max-w-4xl">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Nuevo apartado</h2>
          <p className="text-xs text-gray-400 mt-0.5">Reserva de productos (no afecta inventario)</p>
        </div>
        <button
          onClick={cerrar}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
        >
          <FiX size={16} />
        </button>
      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">

        <SectionDivider label="Información general" />

        <InputField label="Usuario" value={usuario?.nombre || ""} disabled />

        <InputField
          label="Quién solicita"
          name="responsable_solicita"
          value={form.responsable_solicita}
          onChange={handleChange}
        />

        <SelectField
          label="Departamento"
          name="id_departamento"
          value={form.id_departamento}
          onChange={handleChange}
          options={departamentos.map((d) => ({ id: d.id_departamento, nombre: d.nombre }))}
        />

        <SelectField
          label="Almacén"
          name="id_almacen"
          value={form.id_almacen}
          onChange={handleChange}
          options={almacenes.map((a) => ({ id: a.id_almacen, nombre: a.nombre }))}
        />

        <InputField
          label="Número de pedido"
          name="numero_pedido"
          value={form.numero_pedido}
          onChange={handleChange}
          placeholder="Obligatorio"
        />

        {/* ── BÚSQUEDA ─────────────────────────────────────────────────── */}
        <div className="col-span-1 sm:col-span-2 space-y-1.5 relative">
          <SectionDivider label="Agregar producto" />

          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Buscar producto (código / SKU / nombre)
          </label>
          <div className="relative">
            <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
            <input
              value={busqueda}
              onChange={handleBusqueda}
              placeholder="Escanear código o escribir…"
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
                  {p.sku && <span className="text-gray-400 text-xs ml-2">{p.sku}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DATOS PRODUCTO */}
        <InputField label="Código de barras" value={producto.codigo_barras} disabled />
        <InputField label="SKU"               value={producto.sku}           disabled />

        <div className="col-span-1 sm:col-span-2">
          <InputField label="Producto" value={producto.nombre} disabled />
        </div>

        {/* ── SELECTOR DE UBICACIÓN CONDICIONAL ── NUEVO ────────────────── */}
        {producto.id_producto && (
          <div className="col-span-1 sm:col-span-2">
            {cargandoUbicaciones ? (
              <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
                <span className="animate-spin inline-block w-3 h-3 border border-gray-300 border-t-blue-500 rounded-full" />
                Verificando ubicaciones disponibles…
              </div>
            ) : ubicacionesProducto.length === 0 ? (
              // Sin stock en ninguna ubicación
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                <FiAlertCircle size={13} />
                Este producto no tiene stock disponible en el almacén seleccionado
              </div>
            ) : ubicacionesProducto.length === 1 ? (
              // Una sola ubicación → asignada automáticamente, solo informar
              <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                <FiMapPin size={12} />
                Ubicación asignada automáticamente:
                <span className="font-semibold">
                  {ubicacionesProducto[0].ubicacion_codigo}
                  {ubicacionesProducto[0].ubicacion_descripcion
                    ? ` — ${ubicacionesProducto[0].ubicacion_descripcion}`
                    : ""}
                </span>
                <span className="ml-auto text-blue-500">
                  Disponible: {ubicacionesProducto[0].stock_disponible}
                </span>
              </div>
            ) : (
              // Múltiples ubicaciones → mostrar selector obligatorio
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  <FiMapPin size={11} />
                  Seleccionar ubicación
                  <span className="text-red-400 ml-0.5">*</span>
                </label>
                <div className="text-[11px] text-amber-600 flex items-center gap-1 mb-1">
                  <FiAlertCircle size={11} />
                  Este producto está en {ubicacionesProducto.length} ubicaciones. ¿De cuál se tomará?
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ubicacionesProducto.map((u) => (
                    <label
                      key={u.id_ubicacion}
                      className={`
                        flex items-center justify-between px-3 py-2.5 rounded-lg border cursor-pointer transition
                        ${String(producto.id_ubicacion) === String(u.id_ubicacion)
                          ? "border-blue-400 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-200 hover:bg-blue-50/50"
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="id_ubicacion"
                          value={u.id_ubicacion}
                          checked={String(producto.id_ubicacion) === String(u.id_ubicacion)}
                          onChange={handleProducto}
                          className="accent-blue-600"
                        />
                        <span className="text-sm font-medium">{u.ubicacion_codigo}</span>
                        {u.ubicacion_descripcion && (
                          <span className="text-xs text-gray-400">— {u.ubicacion_descripcion}</span>
                        )}
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        u.stock_disponible > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-500"
                      }`}>
                        {u.stock_disponible} disp.
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* ─────────────────────────────────────────────────────────────── */}

        {/* CANTIDAD + BADGE STOCK */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Cantidad
          </label>
          <input
            name="cantidad"
            type="number"
            min="1"
            value={producto.cantidad}
            onChange={handleProducto}
            placeholder="0"
            className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
          />
          {stockDisponible !== null && !isNaN(stockDisponible) && (
            <p className={`text-xs font-medium flex items-center gap-1 ${stockDisponible > 0 ? "text-blue-600" : "text-red-500"}`}>
              <FiMapPin size={10} />
              Disponible en ubicación: {stockDisponible}
            </p>
          )}
        </div>

        <div className="flex items-end pb-0.5">
          <button
            onClick={agregarProducto}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FiPlus size={14} />
            Agregar producto
          </button>
        </div>

      </div>

      {/* TABLA DETALLES */}
      {detalles.length > 0 && (
        <div className="mt-6 border border-gray-100 rounded-xl overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Código</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">SKU</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Producto</th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Cant.</th>
                {/* ← NUEVA COLUMNA */}
                <th className="text-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Ubicación</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {detalles.map((d, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                  <td className="px-4 py-2.5 text-xs font-mono text-gray-500">{d.codigo_barras || "—"}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-500">{d.sku}</td>
                  <td className="px-4 py-2.5 text-gray-800 font-medium">{d.nombre}</td>
                  <td className="px-4 py-2.5 text-center text-gray-700">{d.cantidad}</td>
                  {/* ← NUEVA CELDA */}
                  <td className="px-4 py-2.5 text-center">
                    {d.ubicacion_nombre ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                        <FiMapPin size={9} />
                        {d.ubicacion_nombre}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
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

      {/* BOTONES */}
      <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
        <button
          onClick={cerrar}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <FiX size={14} />
          Cancelar
        </button>
        <button
          onClick={crearApartado}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <FiSave size={14} />
          Crear apartado
        </button>
      </div>

    </Modal>
  )
}