import { useEffect, useState } from "react"
import api from "../api/api"
import { FiSearch, FiEdit2, FiTrash2, FiKey, FiRefreshCw } from "react-icons/fi"
import ModalUsuario from "../components/usuarios/ModalUsuario"
import ModalCambiarPassword from "../components/usuarios/ModalCambiarPassword"
import ModalEliminarUsuario from "../components/usuarios/ModalEliminarUsuario"
import toast from "react-hot-toast"
import Table from "../components/Table"

const Usuarios = () => {

  const [usuarios, setUsuarios] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [mostrarModal, setMostrarModal] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [mostrarModalPassword, setMostrarModalPassword] = useState(false)
  const [usuarioPassword, setUsuarioPassword] = useState(null)
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false)
  const [usuarioEliminar, setUsuarioEliminar] = useState(null)

  const token = JSON.parse(atob(localStorage.getItem("token").split(".")[1]))
  const esAdmin = token.id_rol === 1

  const cargarUsuarios = async () => {
    try {
      const res = await api.get("/usuarios")
      setUsuarios(res.data)
    } catch (error) {
      console.error("Error cargando usuarios", error)
    }
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const eliminarUsuario = async () => {

    try {

      await api.delete(`/usuarios/${usuarioEliminar.id_usuario}`)

      toast.success("Usuario desactivado correctamente")

      setMostrarModalEliminar(false)

      cargarUsuarios()

    } catch (error) {

      toast.error("Error desactivando usuario")

    }

  }

  const toggleUsuario = async (usuario) => {

    try {

      if (usuario.activo) {

        await api.delete(`/usuarios/${usuario.id_usuario}`)
        toast.success("Usuario desactivado")

      } else {

        await api.put(`/usuarios/${usuario.id_usuario}/activar`)
        toast.success("Usuario reactivado")

      }

      cargarUsuarios()

    } catch (error) {

      console.error(error.response?.data || error)
      toast.error("Error actualizando usuario")

    }

  }

  // 🔥 COLUMNAS
  const columns = [

    {
      key: "id_usuario",
      label: "ID",
      render: (row) => (
        <span className="block text-center">
          {row.id_usuario}
        </span>
      )
    },

    {
      key: "nombre",
      label: "Nombre"
    },

    {
      key: "correo",
      label: "Email"
    },

    {
      key: "rol",
      label: "Rol"
    },

    {
      key: "estado",
      label: "Estado",
      render: (row) => (

        row.activo ? (
          <span className="text-green-600 font-medium">
            ● Activo
          </span>
        ) : (
          <span className="text-red-600 font-medium">
            ● Inactivo
          </span>
        )

      )
    },

    {
      key: "acciones",
      label: "Acciones",
      render: (row) => (

        <div className="flex justify-center items-center gap-3">

          <FiEdit2
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
            onClick={() => {
              setUsuarioSeleccionado(row)
              setMostrarModal(true)
            }}
          />

          {esAdmin && (
            <FiKey
              className="text-yellow-600 hover:text-yellow-800 cursor-pointer"
              onClick={() => {
                setUsuarioPassword(row)
                setMostrarModalPassword(true)
              }}
            />
          )}

          {row.activo ? (

            <FiTrash2
              className="text-red-600 hover:text-red-800 cursor-pointer"
              onClick={() => toggleUsuario(row)}
            />

          ) : (

            <FiRefreshCw
              className="text-green-600 hover:text-green-800 cursor-pointer"
              onClick={() => toggleUsuario(row)}
            />

          )}

        </div>

      )
    }

  ]

  return (

    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <button
          onClick={() => {
            setUsuarioSeleccionado(null)
            setMostrarModal(true)
          }}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Nuevo Usuario
        </button>

        <div className="flex items-center border rounded-lg px-3 py-2 shadow">
          <FiSearch className="mr-2 text-gray-500" />

          <input
            type="text"
            placeholder="Buscar Usuario"
            className="outline-none"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

      </div>

        <div className="bg-white rounded-xl shadow-lg p-8">    
            {/* TABLA */}
            <Table
                columns={columns}
                data={usuariosFiltrados}
            />
        </div>    

      {/* MODALES */}
      {mostrarModal && (

        <ModalUsuario
          cerrar={() => setMostrarModal(false)}
          recargar={cargarUsuarios}
          usuario={usuarioSeleccionado}
        />

      )}

      {mostrarModalPassword && (
        <ModalCambiarPassword
          cerrar={() => setMostrarModalPassword(false)}
          usuario={usuarioPassword}
        />
      )}

      {mostrarModalEliminar && (

        <ModalEliminarUsuario
          usuario={usuarioEliminar}
          cerrar={() => setMostrarModalEliminar(false)}
          confirmar={eliminarUsuario}
        />

      )}

    </div>

  )

}

export default Usuarios