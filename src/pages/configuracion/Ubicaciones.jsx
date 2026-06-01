import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FiTrash2 } from "react-icons/fi"
import api from "../../api/api"
import CatalogoPage from "../../components/CatalogoPage"
import ModalNuevaUbicacion from "../../components/ubicaciones/ModalNuevaUbicacion"
import ModalEditarUbicacion from "../../components/ubicaciones/ModalEditarUbicacion"
import ModalEliminarUbicacion from "../../components/ubicaciones/ModalEliminarUbicacion"
import ModalUbicacionesInactivas from "../../components/ubicaciones/ModalUbicacionesInactivas"
import ModalImportarUbicaciones from "../../components/ubicaciones/ModalImportarUbicaciones"

export default function Ubicaciones() {
  const [ubicaciones, setUbicaciones] = useState([])
  const [ubicacionesInactivas, setUbicacionesInactivas] = useState([])
  const [ubicacionEditar, setUbicacionEditar] = useState(null)
  const [ubicacionEliminar, setUbicacionEliminar] = useState(null)
  const [modalNueva, setModalNueva] = useState(false)
  const [modalInactivas, setModalInactivas] = useState(false)
  const [modalImportar, setModalImportar] = useState(false)

  const usuario = JSON.parse(localStorage.getItem("usuario"))

  const cargarUbicaciones = async () => {
    try {
      const res = await api.get("/ubicaciones")
      setUbicaciones(res.data)
    } catch {
      toast.error("Error cargando ubicaciones")
    }
  }

  useEffect(() => { cargarUbicaciones() }, [])

  const cargarInactivas = async () => {
    try {
      const res = await api.get("/ubicaciones/inactivos")
      setUbicacionesInactivas(res.data)
      setModalInactivas(true)
    } catch {
      toast.error("Error cargando ubicaciones inactivas")
    }
  }

  const guardarNueva = async (data) => {
    try {
      await api.post("/ubicaciones", data)
      toast.success("Ubicación creada")
      setModalNueva(false)
      cargarUbicaciones()
    } catch {
      toast.error("Error creando ubicación")
    }
  }

  const guardarEdicion = async (data) => {
    try {
      await api.put(`/ubicaciones/${ubicacionEditar.id_ubicacion}`, data)
      toast.success("Ubicación actualizada")
      setUbicacionEditar(null)
      cargarUbicaciones()
    } catch {
      toast.error("Error actualizando ubicación")
    }
  }

  const confirmarEliminar = async () => {
    try {
      await api.delete(`/ubicaciones/${ubicacionEliminar.id_ubicacion}`)
      toast.success("Ubicación desactivada")
      setUbicacionEliminar(null)
      cargarUbicaciones()
    } catch {
      toast.error("Error desactivando ubicación")
    }
  }

  const reactivar = async (id) => {
    try {
      await api.put(`/ubicaciones/reactivar/${id}`)
      toast.success("Ubicación reactivada")
      cargarUbicaciones()
      cargarInactivas()
    } catch {
      toast.error("Error reactivando ubicación")
    }
  }

  const columns = [
    { key: "codigo", label: "Código" },
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
          {/* El editar está comentado en el original — se mantiene listo para activar */}
          {/* <button
            onClick={() => setUbicacionEditar(row)}
            className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Editar"
          >
            <FiEdit2 size={14} />
          </button> */}
          <button
            onClick={() => setUbicacionEliminar(row)}
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
      titulo="Ubicaciones"
      subtitulo="Zonas o pasillos donde se almacenan los productos"
      columns={columns}
      data={ubicaciones}
      onNuevo={() => setModalNueva(true)}
      onInactivos={cargarInactivas}
      onImportar={usuario?.id_rol === 1 ? () => setModalImportar(true) : null}
      labelNuevo="Nueva ubicación"
    >
      {modalNueva && (
        <ModalNuevaUbicacion cerrar={() => setModalNueva(false)} guardar={guardarNueva} />
      )}
      {ubicacionEditar && (
        <ModalEditarUbicacion ubicacion={ubicacionEditar} cerrar={() => setUbicacionEditar(null)} guardar={guardarEdicion} />
      )}
      {ubicacionEliminar && (
        <ModalEliminarUbicacion ubicacion={ubicacionEliminar} cerrar={() => setUbicacionEliminar(null)} confirmar={confirmarEliminar} />
      )}
      {modalInactivas && (
        <ModalUbicacionesInactivas ubicaciones={ubicacionesInactivas} cerrar={() => setModalInactivas(false)} reactivar={reactivar} />
      )}
      {modalImportar && (
        <ModalImportarUbicaciones cerrar={() => setModalImportar(false)} />
      )}
    </CatalogoPage>
  )
}