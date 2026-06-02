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

export default function ModalEditarProducto({ cerrar, recargar, producto }) {

  const [proveedores, setProveedores] = useState([])
  const [ubicaciones, setUbicaciones] = useState([])

  const [form, setForm] = useState({
    sku: "",
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
    if (producto) {
      setForm({
        sku:            producto.sku || "",
        nombre:         producto.nombre || "",
        codigo_barras:  producto.codigo_barras || "",
        id_unidad:      producto.id_unidad || "",
        id_categoria:   producto.id_categoria || "",
        id_proveedor:   producto.id_proveedor || "",
        id_familia:     producto.id_familia || "",
        id_subfamilia:  producto.id_subfamilia || "",
        stock_minimo:   producto.stock_minimo || "",
        costo_compra:   producto.costo_compra || "",
        id_ubicacion:   producto.id_ubicacion || "",
        descripcion:    producto.descripcion || "",
        clasificacion:  producto.clasificacion_abc || "",
        modelo:         producto.modelo || "",
      })
    }
  }, [producto])

  const cargarCatalogos = async () => {
    try {
      const res = await api.get("/catalogos")
      setProveedores(res.data.proveedores)
      setUbicaciones(res.data.ubicaciones)
    } catch (error) {
      console.error("Error cargando catálogos", error)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const actualizarProducto = async () => {
    if (!form.nombre.trim())      return toast.error("El nombre del producto es obligatorio")
    if (!form.id_proveedor)       return toast.error("Debe seleccionar un proveedor")
    if (!form.id_ubicacion)       return toast.error("Debe seleccionar una ubicación")
    if (!form.stock_minimo)       return toast.error("Debe ingresar el stock mínimo")
    if (!form.costo_compra)       return toast.error("Debe ingresar el costo")
    if (isNaN(form.stock_minimo)) return toast.error("El stock mínimo debe ser numérico")
    if (isNaN(form.costo_compra)) return toast.error("El costo debe ser numérico")

    try {
      const payload = {
        nombre:           form.nombre,
        codigo_barras:    form.codigo_barras,
        id_proveedor:     Number(form.id_proveedor),
        stock_minimo:     Number(form.stock_minimo),
        costo_compra:     Number(form.costo_compra),
        id_ubicacion:     Number(form.id_ubicacion),
        descripcion:      form.descripcion,
        clasificacion_abc: form.clasificacion,
        modelo:           form.modelo,
      }

      await api.put(`/productos/${producto.id_producto}`, payload)
      toast.success("Producto actualizado correctamente")
      recargar()
      cerrar()
    } catch (error) {
      const mensaje = error.response?.data?.message || "Error actualizando producto"
      toast.error(mensaje)
    }
  }

  return (
    <Modal ancho="max-w-3xl">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Editar producto</h2>
          <p className="text-xs text-gray-400 mt-0.5">Modificar información del producto</p>
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

          {/* ── IDENTIFICACIÓN (solo lectura) ── */}
          <SectionDivider label="Identificación" />

          <InputField
            label="SKU"
            value={form.sku}
            disabled
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

          {/* ── CLASIFICACIÓN (bloqueada) ── */}
          <SectionDivider label="Clasificación" />

          <InputField
            label="Familia"
            value={producto?.familia_nombre || ""}
            disabled
          />

          <InputField
            label="Subfamilia"
            value={producto?.subfamilia_nombre || ""}
            disabled
          />

          <InputField
            label="Categoría"
            value={producto?.categoria_nombre || ""}
            disabled
          />

          <InputField
            label="Unidad de medida"
            value={producto?.unidad_nombre || ""}
            disabled
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
          onClick={actualizarProducto}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <FiSave size={14} />
          Actualizar producto
        </button>
      </div>

    </Modal>
  )
}