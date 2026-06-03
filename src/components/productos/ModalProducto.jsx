import { useState, useEffect } from "react"
import api from "../../api/api"
import toast from "react-hot-toast"
import { FiX, FiSave } from "react-icons/fi"

import Modal from "../Modal"
import InputField from "../InputField"
import SelectField from "../SelectField"

/* ─── SEPARADOR DE SECCIÓN ──────────────────────────── */
function SectionDivider({ label }) {
  return (
    <div className="col-span-1 sm:col-span-2 pt-2 pb-1 border-b border-gray-100">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </p>
    </div>
  )
}

export default function ModalProducto({ cerrar, recargar }) {

  const [categorias, setCategorias] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [unidades, setUnidades] = useState([])
  const [ubicaciones, setUbicaciones] = useState([])
  const [familias, setFamilias] = useState([])
  const [subfamilias, setSubfamilias] = useState([])

  const [form, setForm] = useState({
    nombre: "",
    codigo_barras: "",
    id_unidad: "",
    id_categoria: "",
    id_proveedor: "",
    id_familia: "",
    id_subfamilia: "",
    stock_minimo: "",
    costo_compra: "",
    id_ubicacion: "",
    descripcion: "",
    clasificacion: "",
    modelo: "",
  })

  useEffect(() => {
    cargarCatalogos()
  }, [])

  useEffect(() => {
    if (!form.id_familia) {
      setSubfamilias([])
      return
    }
    cargarSubfamilias()
  }, [form.id_familia])

  const cargarCatalogos = async () => {
    try {
      const res = await api.get("/catalogos")
      const familiasRes = await api.get("/familias")
      setCategorias(res.data.categorias)
      setProveedores(res.data.proveedores)
      setUnidades(res.data.unidades)
      setUbicaciones(res.data.ubicaciones)
      setFamilias(familiasRes.data)
    } catch (error) {
      console.error("Error cargando catalogos", error)
    }
  }

  const cargarSubfamilias = async () => {
    try {
      const res = await api.get(`/subfamilias/familia/${form.id_familia}`)
      setSubfamilias(res.data)
    } catch (error) {
      console.error("Error cargando subfamilias", error)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const guardarProducto = async () => {
    if (!form.nombre.trim())       return toast.error("El nombre del producto es obligatorio")
    /*Por peticion del personal de almacen el codigo de barras no es obligatorio, se genera un SKU automatico con familia-subfamilia-automatico  
    if (!form.codigo_barras.trim()) return toast.error("El código de barras es obligatorio")*/
    if (!form.id_unidad)           return toast.error("Debe seleccionar una unidad")
    if (!form.id_categoria)        return toast.error("Debe seleccionar una categoría")
    if (!form.id_proveedor)        return toast.error("Debe seleccionar un proveedor")
    if (!form.id_familia)          return toast.error("Debe seleccionar una familia")
    if (!form.id_subfamilia)       return toast.error("Debe seleccionar una subfamilia")
    if (!form.id_ubicacion)        return toast.error("Debe seleccionar una ubicación")
    if (!form.stock_minimo)        return toast.error("Debe ingresar el stock mínimo")
    if (!form.costo_compra)        return toast.error("Debe ingresar el costo")
    if (isNaN(form.stock_minimo))  return toast.error("El stock mínimo debe ser numérico")
    if (isNaN(form.costo_compra))  return toast.error("El costo debe ser numérico")

    try {
      const payload = {
        ...form,
        id_unidad:        Number(form.id_unidad),
        id_categoria:     Number(form.id_categoria),
        id_proveedor:     Number(form.id_proveedor),
        id_familia:       Number(form.id_familia),
        id_subfamilia:    Number(form.id_subfamilia),
        id_ubicacion:     Number(form.id_ubicacion),
        stock_minimo:     Number(form.stock_minimo),
        costo_compra:     Number(form.costo_compra),
        clasificacion_abc: form.clasificacion,
      }

      await api.post("/productos", payload)
      toast.success("Producto creado correctamente")
      recargar()
      cerrar()
    } catch (error) {
      const mensaje = error.response?.data?.message || "Error guardando el producto"
      toast.error(mensaje)
    }
  }

  /* SKU preview */
  const skuPreview = (() => {
    const fam = familias.find((f) => f.id_familia == form.id_familia)
    const sub = subfamilias.find((s) => s.id_subfamilia == form.id_subfamilia)
    return fam && sub ? `${fam.codigo}-${sub.codigo}-AUTO` : ""
  })()

  return (
    <Modal ancho="max-w-3xl">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Nuevo producto</h2>
          <p className="text-xs text-gray-400 mt-0.5">Agregar un producto al catálogo</p>
        </div>
        <button
          onClick={cerrar}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
        >
          <FiX size={16} />
        </button>
      </div>

      {/* FORM con scroll */}
      <div className="overflow-y-auto max-h-[70vh] sm:max-h-[60vh] pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">

          {/* ── IDENTIFICACIÓN ── */}
          <SectionDivider label="Identificación" />

          <InputField
            label="SKU"
            value={skuPreview}
            disabled
            placeholder="Generado automáticamente"
          />

          <InputField
            label="Nombre del producto"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre del producto"
          />

          <InputField
            label="Código de barras"
            name="codigo_barras"
            value={form.codigo_barras}
            onChange={handleChange}
            placeholder="Código de barras"
          />

          <InputField
            label="Modelo"
            name="modelo"
            value={form.modelo}
            onChange={handleChange}
            placeholder="Modelo"
          />

          {/* ── CLASIFICACIÓN ── */}
          <SectionDivider label="Clasificación" />

          <SelectField
            label="Familia"
            name="id_familia"
            value={form.id_familia}
            onChange={handleChange}
            options={familias.map((f) => ({
              id: f.id_familia,
              nombre: `${f.codigo} — ${f.nombre}`,
            }))}
          />

          <SelectField
            label="Subfamilia"
            name="id_subfamilia"
            value={form.id_subfamilia}
            onChange={handleChange}
            disabled={!form.id_familia}
            options={subfamilias.map((s) => ({
              id: s.id_subfamilia,
              nombre: `${s.codigo} — ${s.nombre}`,
            }))}
          />

          <SelectField
            label="Categoría"
            name="id_categoria"
            value={form.id_categoria}
            onChange={handleChange}
            options={categorias.map((c) => ({
              id: c.id_categoria,
              nombre: c.nombre,
            }))}
          />

          <SelectField
            label="Unidad de medida"
            name="id_unidad"
            value={form.id_unidad}
            onChange={handleChange}
            options={unidades.map((u) => ({
              id: u.id_unidad,
              nombre: u.nombre,
            }))}
          />

          <InputField
            label="Clasificación ABC"
            name="clasificacion"
            value={form.clasificacion}
            onChange={handleChange}
            placeholder="A, B o C"
          />

          {/* ── COMERCIAL ── */}
          <SectionDivider label="Comercial y ubicación" />

          <SelectField
            label="Proveedor"
            name="id_proveedor"
            value={form.id_proveedor}
            onChange={handleChange}
            options={proveedores.map((p) => ({
              id: p.id_proveedor,
              nombre: p.nombre,
            }))}
          />

          <SelectField
            label="Ubicación"
            name="id_ubicacion"
            value={form.id_ubicacion}
            onChange={handleChange}
            options={ubicaciones.map((u) => ({
              id: u.id_ubicacion,
              nombre: u.codigo,
            }))}
          />

          <InputField
            label="Stock mínimo"
            name="stock_minimo"
            value={form.stock_minimo}
            onChange={handleChange}
            placeholder="0"
            type="number"
          />

          <InputField
            label="Costo de compra"
            name="costo_compra"
            value={form.costo_compra}
            onChange={handleChange}
            placeholder="0.00"
            type="number"
          />

          <div className="sm:col-span-2">
            <InputField
              label="Descripción"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción del producto (opcional)"
            />
          </div>

        </div>
      </div>

      {/* BOTONES */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
        <button
          onClick={cerrar}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <FiX size={14} />
          Cancelar
        </button> 
        <button
          onClick={guardarProducto}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <FiSave size={14} />
          Guardar producto
        </button>
      </div>

    </Modal>
  )
}