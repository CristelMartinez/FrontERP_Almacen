import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FiEdit2, FiTrash2 } from "react-icons/fi"
import api from "../../api/api"
import CatalogoPage from "../../components/CatalogoPage"
import EstadoBadge from "../../components/EstadoBadge"
import ModalNuevaSubfamilia from "../../components/subfamilias/ModalNuevaSubfamilia"
import ModalEditarSubfamilia from "../../components/subfamilias/ModalEditarSubfamilia"
import ModalEliminarSubfamilia from "../../components/subfamilias/ModalEliminarSubfamilia"
import ModalSubfamiliasInactivas from "../../components/subfamilias/ModalSubfamiliasInactivas"
import ModalImportarSubfamilias from "../../components/subfamilias/ModalImportarSubfamilia"

export default function Subfamilias() {
  const [subfamilias, setSubfamilias] = useState([])
  const [subfamiliasInactivas, setSubfamiliasInactivas] = useState([])
  const [modalNueva, setModalNueva] = useState(false)
  const [modalInactivos, setModalInactivos] = useState(false)
  const [modalImportar, setModalImportar] = useState(false)
  const [subfamiliaEditar, setSubfamiliaEditar] = useState(null) // ← nueva
  const [subfamiliaEliminar, setSubfamiliaEliminar] = useState(null) // ← nueva

  const cargarSubfamilias = async () => {
    try {
      const res = await api.get("/subfamilias")
      setSubfamilias(res.data)
    } catch {
      toast.error("Error cargando subfamilias")
    }
  }

  useEffect(() => { cargarSubfamilias() }, [])

  const cargarInactivos = async () => {
    try {
      const res = await api.get("/subfamilias/inactivas")
      setSubfamiliasInactivas(res.data)
      setModalInactivos(true)
    } catch {
      toast.error("Error cargando subfamilias inactivas")
    }
  }

  const guardarNueva = async (data) => {
    try {
      await api.post("/subfamilias", data)
      toast.success("Subfamilia creada")
      setModalNueva(false)
      cargarSubfamilias()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creando subfamilia")
    }
  }

  // ── Editar ──────────────────────────────────────────────
  const guardarEdicion = async (data) => {
    try {
      await api.put(`/subfamilias/${subfamiliaEditar.id_subfamilia}`, data)
      toast.success("Subfamilia actualizada")
      setSubfamiliaEditar(null)
      cargarSubfamilias()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error editando subfamilia")
    }
  }

  // ── Eliminar (borrado lógico) ────────────────────────────
  const confirmarEliminar = async () => {
    try {
      await api.delete(`/subfamilias/${subfamiliaEliminar.id_subfamilia}`)
      toast.success("Subfamilia eliminada")
      setSubfamiliaEliminar(null)
      cargarSubfamilias()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error eliminando subfamilia")
    }
  }

  const reactivar = async (id) => {
    try {
      await api.put(`/subfamilias/reactivar/${id}`)
      toast.success("Subfamilia reactivada")
      cargarSubfamilias()
      cargarInactivos()
    } catch {
      toast.error("Error reactivando subfamilia")
    }
  }

  const columns = [
    {
      key: "familia",
      label: "Familia",
      render: (row) => (
        <span className="text-gray-500">
          {row.familia_codigo}
          <span className="mx-1 text-gray-300">·</span>
          {row.familia_nombre}
        </span>
      ),
    },
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
            onClick={() => setSubfamiliaEditar(row)}
            className="text-gray-400 hover:text-blue-600 transition-colors"
            title="Editar"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => setSubfamiliaEliminar(row)}
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
      titulo="Subfamilias"
      subtitulo="Clasificación secundaria vinculada a una familia"
      columns={columns}
      data={subfamilias}
      onNuevo={() => setModalNueva(true)}
      onInactivos={cargarInactivos}
      onImportar={() => setModalImportar(true)}
      labelNuevo="Nueva subfamilia"
    >
      {modalNueva && (
        <ModalNuevaSubfamilia
          cerrar={() => setModalNueva(false)}
          guardar={guardarNueva}
        />
      )}

      {subfamiliaEditar && (
        <ModalEditarSubfamilia
          subfamilia={subfamiliaEditar}
          cerrar={() => setSubfamiliaEditar(null)}
          guardar={guardarEdicion}
        />
      )}

      {subfamiliaEliminar && (
        <ModalEliminarSubfamilia
          subfamilia={subfamiliaEliminar}
          cerrar={() => setSubfamiliaEliminar(null)}
          confirmar={confirmarEliminar}
        />
      )}

      {modalInactivos && (
        <ModalSubfamiliasInactivas
          subfamilias={subfamiliasInactivas}
          cerrar={() => setModalInactivos(false)}
          reactivar={reactivar}
        />
      )}
      {modalImportar && (
        <ModalImportarSubfamilias
          cargarSubfamilias={cargarSubfamilias}
          cerrar={() => setModalImportar(false)}
        />
      )}
    </CatalogoPage>
  )
}