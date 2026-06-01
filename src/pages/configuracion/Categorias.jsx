import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FiEdit2, FiTrash2 } from "react-icons/fi"
import api from "../../api/api"
import CatalogoPage from "../../components/CatalogoPage"
import ModalNuevaCategoria from "../../components/categorias/ModalNuevaCategoria"
import ModalEditarCategoria from "../../components/categorias/ModalEditarCategoria"
import ModalEliminarCategoria from "../../components/categorias/ModalEliminarCategoria"
import ModalCategoriasInactivas from "../../components/categorias/ModalCategoriasInactivas"
import ModalImportarCategorias from "../../components/categorias/ModalImportarCategorias"

export default function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [categoriasInactivas, setCategoriasInactivas] = useState([])
  const [categoriaEditar, setCategoriaEditar] = useState(null)
  const [categoriaEliminar, setCategoriaEliminar] = useState(null)
  const [modalNueva, setModalNueva] = useState(false)
  const [modalInactivas, setModalInactivas] = useState(false)
  const [modalImportar, setModalImportar] = useState(false)

  const usuario = JSON.parse(localStorage.getItem("usuario"))

  const cargarCategorias = async () => {
    try {
      const res = await api.get("/categorias")
      setCategorias(res.data)
    } catch {
      toast.error("Error cargando categorías")
    }
  }

  useEffect(() => { cargarCategorias() }, [])

  const cargarInactivas = async () => {
    try {
      const res = await api.get("/categorias/inactivos")
      setCategoriasInactivas(res.data)
      setModalInactivas(true)
    } catch {
      toast.error("Error cargando categorías inactivas")
    }
  }

  const guardarNueva = async (data) => {
    try {
      await api.post("/categorias", data)
      toast.success("Categoría creada")
      setModalNueva(false)
      cargarCategorias()
    } catch {
      toast.error("Error creando categoría")
    }
  }

  const guardarEdicion = async (data) => {
    try {
      await api.put(`/categorias/${categoriaEditar.id_categoria}`, data)
      toast.success("Categoría actualizada")
      setCategoriaEditar(null)
      cargarCategorias()
    } catch {
      toast.error("Error actualizando categoría")
    }
  }

  const confirmarEliminar = async () => {
    try {
      await api.delete(`/categorias/${categoriaEliminar.id_categoria}`)
      toast.success("Categoría desactivada")
      setCategoriaEliminar(null)
      cargarCategorias()
    } catch {
      toast.error("Error desactivando categoría")
    }
  }

  const reactivar = async (id) => {
    try {
      await api.put(`/categorias/reactivar/${id}`)
      toast.success("Categoría reactivada")
      cargarCategorias()
      cargarInactivas()
    } catch {
      toast.error("Error reactivando categoría")
    }
  }

  const columns = [
    { key: "nombre", label: "Nombre" },
    {
      key: "descripcion",
      label: "Descripción",
      render: (row) => (
        <span className="text-gray-400">{row.descripcion || "—"}</span>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCategoriaEditar(row)}
            className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Editar"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => setCategoriaEliminar(row)}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
            title="Desactivar"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <CatalogoPage
      titulo="Categorías"
      subtitulo="Agrupación de productos por tipo de uso"
      columns={columns}
      data={categorias}
      onNuevo={() => setModalNueva(true)}
      onInactivos={cargarInactivas}
      onImportar={usuario?.id_rol === 1 ? () => setModalImportar(true) : null}
      labelNuevo="Nueva categoría"
    >
      {modalNueva && (
        <ModalNuevaCategoria cerrar={() => setModalNueva(false)} guardar={guardarNueva} />
      )}
      {categoriaEditar && (
        <ModalEditarCategoria categoria={categoriaEditar} cerrar={() => setCategoriaEditar(null)} guardar={guardarEdicion} />
      )}
      {categoriaEliminar && (
        <ModalEliminarCategoria categoria={categoriaEliminar} cerrar={() => setCategoriaEliminar(null)} confirmar={confirmarEliminar} />
      )}
      {modalInactivas && (
        <ModalCategoriasInactivas categorias={categoriasInactivas} cerrar={() => setModalInactivas(false)} reactivar={reactivar} />
      )}
      {modalImportar && (
        <ModalImportarCategorias cerrar={() => setModalImportar(false)} />
      )}
    </CatalogoPage>
  )
}