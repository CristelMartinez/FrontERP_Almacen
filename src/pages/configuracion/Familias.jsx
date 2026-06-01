import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import api from "../../api/api"
import CatalogoPage from "../../components/CatalogoPage"
import EstadoBadge from "../../components/EstadoBadge"
import ModalNuevaFamilia from "../../components/familias/ModalNuevaFamilia"
import ModalFamiliasInactivas from "../../components/familias/ModalFamiliasInactivas"
import ModalImportarFamilias from "../../components/familias/ModalImportarFamilias"

export default function Familias() {
  const [familias, setFamilias] = useState([])
  const [familiasInactivas, setFamiliasInactivas] = useState([])
  const [modalNueva, setModalNueva] = useState(false)
  const [modalInactivos, setModalInactivos] = useState(false)
  const [modalImportar, setModalImportar] = useState(false)

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