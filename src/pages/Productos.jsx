import { useEffect, useState } from "react"
import api from "../api/api"
import toast from "react-hot-toast"
import Table from "../components/Table"
import EstadoBadge from "../components/EstadoBadge"
import ModalProducto from "../components/productos/ModalProducto"
import ModalEditarProducto from "../components/productos/ModalEditarProducto"
import ModalEliminarProducto from "../components/productos/ModalEliminarProducto"
import ModalImportarProductos from "../components/productos/ModalImportarProductos"
import {
  FiPlus,
  FiDownload,
  FiSearch,
  FiX,
  FiEdit2,
  FiTrash2,
  FiArchive,
  FiRefreshCw,
} from "react-icons/fi"

/* ─── SKU BADGE ──────────────────────────────────────────────── */
function SkuBadge({ sku }) {
  if (!sku) return <span className="text-gray-300">—</span>
  return (
    <span className="font-mono text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
      {sku}
    </span>
  )
}

/* ─── PRODUCTOS ──────────────────────────────────────────────── */
export default function Productos() {
  const [productos, setProductos] = useState([])
  const [productosInactivos, setProductosInactivos] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [cargando, setCargando] = useState(true)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarImportar, setMostrarImportar] = useState(false)
  const [mostrarInactivos, setMostrarInactivos] = useState(false)
  const [productoEditar, setProductoEditar] = useState(null)
  const [productoEliminar, setProductoEliminar] = useState(null)
  const [mostrarEliminar, setMostrarEliminar] = useState(false)

  const usuario = JSON.parse(localStorage.getItem("usuario"))

  useEffect(() => { cargarProductos() }, [])

  const cargarProductos = async () => {
    setCargando(true)
    try {
      const res = await api.get("/productos")
      setProductos(res.data)
    } catch {
      toast.error("Error cargando productos")
    } finally {
      setCargando(false)
    }
  }

  const cargarInactivos = async () => {
    try {
      const res = await api.get("/productos/inactivos")
      setProductosInactivos(res.data)
      setMostrarInactivos(true)
    } catch {
      toast.error("Error cargando productos inactivos")
    }
  }

  const reactivarProducto = async (id) => {
    try {
      await api.put(`/productos/reactivar/${id}`)
      toast.success("Producto reactivado")
      cargarProductos()
      cargarInactivos()
    } catch {
      toast.error("Error reactivando producto")
    }
  }

  const confirmarEliminar = async () => {
    try {
      await api.delete(`/productos/${productoEliminar.id_producto}`)
      toast.success("Producto desactivado")
      setMostrarEliminar(false)
      setProductoEliminar(null)
      cargarProductos()
    } catch {
      toast.error("Error desactivando producto")
    }
  }

  /* FILTRO LOCAL */
  const datos = productos.filter((p) => {
    if (!busqueda) return true
    const q = busqueda.toLowerCase()
    return (
      p.nombre?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.codigo_barras?.toLowerCase().includes(q) ||
      p.categoria?.toLowerCase().includes(q) ||
      p.modelo?.toLowerCase().includes(q)
    )
  })

  const columns = [
    {
      key: "sku",
      label: "SKU",
      render: (row) => <SkuBadge sku={row.sku} />,
    },
    {
      key: "nombre",
      label: "Producto",
      render: (row) => (
        <div>
          <p className="text-gray-700 font-medium leading-tight">{row.nombre}</p>
          {row.modelo && (
            <p className="text-xs text-gray-400 leading-tight mt-0.5">{row.modelo}</p>
          )}
        </div>
      ),
    },
    {
      key: "codigo_barras",
      label: "Cód. barras",
      render: (row) =>
        row.codigo_barras ? (
          <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {row.codigo_barras}
          </span>
        ) : (
          <span className="text-gray-300">—</span>
        ),
    },
    {
      key: "categoria",
      label: "Categoría",
      render: (row) => (
        <span className="text-gray-500 text-sm">{row.categoria || "—"}</span>
      ),
    },
    {
      key: "activo",
      label: "Estado",
      render: (row) => <EstadoBadge activo={row.activo} />,
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setProductoEditar(row)}
            className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Editar producto"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => {
              setProductoEliminar(row)
              setMostrarEliminar(true)
            }}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
            title="Desactivar producto"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  /* COLUMNAS INACTIVOS */
  const columnsInactivos = [
    {
      key: "sku",
      label: "SKU",
      render: (row) => <SkuBadge sku={row.sku} />,
    },
    {
      key: "nombre",
      label: "Producto",
      render: (row) => (
        <div>
          <p className="text-gray-500 leading-tight">{row.nombre}</p>
          {row.modelo && (
            <p className="text-xs text-gray-400 leading-tight mt-0.5">{row.modelo}</p>
          )}
        </div>
      ),
    },
    {
      key: "categoria",
      label: "Categoría",
      render: (row) => (
        <span className="text-gray-400 text-sm">{row.categoria || "—"}</span>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (row) => (
        <button
          onClick={() => reactivarProducto(row.id_producto)}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition"
        >
          <FiRefreshCw size={12} />
          Reactivar
        </button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">

      {/* ENCABEZADO */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Productos</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Catálogo de productos del almacén
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={cargarInactivos}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <FiArchive size={14} />
            Inactivos
          </button>

          {usuario?.id_rol === 1 && (
            <button
              onClick={() => setMostrarImportar(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <FiDownload size={14} />
              Importar
            </button>
          )}

          <button
            onClick={() => setMostrarModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            <FiPlus size={15} />
            Nuevo producto
          </button>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="relative w-full sm:max-w-sm">
        <FiSearch
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
        />
        <input
          type="text"
          placeholder="Buscar por nombre, SKU, categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-9 pr-9 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
        />
        {busqueda && (
          <button
            onClick={() => setBusqueda("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
          >
            <FiX size={13} />
          </button>
        )}
      </div>

      {/* TABLA ACTIVOS */}
      <div className="bg-white rounded-xl border border-gray-100">
        {cargando ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <Table columns={columns} data={datos} />
        )}
      </div>

      {/* CONTADOR */}
      {!cargando && datos.length > 0 && (
        <p className="text-xs text-gray-400">
          {datos.length} {datos.length === 1 ? "producto" : "productos"}
          {busqueda && ` para "${busqueda}"`}
        </p>
      )}

      {/* PANEL INACTIVOS — inline debajo de la tabla */}
      {mostrarInactivos && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <FiArchive size={15} className="text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-700">
                Productos inactivos
              </h2>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {productosInactivos.length}
              </span>
            </div>
            <button
              onClick={() => setMostrarInactivos(false)}
              className="text-gray-300 hover:text-gray-500 transition"
            >
              <FiX size={15} />
            </button>
          </div>
          <Table columns={columnsInactivos} data={productosInactivos} />
        </div>
      )}

      {/* MODALES */}
      {mostrarModal && (
        <ModalProducto
          cerrar={() => setMostrarModal(false)}
          recargar={cargarProductos}
        />
      )}

      {productoEditar && (
        <ModalEditarProducto
          producto={productoEditar}
          cerrar={() => setProductoEditar(null)}
          recargar={cargarProductos}
        />
      )}

      {mostrarEliminar && productoEliminar && (
        <ModalEliminarProducto
          producto={productoEliminar}
          cerrar={() => {
            setMostrarEliminar(false)
            setProductoEliminar(null)
          }}
          confirmar={confirmarEliminar}
        />
      )}

      {mostrarImportar && (
        <ModalImportarProductos
          cargarProductos={cargarProductos}
          cerrar={() => setMostrarImportar(false)}
        />
      )}

    </div>
  )
}