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
      setDepartamentos(res.data.departamentos)

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
    <div className="flex items-center justify-between mb-6">

      <div>

        <h2 className="text-base font-semibold text-gray-800">
          {usuario
            ? "Editar usuario"
            : "Nuevo usuario"}
        </h2>

        <p className="text-xs text-gray-400 mt-0.5">

          {usuario
            ? "Modificar información del usuario"
            : "Registrar nuevo usuario"}

        </p>

      </div>

      <button
        onClick={cerrar}
        className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
      >
        <FiX size={16} />
      </button>

    </div>

    {/* FORM */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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

    {/* FOOTER */}
    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-5 border-t border-gray-100">

      <button
        onClick={cerrar}
        className="
          w-full sm:w-auto
          flex items-center justify-center gap-2
          px-4 py-2
          text-sm
          text-gray-600
          bg-white
          border border-gray-200
          rounded-lg
          hover:bg-gray-50
          transition
        "
      >
        <FiX size={14} />
        Cancelar
      </button>

      <button
        onClick={guardarUsuario}
        className="
          w-full sm:w-auto
          flex items-center justify-center gap-2
          px-4 py-2
          text-sm
          font-medium
          bg-blue-600
          text-white
          rounded-lg
          hover:bg-blue-700
          transition
          shadow-sm
        "
      >
        <FiSave size={14} />
        {usuario ? "Actualizar" : "Guardar"}
      </button>

    </div>

  </Modal>

)

}