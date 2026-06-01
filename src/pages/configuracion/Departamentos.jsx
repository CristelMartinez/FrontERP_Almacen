import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaEdit, FaTrash } from "react-icons/fa"
import api from "../../api/api"

import Table from "../../components/Table"

import ModalEliminarDepartamento from "../../components/departamentos/ModalEliminarDepartamento"
import ModalEditarDepartamento from "../../components/departamentos/ModalEditarDepartamento"
import ModalNuevoDepartamento from "../../components/departamentos/ModalNuevoDepartamento"
import ModalDepartamentosInactivos from "../../components/departamentos/ModalDepartamentosInactivos"

export default function Departamentos() {

    const [departamentos, setDepartamentos] = useState([])
    const [departamentoEditar, setDepartamentoEditar] = useState(null)
    const [departamentoEliminar, setDepartamentoEliminar] = useState(null)
    const [modalNuevoDepartamento, setModalNuevoDepartamento] = useState(false)
    const [modalInactivos, setModalInactivos] = useState(false)
    const [departamentosInactivos, setDepartamentosInactivos] = useState([])

    const cargarDepartamentos = async () => {

        try {

            const res = await api.get("/departamentos")

            setDepartamentos(res.data)

        } catch (error) {

            console.error(error)

            toast.error("Error cargando departamentos")

        }

    }

    useEffect(() => {

        cargarDepartamentos()

    }, [])

    const confirmarEliminar = async () => {

        try {

            await api.delete(`/departamentos/${departamentoEliminar.id_departamento}`)

            toast.success("Departamento eliminado")

            setDepartamentoEliminar(null)

            cargarDepartamentos()

        } catch (error) {

            toast.error("No se pudo eliminar")

        }

    }

    const guardarEdicion = async (data) => {

        try {

            await api.put(`/departamentos/${departamentoEditar.id_departamento}`, data)

            toast.success("Departamento actualizado")

            setDepartamentoEditar(null)

            cargarDepartamentos()

        } catch (error) {

            toast.error("Error actualizando departamento")

        }

    }

    const guardarNuevoDepartamento = async (data) => {

        try {

            await api.post("/departamentos", data)

            toast.success("Departamento creado")

            setModalNuevoDepartamento(false)

            cargarDepartamentos()

        } catch (error) {

            toast.error("Error creando departamento")

        }

    }

    const cargarInactivos = async () => {

        try {

            const res = await api.get("/departamentos/inactivos")

            setDepartamentosInactivos(res.data)

            setModalInactivos(true)

        } catch (error) {

            toast.error("Error cargando departamentos inactivos")

        }

    }

    const reactivarDepartamento = async (id) => {

        try {

            await api.put(`/departamentos/reactivar/${id}`)

            toast.success("Departamento reactivado")

            cargarDepartamentos()
            cargarInactivos()

        } catch (error) {

            toast.error("Error reactivando departamento")

        }

    }

    const columns = [

        {
            key: "nombre",
            label: "Nombre"
        },

        {
            key: "activo",
            label: "Estado",
            render: (row) => (

                <span className={`px-2 py-1 rounded text-xs font-medium ${row.activo
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}>

                    {row.activo ? "Activo" : "Inactivo"}

                </span>

            )
        },

        {
            key: "acciones",
            label: "Acciones",
            render: (row) => (

                <div className="flex justify-center gap-4">

                    <button
                        onClick={() => setDepartamentoEditar(row)}
                        className="text-blue-600 hover:text-blue-800 transition"
                    >
                        <FaEdit />
                    </button>

                    <button
                        onClick={() => setDepartamentoEliminar(row)}
                        className="text-red-600 hover:text-red-800 transition"
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
                    Departamentos
                </h1>
                <div className="flex gap-3">
                    
                    <button
                        onClick={cargarInactivos}
                        className="bg-gray-600 text-white px-4 py-2 rounded"
                    >
                        Ver inactivos
                    </button>

                    <button
                        onClick={() => setModalNuevoDepartamento(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        + Nuevo
                    </button>

                </div>

            </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <Table
                    columns={columns}
                    data={departamentos}
                />
              </div>
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

            {modalNuevoDepartamento && (

                <ModalNuevoDepartamento
                    cerrar={() => setModalNuevoDepartamento(false)}
                    guardar={guardarNuevoDepartamento}
                />

            )}
            {modalInactivos && (

                <ModalDepartamentosInactivos
                    departamentos={departamentosInactivos}
                    cerrar={() => setModalInactivos(false)}
                    reactivar={reactivarDepartamento}
                />

            )}

        </div>

    )

}