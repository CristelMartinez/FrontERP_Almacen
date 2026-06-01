import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FiEdit2, FiTrash2 } from "react-icons/fi"
import api from "../../api/api"
import CatalogoPage from "../../components/CatalogoPage"
import ModalNuevaUnidad from "../../components/unidades/ModalNuevaUnidad"
import ModalEditarUnidad from "../../components/unidades/ModalEditarUnidad"
import ModalEliminarUnidad from "../../components/unidades/ModalEliminarUnidad"
import ModalUnidadesInactivas from "../../components/unidades/ModalUnidadesInactivas"
import ModalImportarUnidades from "../../components/unidades/ModalImportarUnidades"

export default function Unidades() {
  const [unidades, setUnidades] = useState([])
  const [unidadesInactivas, setUnidadesInactivas] = useState([])
  const [unidadEditar, setUnidadEditar] = useState(null)
  const [unidadEliminar, setUnidadEliminar] = useState(null)
  const [modalNueva, setModalNueva] = useState(false)
  const [modalInactivas, setModalInactivas] = useState(false)
  const [modalImportar, setModalImportar] = useState(false)

  const usuario = JSON.parse(localStorage.getItem("usuario"))

  const cargarUnidades = async () => {
    try {
      const res = await api.get("/unidades")
      setUnidades(res.data)
    } catch {
      toast.error("Error cargando unidades")
    }
  }

  useEffect(() => { cargarUnidades() }, [])

  const cargarInactivas = async () => {
    try {
      const res = await api.get("/unidades/inactivos")
      setUnidadesInactivas(res.data)
      setModalInactivas(true)
    } catch {
      toast.error("Error cargando unidades inactivas")
    }
  }

  const guardarNueva = async (data) => {
    try {
      await api.post("/unidades", data)
      toast.success("Unidad creada")
      setModalNueva(false)
      cargarUnidades()
    } catch {
      toast.error("Error creando unidad")
    }
  }

  const guardarEdicion = async (data) => {
    try {
      await api.put(`/unidades/${unidadEditar.id_unidad}`, data)
      toast.success("Unidad actualizada")
      setUnidadEditar(null)
      cargarUnidades()
    } catch {
      toast.error("Error actualizando unidad")
    }
  }

  const confirmarEliminar = async () => {
    try {
      await api.delete(`/unidades/${unidadEliminar.id_unidad}`)
      toast.success("Unidad desactivada")
      setUnidadEliminar(null)
      cargarUnidades()
    } catch {
      toast.error("Error desactivando unidad")
    }
  }

  const reactivar = async (id) => {
    try {
      await api.put(`/unidades/reactivar/${id}`)
      toast.success("Unidad reactivada")
      cargarUnidades()
      cargarInactivas()
    } catch {
      toast.error("Error reactivando unidad")
    }
  }

  const columns = [
    { key: "nombre", label: "Nombre" },
    {
      key: "abreviatura",
      label: "Abreviatura",
      render: (row) => (
        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
          {row.abreviatura}
        </span>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setUnidadEditar(row)}
            className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Editar"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => setUnidadEliminar(row)}
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
      titulo="Unidades de medida"
      subtitulo="Unidades utilizadas para controlar el stock"
      columns={columns}
      data={unidades}
      onNuevo={() => setModalNueva(true)}
      onInactivos={cargarInactivas}
      onImportar={usuario?.id_rol === 1 ? () => setModalImportar(true) : null}
      labelNuevo="Nueva unidad"
    >
      {modalNueva && (
        <ModalNuevaUnidad cerrar={() => setModalNueva(false)} guardar={guardarNueva} />
      )}
      {unidadEditar && (
        <ModalEditarUnidad unidad={unidadEditar} cerrar={() => setUnidadEditar(null)} guardar={guardarEdicion} />
      )}
      {unidadEliminar && (
        <ModalEliminarUnidad unidad={unidadEliminar} cerrar={() => setUnidadEliminar(null)} confirmar={confirmarEliminar} />
      )}
      {modalInactivas && (
        <ModalUnidadesInactivas unidades={unidadesInactivas} cerrar={() => setModalInactivas(false)} reactivar={reactivar} />
      )}
      {modalImportar && (
        <ModalImportarUnidades cerrar={() => setModalImportar(false)} />
      )}
    </CatalogoPage>
  )
}