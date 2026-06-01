import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FiEdit2, FiTrash2 } from "react-icons/fi"
import api from "../../api/api"

import CatalogoPage from "../../components/CatalogoPage"
import ModalNuevoAlmacen from "../../components/almacenes/ModalNuevoAlmacen"
import ModalEditarAlmacen from "../../components/almacenes/ModalEditarAlmacen"
import ModalEliminarAlmacen from "../../components/almacenes/ModalEliminarAlmacen"
import ModalAlmacenesInactivos from "../../components/almacenes/ModalAlmacenesInactivos"

export default function Almacenes() {
  const [almacenes, setAlmacenes] = useState([])
  const [almacenEditar, setAlmacenEditar] = useState(null)
  const [almacenEliminar, setAlmacenEliminar] = useState(null)
  const [modalNuevo, setModalNuevo] = useState(false)
  const [modalInactivos, setModalInactivos] = useState(false)
  const [almacenesInactivos, setAlmacenesInactivos] = useState([])

  useEffect(() => { cargarAlmacenes() }, [])

  const cargarAlmacenes = async () => {
    try {
      const res = await api.get("/almacenes")
      setAlmacenes(res.data)
    } catch {
      toast.error("Error cargando almacenes")
    }
  }

  const cargarInactivos = async () => {
    try {
      const res = await api.get("/almacenes/inactivos")
      setAlmacenesInactivos(res.data)
      setModalInactivos(true)
    } catch {
      toast.error("Error cargando inactivos")
    }
  }

  const guardarNuevo = async (data) => {
    try {
      await api.post("/almacenes", data)
      toast.success("Almacén creado")
      setModalNuevo(false)
      cargarAlmacenes()
    } catch {
      toast.error("Error creando almacén")
    }
  }

  const guardarEdicion = async (data) => {
    try {
      await api.put(`/almacenes/${almacenEditar.id_almacen}`, data)
      toast.success("Almacén actualizado")
      setAlmacenEditar(null)
      cargarAlmacenes()
    } catch {
      toast.error("Error actualizando almacén")
    }
  }

  const confirmarEliminar = async () => {
    try {
      await api.delete(`/almacenes/${almacenEliminar.id_almacen}`)
      toast.success("Almacén desactivado")
      setAlmacenEliminar(null)
      cargarAlmacenes()
    } catch {
      toast.error("Error desactivando almacén")
    }
  }

  const reactivarAlmacen = async (id) => {
    try {
      await api.put(`/almacenes/reactivar/${id}`)
      toast.success("Almacén reactivado")
      cargarAlmacenes()
      cargarInactivos()
    } catch {
      toast.error("Error reactivando almacén")
    }
  }

  const columns = [
    {
      key: "nombre",
      label: "Nombre",
      render: (row) => (
        <span className="text-gray-800 font-medium text-sm">{row.nombre}</span>
      ),
    },
    {
      key: "ubicacion",
      label: "Ubicación",
      render: (row) => (
        <span className="text-sm text-gray-400">{row.ubicacion || "—"}</span>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setAlmacenEditar(row)}
            className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Editar"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => setAlmacenEliminar(row)}
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
      titulo="Almacenes"
      subtitulo="Gestión de ubicaciones de almacenamiento"
      columns={columns}
      data={almacenes}
      onNuevo={() => setModalNuevo(true)}
      onInactivos={cargarInactivos}
      labelNuevo="Nuevo almacén"
    >
      {almacenEditar && (
        <ModalEditarAlmacen
          almacen={almacenEditar}
          cerrar={() => setAlmacenEditar(null)}
          guardar={guardarEdicion}
        />
      )}
      {almacenEliminar && (
        <ModalEliminarAlmacen
          almacen={almacenEliminar}
          cerrar={() => setAlmacenEliminar(null)}
          confirmar={confirmarEliminar}
        />
      )}
      {modalNuevo && (
        <ModalNuevoAlmacen
          cerrar={() => setModalNuevo(false)}
          guardar={guardarNuevo}
        />
      )}
      {modalInactivos && (
        <ModalAlmacenesInactivos
          almacenes={almacenesInactivos}
          cerrar={() => setModalInactivos(false)}
          reactivar={reactivarAlmacen}
        />
      )}
    </CatalogoPage>
  )
}