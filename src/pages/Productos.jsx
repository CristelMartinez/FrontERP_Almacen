import { useEffect, useState } from "react"

import api from "../api/api"

import ModalProducto from "../components/productos/ModalProducto"
import ModalEditarProducto from "../components/productos/ModalEditarProducto"
import ModalEliminarProducto from "../components/productos/ModalEliminarProducto"
import ModalImportarProductos from "../components/productos/ModalImportarProductos"
import Table from "../components/Table"

import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiUpload,
  FiBox,
} from "react-icons/fi"

import toast from "react-hot-toast"

/* ─── BADGE CLASIFICACIÓN ABC ──────────────────────────── */
function ClasificacionBadge({ valor }) {
  if (!valor) return <span className="text-gray-300 text-xs">—</span>

  const estilos = {
    A: "bg-emerald-50 text-emerald-700",
    B: "bg-amber-50 text-amber-700",
    C: "bg-red-50 text-red-500",
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
        estilos[valor?.toUpperCase()] ?? "bg-gray-100 text-gray-500"
      }`}
    >
      {valor}
    </span>
  )
}

export default function Productos() {

  const [mostrarModal, setMostrarModal] = useState(false)
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [mostrarEliminar, setMostrarEliminar] = useState(false)
  const [productoEliminar, setProductoEliminar] = useState(null)
  const [mostrarImportar, setMostrarImportar] = useState(false)
  const [productoEditarModal, setProductoEditarModal] = useState(null)

  const usuario = JSON.parse(localStorage.getItem("usuario"))

  const columns = [
    {
      key: "sku",
      label: "SKU",
      render: (p) => (
        <span className="font-mono text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
          {p.sku || "—"}
        </span>
      ),
    },
    {
      key: "nombre",
      label: "Producto",
      render: (p) => (
        <div>
          <p className="text-gray-800 font-medium text-sm">{p.nombre}</p>
          {p.modelo && (
            <p className="text-gray-400 text-xs mt-0.5">{p.modelo}</p>
          )}
        </div>
      ),
    },
    {
      key: "codigo_barras",
      label: "Código de barras",
      render: (p) => (
        <span className="text-xs text-gray-500">{p.codigo_barras || "—"}</span>
      ),
    },
    {
      key: "categoria",
      label: "Categoría",
      render: (p) =>
        p.categoria ? (
          <span className="text-xs text-gray-600">{p.categoria}</span>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        ),
    },
    {
      key: "clasificacion_abc",
      label: "ABC",
      render: (p) => <ClasificacionBadge valor={p.clasificacion_abc} />,
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (producto) => (
        <div className="flex gap-2">
          <button
            onClick={() => setProductoEditarModal(producto)}
            className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Editar"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => {
              setProductoEliminar(producto)
              setMostrarEliminar(true)
            }}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
            title="Eliminar"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  useEffect(() => {
    cargarProductos()
  }, [])

  const cargarProductos = async () => {
    try {
      const res = await api.get("/productos")
      setProductos(res.data)
    } catch (error) {
      console.error("Error cargando productos", error)
    }
  }

  const confirmarEliminar = async () => {
    try {
      await api.delete(`/productos/${productoEliminar.id_producto}`)
      toast.success("Producto eliminado correctamente")
      setMostrarEliminar(false)
      cargarProductos()
    } catch (error) {
      toast.error("Error eliminando producto")
      console.error(error)
    }
  }

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(busqueda.toLowerCase()))
  )

  return (
    <div className="flex flex-col gap-6">

      {/* ENCABEZADO */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Productos</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {productos.length} producto{productos.length !== 1 ? "s" : ""} en catálogo
          </p>
        </div>

        {/* ACCIONES */}
        <div className="flex items-center gap-2">

          {/* IMPORTAR (solo admin) */}
          {usuario?.id_rol === 1 && (
            <button
              onClick={() => setMostrarImportar(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition"
            >
              <FiUpload size={14} />
              Importar
            </button>
          )}

          {/* NUEVO PRODUCTO */}
          <button
            onClick={() => setMostrarModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <FiPlus size={14} />
            Nuevo producto
          </button>

        </div>
      </div>

      {/* BUSCADOR + TABLA */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">

        {/* TOOLBAR */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
          <FiBox size={15} className="text-gray-300" />
          <h2 className="text-sm font-semibold text-gray-700 flex-1">
            Catálogo de productos
          </h2>

          {/* BÚSQUEDA */}
          <div className="relative">
            <FiSearch
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
            />
            <input
              type="text"
              placeholder="Buscar producto o SKU…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition w-64"
            />
          </div>
        </div>

        {/* TABLA */}
        <Table columns={columns} data={productosFiltrados} />

      </div>

      {/* MODAL CREAR */}
      {mostrarModal && (
        <ModalProducto
          cerrar={() => setMostrarModal(false)}
          recargar={cargarProductos}
        />
      )}

      {/* MODAL EDITAR */}
      {productoEditarModal && (
        <ModalEditarProducto
          producto={productoEditarModal}
          cerrar={() => setProductoEditarModal(null)}
          recargar={cargarProductos}
        />
      )}

      {/* MODAL ELIMINAR */}
      {mostrarEliminar && (
        <ModalEliminarProducto
          producto={productoEliminar}
          cerrar={() => setMostrarEliminar(false)}
          confirmar={confirmarEliminar}
        />
      )}

      {/* MODAL IMPORTAR */}
      {mostrarImportar && (
        <ModalImportarProductos
          cerrar={() => setMostrarImportar(false)}
        />
      )}

    </div>
  )
}