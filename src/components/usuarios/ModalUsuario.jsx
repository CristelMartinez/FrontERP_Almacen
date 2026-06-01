import { useState, useEffect } from "react"
import api from "../../api/api"
import toast from "react-hot-toast"
import { FiX, FiSave, FiKey } from "react-icons/fi"
import Modal from "../Modal"
import InputField from "../InputField"
import SelectField from "../SelectField"

export default function ModalUsuario({ cerrar, recargar, usuario }) {

  const [roles, setRoles] = useState([])
  const [departamentos, setDepartamentos] = useState([])

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    id_rol: "",
    id_departamento: ""
  })


  useEffect(() => {
    cargarCatalogos()
  }, [])


  useEffect(() => {

    if (usuario) {

      setForm({
        nombre: usuario.nombre || "",
        correo: usuario.correo || "",
        password: "",
        id_rol: usuario.id_rol || "",
        id_departamento: usuario.id_departamento || ""
      })

    }

  }, [usuario])


  const cargarCatalogos = async () => {

    try {

      const res = await api.get("/catalogos")

      setRoles(res.data.roles)
      setDepartamentos(res.data.categorias)

    } catch (error) {

      console.error("Error cargando catálogos", error)

    }

  }


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }


  const guardarUsuario = async () => {

    if (!form.nombre.trim()) {
      toast.error("El nombre es obligatorio")
      return
    }

    if (!form.correo.trim()) {
      toast.error("El correo es obligatorio")
      return
    }

    if (!usuario && !form.password.trim()) {
      toast.error("La contraseña es obligatoria")
      return
    }

    if (!form.id_rol) {
      toast.error("Debe seleccionar un rol")
      return
    }

    if (!form.id_departamento) {
      toast.error("Debe seleccionar un departamento")
      return
    }

    try {

      if (usuario) {

        const payload = {
          nombre: form.nombre,
          correo: form.correo,
          id_rol: form.id_rol,
          id_departamento: form.id_departamento
        }

        await api.put(`/usuarios/${usuario.id_usuario}`, payload)

        toast.success("Usuario actualizado correctamente")

      } else {

        const payload = {
          nombre: form.nombre,
          correo: form.correo,
          password_hash: form.password,
          id_rol: form.id_rol,
          id_departamento: form.id_departamento
        }

        await api.post("/usuarios", payload)

        toast.success("Usuario creado correctamente")

      }

      recargar()
      cerrar()

    } catch (error) {

      toast.error("Error guardando usuario")
      console.error(error)

    }

  }


  return (

    <Modal ancho="max-w-2xl">

      {/* HEADER */}
      <div className="bg-blue-500 text-white text-lg font-semibold p-4 rounded mb-6 flex justify-between">

        <span>
          {usuario ? "Editar Usuario" : "Nuevo Usuario"}
        </span>

        <span className="text-sm opacity-90">

          {usuario
            ? "Modificar información del usuario"
            : "Registrar nuevo usuario"}

        </span>

      </div>


      {/* FORM */}
      <div className="grid grid-cols-2 gap-6">

        <InputField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre del usuario"
        />

        <InputField
          label="Correo"
          name="correo"
          value={form.correo}
          onChange={handleChange}
          placeholder="Correo del usuario"
        />

        {!usuario && (

          <InputField
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Contraseña"
          />

        )}

        <SelectField
          label="Rol"
          name="id_rol"
          value={form.id_rol}
          onChange={handleChange}
          options={roles.map(r => ({
            id: r.id_rol,
            nombre: r.nombre
          }))}
        />

        <SelectField
          label="Departamento"
          name="id_departamento"
          value={form.id_departamento}
          onChange={handleChange}
          options={departamentos.map(d => ({
            id: d.id_departamento,
            nombre: d.nombre
          }))}
        />

      </div>


      {/* BOTONES */}
      <div className="flex justify-between mt-8">

        <button
          onClick={cerrar}
          className="flex items-center gap-2 bg-gray-200 px-6 py-2 rounded-lg shadow hover:bg-gray-300"
        >
          <FiX />
          Cancelar
        </button>

        <button
          onClick={guardarUsuario}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          <FiSave />
          {usuario ? "Actualizar" : "Guardar"}
        </button>

      </div>

    </Modal>

  )

}