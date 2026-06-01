import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FiEdit2, FiTrash2 } from "react-icons/fi"
import api from "../../api/api"

import CatalogoPage from "../../components/CatalogoPage"
import ModalNuevoDepartamento from "../../components/departamentos/ModalNuevoDepartamento"
import ModalEditarDepartamento from "../../components/departamentos/ModalEditarDepartamento"
import ModalEliminarDepartamento from "../../components/departamentos/ModalEliminarDepartamento"
import ModalDepartamentosInactivos from "../../components/departamentos/ModalDepartamentosInactivos"

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState([])
  const [departamentosInactivos, setDepartamentosInactivos] = useState([])
  const [departamentoEditar, setDepartamentoEditar] = useState(null)
  const [departamentoEliminar, setDepartamentoEliminar] = useState(null)
  const [modalNuevo, setModalNuevo] = useState(false)
  const [modalInactivos, setModalInactivos] = useState(false)

  useEffect(() => { cargarDepartamentos() }, [])

  const cargarDepartamentos = async () => {
    try {
      const res = await api.get("/departamentos")
      setDepartamentos(res.data)
    } catch {
      toast.error("Error cargando departamentos")
    }
  }

  const cargarInactivos = async () => {
    try {
      const res = await api.get("/departamentos/inactivos")
      setDepartamentosInactivos(res.data)
      setModalInactivos(true)
    } catch {
      toast.error("Error cargando departamentos inactivos")
    }
  }

  const guardarNuevo = async (data) => {
    try {
      await api.post("/departamentos", data)
      toast.success("Departamento creado")
      setModalNuevo(false)
      cargarDepartamentos()
    } catch {
      toast.error("Error creando departamento")
    }
  }

  const guardarEdicion = async (data) => {
    try {
      await api.put(`/departamentos/${departamentoEditar.id_departamento}`, data)
      toast.success("Departamento actualizado")
      setDepartamentoEditar(null)
      cargarDepartamentos()
    } catch {
      toast.error("Error actualizando departamento")
    }
  }

  const confirmarEliminar = async () => {
    try {
      await api.delete(`/departamentos/${departamentoEliminar.id_departamento}`)
      toast.success("Departamento desactivado")
      setDepartamentoEliminar(null)
      cargarDepartamentos()
    } catch {
      toast.error("Error desactivando departamento")
    }
  }

  const reactivarDepartamento = async (id) => {
    try {
      await api.put(`/departamentos/reactivar/${id}`)
      toast.success("Departamento reactivado")
      cargarDepartamentos()
      cargarInactivos()
    } catch {
      toast.error("Error reactivando departamento")
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
      key: "acciones",
      label: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDepartamentoEditar(row)}
            className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Editar"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => setDepartamentoEliminar(row)}
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
      titulo="Departamentos"
      subtitulo="Áreas y divisiones de la organización"
      columns={columns}
      data={departamentos}
      onNuevo={() => setModalNuevo(true)}
      onInactivos={cargarInactivos}
      labelNuevo="Nuevo departamento"
    >
      {modalNuevo && (
        <ModalNuevoDepartamento
          cerrar={() => setModalNuevo(false)}
          guardar={guardarNuevo}
        />
      )}
      {departamentoEditar && (
        <ModalEditarDepartamento
          departamento={departamentoEditar}
          cerrar={() => setDepartamentoEditar(null)}
          guardar={guardarEdicion}
        />
      )}
      {departamentoEliminar && (
        <ModalEliminarDepartamento
          departamento={departamentoEliminar}
          cerrar={() => setDepartamentoEliminar(null)}
          confirmar={confirmarEliminar}
        />
      )}
      {modalInactivos && (
        <ModalDepartamentosInactivos
          departamentos={departamentosInactivos}
          cerrar={() => setModalInactivos(false)}
          reactivar={reactivarDepartamento}
        />
      )}
    </CatalogoPage>
  )
}