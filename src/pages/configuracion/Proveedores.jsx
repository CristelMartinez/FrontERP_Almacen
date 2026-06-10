import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FiEdit2, FiTrash2 } from "react-icons/fi"
import api from "../../api/api"
import CatalogoPage from "../../components/CatalogoPage"
import ModalNuevoProveedor from "../../components/proveedores/ModalNuevoProveedor"
import ModalEditarProveedor from "../../components/proveedores/ModalEditarProveedor"
import ModalEliminarProveedor from "../../components/proveedores/ModalEliminarProveedor"
import ModalProveedoresInactivos from "../../components/proveedores/ModalProveedoresInactivos"
import ModalImportarProveedores from "../../components/proveedores/ModalImportarProveedor"

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([])
  const [proveedoresInactivos, setProveedoresInactivos] = useState([])
  const [proveedorEditar, setProveedorEditar] = useState(null)
  const [proveedorEliminar, setProveedorEliminar] = useState(null)
  const [modalNuevo, setModalNuevo] = useState(false)
  const [modalInactivos, setModalInactivos] = useState(false)
  const [modalImportar, setModalImportar] = useState(false)

  const usuario = JSON.parse(localStorage.getItem("usuario"))

  const cargarProveedores = async () => {
    try {
      const res = await api.get("/proveedores")
      setProveedores(res.data)
    } catch {
      toast.error("Error cargando proveedores")
    }
  }

  useEffect(() => { cargarProveedores() }, [])

  const cargarInactivos = async () => {
    try {
      const res = await api.get("/proveedores/inactivos")
      setProveedoresInactivos(res.data)
      setModalInactivos(true)
    } catch {
      toast.error("Error cargando proveedores inactivos")
    }
  }

  const guardarNuevo = async (data) => {
    try {
      await api.post("/proveedores", data)
      toast.success("Proveedor creado")
      setModalNuevo(false)
      cargarProveedores()
    } catch {
      toast.error("Error creando proveedor")
    }
  }

  const guardarEdicion = async (data) => {
    try {
      await api.put(`/proveedores/${proveedorEditar.id_proveedor}`, data)
      toast.success("Proveedor actualizado")
      setProveedorEditar(null)
      cargarProveedores()
    } catch {
      toast.error("Error actualizando proveedor")
    }
  }

  const confirmarEliminar = async () => {
    try {
      await api.delete(`/proveedores/${proveedorEliminar.id_proveedor}`)
      toast.success("Proveedor desactivado")
      setProveedorEliminar(null)
      cargarProveedores()
    } catch {
      toast.error("No se pudo desactivar el proveedor")
    }
  }

  const reactivar = async (id) => {
    try {
      await api.put(`/proveedores/reactivar/${id}`)
      toast.success("Proveedor reactivado")
      cargarProveedores()
      cargarInactivos()
    } catch {
      toast.error("Error reactivando proveedor")
    }
  }

  const columns = [
    { key: "nombre", label: "Nombre" },
    {
      key: "numero_contacto",
      label: "Teléfono",
      render: (row) => (
        <span className="text-gray-400">{row.numero_contacto || "—"}</span>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setProveedorEditar(row)}
            className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Editar"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => setProveedorEliminar(row)}
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
      titulo="Proveedores"
      subtitulo="Empresas o personas que surten el inventario"
      columns={columns}
      data={proveedores}
      onNuevo={() => setModalNuevo(true)}
      onInactivos={cargarInactivos}
      onImportar={usuario?.id_rol === 1 ? () => setModalImportar(true) : null}
      labelNuevo="Nuevo proveedor"
    >
      {modalNuevo && (
        <ModalNuevoProveedor cerrar={() => setModalNuevo(false)} guardar={guardarNuevo} />
      )}
      {proveedorEditar && (
        <ModalEditarProveedor proveedor={proveedorEditar} cerrar={() => setProveedorEditar(null)} guardar={guardarEdicion} />
      )}
      {proveedorEliminar && (
        <ModalEliminarProveedor proveedor={proveedorEliminar} cerrar={() => setProveedorEliminar(null)} confirmar={confirmarEliminar} />
      )}
      {modalInactivos && (
        <ModalProveedoresInactivos proveedores={proveedoresInactivos} cerrar={() => setModalInactivos(false)} reactivar={reactivar} />
      )}
      {modalImportar && (
        <ModalImportarProveedores
          cargarProveedores={cargarProveedores}
          cerrar={() => setModalImportar(false)}
        />
      )}
    </CatalogoPage>
  )
}