import { useState } from "react"
import api from "../../api/api"
import toast from "react-hot-toast"
import { FiX, FiSave, FiSearch, FiPackage, FiAlertCircle, FiMapPin, FiPlus } from "react-icons/fi"

export default function ModalAjustarStock({ cerrar, recargar }) {
  const [codigo, setCodigo]                   = useState("")
  const [producto, setProducto]               = useState(null)
  const [ubicaciones, setUbicaciones]         = useState([])
  const [ubicacionSel, setUbicacionSel]       = useState(null)
  const [cantidad, setCantidad]               = useState("")
  const [motivo, setMotivo]                   = useState("")
  const [resultadosBusqueda, setResultadosBusqueda] = useState([])
  const [cargandoUbic, setCargandoUbic]       = useState(false)

  // Estado para nueva ubicación
  const [modoNuevaUbic, setModoNuevaUbic]         = useState(false)
  const [todasUbicaciones, setTodasUbicaciones]   = useState([])
  const [busquedaUbic, setBusquedaUbic]           = useState("")
  const [cargandoTodas, setCargandoTodas]         = useState(false)

  const handleScan = async (e) => {
    const value = e.target.value
    setCodigo(value)
    setProducto(null)
    setUbicaciones([])
    setUbicacionSel(null)
    setCantidad("")
    setModoNuevaUbic(false)
    setBusquedaUbic("")

    if (!value) { setResultadosBusqueda([]); return }

    try {
      const res = await api.get(`/productos/buscar?q=${value}`)
      setResultadosBusqueda(res.data)
      if (res.data.length === 1) seleccionarProducto(res.data[0])
    } catch (error) {
      console.error(error)
    }
  }

  const seleccionarProducto = async (p) => {
    setProducto(p)
    setCodigo(p.nombre)
    setResultadosBusqueda([])
    setUbicacionSel(null)
    setCantidad("")
    setModoNuevaUbic(false)
    setBusquedaUbic("")
    setCargandoUbic(true)

    try {
      const res = await api.get(`/inventario/producto/${p.id_producto}/ubicaciones`)
      setUbicaciones(res.data)
      if (res.data.length === 1) setUbicacionSel(res.data[0])
    } catch (error) {
      toast.error("No se pudieron cargar las ubicaciones")
    } finally {
      setCargandoUbic(false)
    }
  }

  const abrirNuevaUbicacion = async () => {
    setModoNuevaUbic(true)
    setUbicacionSel(null)
    setCantidad("")
    setBusquedaUbic("")

    if (todasUbicaciones.length > 0) return // ya las cargamos antes

    setCargandoTodas(true)
    try {
      const res = await api.get("/ubicaciones")
      // Filtrar las que el producto ya tiene
      const idsYaAsignadas = new Set(ubicaciones.map(u => u.id_ubicacion))
      setTodasUbicaciones(res.data.filter(u => !idsYaAsignadas.has(u.id_ubicacion)))
    } catch (error) {
      toast.error("No se pudieron cargar las ubicaciones disponibles")
    } finally {
      setCargandoTodas(false)
    }
  }

  const seleccionarNuevaUbicacion = (u) => {
    // La nueva ubicación tiene stock 0 por ser nueva para este producto
    setUbicacionSel({ ...u, stock_actual: 0, esNueva: true })
    setModoNuevaUbic(false)
    setBusquedaUbic("")
  }

  const guardarAjuste = async () => {
    if (!producto)     return toast.error("Debe seleccionar un producto")
    if (!ubicacionSel) return toast.error("Debe seleccionar una ubicación")
    if (!cantidad)     return toast.error("Debe ingresar una cantidad")
    if (ubicacionSel.esNueva && Number(cantidad) <= 0)
      return toast.error("Para una nueva ubicación la cantidad debe ser positiva")

    try {
      await api.post("/inventario/ajuste", {
        id_producto:  producto.id_producto,
        id_almacen:   ubicacionSel.id_almacen,
        id_ubicacion: ubicacionSel.id_ubicacion,
        cantidad:     Number(cantidad),
        motivo,
      })
      toast.success("Stock ajustado correctamente")
      recargar()
      cerrar()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error ajustando stock")
    }
  }

  const ubicacionesFiltradas = todasUbicaciones.filter(u =>
    u.codigo?.toLowerCase().includes(busquedaUbic.toLowerCase()) ||
    u.descripcion?.toLowerCase().includes(busquedaUbic.toLowerCase())
  )

  const stockFinal     = ubicacionSel && cantidad !== "" ? Number(ubicacionSel.stock_actual) + Number(cantidad) : null
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
          <button onClick={cerrar} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
            <FiX size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

          {/* BÚSQUEDA PRODUCTO */}
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
                {producto.sku && <p className="text-xs text-gray-400">{producto.sku}</p>}
              </div>
            </div>
          )}

          {/* UBICACIONES DEL PRODUCTO */}
          {producto && !modoNuevaUbic && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <FiMapPin size={11} /> Ubicación
              </label>

              {cargandoUbic ? (
                <div className="py-4 text-center text-xs text-gray-400">Cargando ubicaciones…</div>
              ) : (
                <>
                  {ubicaciones.length === 0 ? (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-yellow-50 border border-yellow-100 text-xs text-yellow-700">
                      <FiAlertCircle size={13} />
                      Este producto no tiene stock en ninguna ubicación aún.
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      {ubicaciones.map((u) => {
                        const seleccionada = ubicacionSel?.id_ubicacion === u.id_ubicacion && !ubicacionSel?.esNueva
                        return (
                          <button
                            key={u.id_ubicacion}
                            onClick={() => { setUbicacionSel(u); setCantidad("") }}
                            className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition ${
                              seleccionada
                                ? "bg-blue-50 border-blue-300 ring-1 ring-blue-300"
                                : "bg-gray-50 border-gray-200 hover:border-blue-200 hover:bg-blue-50/40"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium text-gray-800">{u.ubicacion_codigo}</span>
                                {u.ubicacion_descripcion && (
                                  <span className="text-gray-400 text-xs ml-2">{u.ubicacion_descripcion}</span>
                                )}
                                <p className="text-xs text-gray-400 mt-0.5">{u.almacen}</p>
                              </div>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                u.stock_actual > 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                              }`}>
                                Stock: {u.stock_actual}
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Botón nueva ubicación */}
                  <button
                    onClick={abrirNuevaUbicacion}
                    className="w-full mt-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/40 transition"
                  >
                    <FiPlus size={14} />
                    Asignar nueva ubicación
                  </button>
                </>
              )}
            </div>
          )}

          {/* PANEL NUEVA UBICACIÓN */}
          {modoNuevaUbic && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <FiMapPin size={11} /> Nueva ubicación
                </label>
                <button
                  onClick={() => { setModoNuevaUbic(false); setBusquedaUbic("") }}
                  className="text-xs text-gray-400 hover:text-gray-600 transition"
                >
                  ← Volver
                </button>
              </div>

              {/* Buscador de ubicaciones */}
              <div className="relative">
                <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                <input
                  value={busquedaUbic}
                  onChange={(e) => setBusquedaUbic(e.target.value)}
                  placeholder="Buscar por código o descripción…"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                />
              </div>

              {cargandoTodas ? (
                <div className="py-4 text-center text-xs text-gray-400">Cargando ubicaciones…</div>
              ) : ubicacionesFiltradas.length === 0 ? (
                <div className="py-4 text-center text-xs text-gray-400">
                  {busquedaUbic ? "Sin resultados" : "No hay más ubicaciones disponibles"}
                </div>
              ) : (
                <div className="grid gap-1.5 max-h-48 overflow-y-auto pr-0.5">
                  {ubicacionesFiltradas.map((u) => (
                    <button
                      key={u.id_ubicacion}
                      onClick={() => seleccionarNuevaUbicacion(u)}
                      className="w-full text-left px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40 text-sm transition"
                    >
                      <span className="font-medium text-gray-800">{u.codigo}</span>
                      {u.descripcion && (
                        <span className="text-gray-400 text-xs ml-2">{u.descripcion}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* UBICACIÓN NUEVA SELECCIONADA — badge de confirmación */}
          {ubicacionSel?.esNueva && !modoNuevaUbic && (
            <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 text-sm">
              <div className="flex items-center gap-2 text-blue-700">
                <FiMapPin size={13} />
                <span className="font-medium">{ubicacionSel.codigo}</span>
                {ubicacionSel.descripcion && (
                  <span className="text-blue-400 text-xs">{ubicacionSel.descripcion}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">Nueva</span>
                <button
                  onClick={() => { setUbicacionSel(null); setCantidad("") }}
                  className="text-blue-400 hover:text-blue-600 transition"
                >
                  <FiX size={13} />
                </button>
              </div>
            </div>
          )}

          {/* CANTIDAD */}
          {ubicacionSel && !modoNuevaUbic && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Cantidad de ajuste{" "}
                {!ubicacionSel.esNueva && (
                  <span className="normal-case text-gray-300">(use negativo para restar)</span>
                )}
              </label>
              <input
                type="number"
                placeholder={ubicacionSel.esNueva ? "Cantidad inicial" : "Ej: 10 o -5"}
                value={cantidad}
                min={ubicacionSel.esNueva ? 1 : undefined}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
              />
            </div>
          )}

          {/* STOCK FINAL PREVIEW */}
          {stockFinal !== null && !modoNuevaUbic && (
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border ${
              ajusteNegativo && stockFinal < 0
                ? "bg-red-50 border-red-100 text-red-700"
                : ajustePositivo
                ? "bg-green-50 border-green-100 text-green-700"
                : "bg-orange-50 border-orange-100 text-orange-700"
            }`}>
              {ajusteNegativo && stockFinal < 0 && <FiAlertCircle size={14} />}
              <span>
                Stock después del ajuste: <span className="font-semibold">{stockFinal}</span>
              </span>
            </div>
          )}

          {/* MOTIVO */}
          {ubicacionSel && !modoNuevaUbic && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Motivo</label>
              <input
                placeholder="Razón del ajuste (opcional)"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
              />
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100 shrink-0">
          <button onClick={cerrar} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <FiX size={14} /> Cancelar
          </button>
          <button
            onClick={guardarAjuste}
            disabled={!ubicacionSel || !cantidad || modoNuevaUbic}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiSave size={14} /> Guardar ajuste
          </button>
        </div>

      </div>
    </div>
  )
}