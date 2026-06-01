import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaEdit, FaTrash } from "react-icons/fa"
import api from "../../api/api"

import Table from "../../components/Table"

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

  const cargarAlmacenes = async () => {

    try {

      const res = await api.get("/almacenes")

      setAlmacenes(res.data)

    } catch (error) {

      toast.error("Error cargando almacenes")

    }

  }

  useEffect(() => {
    cargarAlmacenes()
  }, [])

  const cargarInactivos = async () => {

    try {

      const res = await api.get("/almacenes/inactivos")

      setAlmacenesInactivos(res.data)
      setModalInactivos(true)

    } catch (error) {

      toast.error("Error cargando inactivos")

    }

  }

  const guardarNuevo = async (data) => {

    try {

      await api.post("/almacenes", data)

      toast.success("Almacén creado")

      setModalNuevo(false)
      cargarAlmacenes()

    } catch (error) {

      toast.error("Error creando almacén")

    }

  }

  const guardarEdicion = async (data) => {

    try {

      await api.put(`/almacenes/${almacenEditar.id_almacen}`, data)

      toast.success("Almacén actualizado")

      setAlmacenEditar(null)
      cargarAlmacenes()

    } catch (error) {

      toast.error("Error actualizando almacén")

    }

  }

  const confirmarEliminar = async () => {

    try {

      await api.delete(`/almacenes/${almacenEliminar.id_almacen}`)

      toast.success("Almacén desactivado")

      setAlmacenEliminar(null)
      cargarAlmacenes()

    } catch (error) {

      toast.error("Error desactivando almacén")

    }

  }

  const reactivarAlmacen = async (id) => {

    try {

      await api.put(`/almacenes/reactivar/${id}`)

      toast.success("Almacén reactivado")

      cargarAlmacenes()
      cargarInactivos()

    } catch (error) {

      toast.error("Error reactivando almacén")

    }

  }

  const columns = [

    {
      key: "nombre",
      label: "Nombre"
    },

    {
      key: "ubicacion",
      label: "Ubicación",
      render: (row) => row.ubicacion || "-"
    },

    {
      key: "acciones",
      label: "Acciones",
      render: (row) => (

        <div className="flex justify-center gap-4">

          <button
            onClick={() => setAlmacenEditar(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit />
          </button>

          <button
            onClick={() => setAlmacenEliminar(row)}
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
          Almacenes
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
          data={almacenes}
        />
      </div>

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

    </div>

  )

}