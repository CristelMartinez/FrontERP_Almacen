import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaEdit, FaTrash } from "react-icons/fa"
import api from "../../api/api"

import Table from "../../components/Table"

import ModalNuevoTipoMovimiento from "../../components/tiposMovimiento/ModalNuevoTipoMovimiento"
import ModalEditarTipoMovimiento from "../../components/tiposMovimiento/ModalEditarTipoMovimiento"
import ModalEliminarTipoMovimiento from "../../components/tiposMovimiento/ModalEliminarTipoMovimiento"
import ModalTiposMovimientoInactivos from "../../components/tiposMovimiento/ModalTiposMovimientoInactivos"

export default function TiposMovimiento() {

  const [tipos, setTipos] = useState([])
  const [tipoEditar, setTipoEditar] = useState(null)
  const [tipoEliminar, setTipoEliminar] = useState(null)
  const [modalNuevo, setModalNuevo] = useState(false)
  const [modalInactivos, setModalInactivos] = useState(false)
  const [tiposInactivos, setTiposInactivos] = useState([])

  const cargarTipos = async () => {

    try {

      const res = await api.get("/tipos-movimiento")

      setTipos(res.data)

    } catch (error) {

      toast.error("Error cargando tipos de movimiento")

    }

  }

  useEffect(() => {

    cargarTipos()

  }, [])

  const cargarInactivos = async () => {

    try {

      const res = await api.get("/tipos-movimiento/inactivos")

      setTiposInactivos(res.data)

      setModalInactivos(true)

    } catch (error) {

      toast.error("Error cargando inactivos")

    }

  }

  const guardarNuevo = async (data) => {

    try {

      await api.post("/tipos-movimiento", data)

      toast.success("Tipo creado")

      setModalNuevo(false)

      cargarTipos()

    } catch (error) {

      toast.error("Error creando tipo")

    }

  }

  const guardarEdicion = async (data) => {

    try {

      await api.put(`/tipos-movimiento/${tipoEditar.id_tipo_movimiento}`, data)

      toast.success("Tipo actualizado")

      setTipoEditar(null)

      cargarTipos()

    } catch (error) {

      toast.error("Error actualizando")

    }

  }

  const confirmarEliminar = async () => {

    try {

      await api.delete(`/tipos-movimiento/${tipoEliminar.id_tipo_movimiento}`)

      toast.success("Tipo desactivado")

      setTipoEliminar(null)

      cargarTipos()

    } catch (error) {

      toast.error("Error desactivando")

    }

  }

  const reactivarTipo = async (id) => {

    try {

      await api.put(`/tipos-movimiento/reactivar/${id}`)

      toast.success("Tipo reactivado")

      cargarTipos()
      cargarInactivos()

    } catch (error) {

      toast.error("Error reactivando")

    }

  }

  const columns = [

    {
      key: "nombre",
      label: "Nombre"
    },

    {
      key: "tipo_operacion",
      label: "Tipo operación",
      render: (row) => (

        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.tipo_operacion === "ENTRADA"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.tipo_operacion}
        </span>

      )
    },

    {
      key: "acciones",
      label: "Acciones",
      render: (row) => (

        <div className="flex justify-center gap-4">

          <button
            onClick={() => setTipoEditar(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit />
          </button>

          <button
            onClick={() => setTipoEliminar(row)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash />
          </button>

        </div>

      )
    }

  ]

  return (

    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-semibold">
          Tipos de Movimiento
        </h1>

        <div className="flex gap-3">

          <button
            onClick={cargarInactivos}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Ver inactivos
          </button>

          <button
            onClick={() => setModalNuevo(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Nuevo
          </button>

        </div>

      </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
            <Table
                columns={columns}
                data={tipos}
            />
        </div>
      {tipoEditar && (

        <ModalEditarTipoMovimiento
          tipo={tipoEditar}
          cerrar={() => setTipoEditar(null)}
          guardar={guardarEdicion}
        />

      )}

      {tipoEliminar && (

        <ModalEliminarTipoMovimiento
          tipo={tipoEliminar}
          cerrar={() => setTipoEliminar(null)}
          confirmar={confirmarEliminar}
        />

      )}

      {modalNuevo && (

        <ModalNuevoTipoMovimiento
          cerrar={() => setModalNuevo(false)}
          guardar={guardarNuevo}
        />

      )}

      {modalInactivos && (

        <ModalTiposMovimientoInactivos
          tipos={tiposInactivos}
          cerrar={() => setModalInactivos(false)}
          reactivar={reactivarTipo}
        />

      )}

    </div>

  )

}