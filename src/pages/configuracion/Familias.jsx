import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FiEdit2, FiTrash2 } from "react-icons/fi"
import api from "../../api/api"
import CatalogoPage from "../../components/CatalogoPage"
import EstadoBadge from "../../components/EstadoBadge"
import ModalNuevaFamilia from "../../components/familias/ModalNuevaFamilia"
import ModalEditarFamilia from "../../components/familias/ModalEditarFamilia"
import ModalEliminarFamilia from "../../components/familias/ModalEliminarFamilia"
import ModalFamiliasInactivas from "../../components/familias/ModalFamiliasInactivas"
import ModalImportarFamilias from "../../components/familias/ModalImportarFamilias"

export default function Familias() {
  const [familias, setFamilias]               = useState([])
  const [familiasInactivas, setFamiliasInactivas] = useState([])
  const [modalNueva, setModalNueva]           = useState(false)
  const [modalInactivos, setModalInactivos]   = useState(false)
  const [modalImportar, setModalImportar]     = useState(false)
  const [familiaEditar, setFamiliaEditar]     = useState(null)  // ← editar
  const [familiaEliminar, setFamiliaEliminar] = useState(null)  // ← eliminar

  const cargarFamilias = async () => {
    try {
      const res = await api.get("/familias")
      setFamilias(res.data)
    } catch {
      toast.error("Error cargando familias")
    }
  }

  useEffect(() => { cargarFamilias() }, [])

  const cargarInactivos = async () => {
    try {
      const res = await api.get("/familias/inactivas")
      setFamiliasInactivas(res.data)
      setModalInactivos(true)
    } catch {
      toast.error("Error cargando familias inactivas")
    }
  }

  const guardarNueva = async (data) => {
    try {
      await api.post("/familias", data)
      toast.success("Familia creada")
      setModalNueva(false)
      cargarFamilias()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creando familia")
    }
  }

  // ── Editar ──────────────────────────────────────────────
  const guardarEdicion = async (data) => {
    try {
      await api.put(`/familias/${familiaEditar.id_familia}`, data)
      toast.success("Familia actualizada")
      setFamiliaEditar(null)
      cargarFamilias()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error editando familia")
    }
  }

  // ── Eliminar (borrado lógico) ────────────────────────────
  const confirmarEliminar = async () => {
    try {
      await api.delete(`/familias/${familiaEliminar.id_familia}`)
      toast.success("Familia eliminada")
      setFamiliaEliminar(null)
      cargarFamilias()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error eliminando familia")
    }
  }

  const reactivar = async (id) => {
    try {
      await api.put(`/familias/reactivar/${id}`)
      toast.success("Familia reactivada")
      cargarFamilias()
      cargarInactivos()
    } catch {
      toast.error("Error reactivando familia")
    }
  }

  const columns = [
    { key: "codigo", label: "Código" },
    { key: "nombre", label: "Nombre" },
    {
      key: "activo",
      label: "Estado",
      render: (row) => <EstadoBadge activo={row.activo} />,
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (row) => (
        <div className="flex gap-3">
          <button
            onClick={() => setFamiliaEditar(row)}
            className="text-gray-400 hover:text-blue-600 transition-colors"
            title="Editar"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => setFamiliaEliminar(row)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Eliminar"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <CatalogoPage
      titulo="Familias"
      subtitulo="Clasificación principal de productos"
      columns={columns}
      data={familias}
      onNuevo={() => setModalNueva(true)}
      onInactivos={cargarInactivos}
      onImportar={() => setModalImportar(true)}
      labelNuevo="Nueva familia"
    >
      {modalNueva && (
        <ModalNuevaFamilia
          cerrar={() => setModalNueva(false)}
          guardar={guardarNueva}
        />
      )}

      {familiaEditar && (
        <ModalEditarFamilia
          familia={familiaEditar}
          cerrar={() => setFamiliaEditar(null)}
          guardar={guardarEdicion}
        />
      )}

      {familiaEliminar && (
        <ModalEliminarFamilia
          familia={familiaEliminar}
          cerrar={() => setFamiliaEliminar(null)}
          confirmar={confirmarEliminar}
        />
      )}

      {modalInactivos && (
        <ModalFamiliasInactivas
          familias={familiasInactivas}
          cerrar={() => setModalInactivos(false)}
          reactivar={reactivar}
        />
      )}
      {modalImportar && (
        <ModalImportarFamilias
          cargarFamilias={cargarFamilias}
          cerrar={() => setModalImportar(false)}
        />
      )}
    </CatalogoPage>
  )
}