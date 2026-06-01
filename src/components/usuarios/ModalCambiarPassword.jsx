import { useState } from "react"
import api from "../../api/api"
import toast from "react-hot-toast"
import { FiX, FiSave } from "react-icons/fi"
import Modal from "../Modal"
import InputField from "../InputField"

export default function ModalCambiarPassword({ cerrar, usuario }) {

  const [form, setForm] = useState({
    password: "",
    confirmar: ""
  })

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }

  const cambiarPassword = async () => {

    if (!form.password.trim()) {
      toast.error("La contraseña es obligatoria")
      return
    }

    if (form.password.length < 4) {
      toast.error("La contraseña debe tener al menos 4 caracteres")
      return
    }

    if (form.password !== form.confirmar) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    try {

      await api.put(`/usuarios/${usuario.id_usuario}/password`, {
        password: form.password
      })

      toast.success("Contraseña actualizada correctamente")

      cerrar()

    } catch (error) {

      console.error("Error cambiando contraseña", error)

      toast.error("Error cambiando contraseña")

    }

  }

  return (

    <Modal ancho="max-w-md">

      {/* HEADER */}
      <div className="bg-yellow-500 text-white text-lg font-semibold p-4 rounded mb-6 flex justify-between">

        <span>
          Cambiar contraseña
        </span>

        <span className="text-sm opacity-90">
          {usuario.nombre}
        </span>

      </div>


      {/* FORM */}
      <div className="grid grid-cols-1 gap-6">

        <InputField
          label="Nueva contraseña"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Nueva contraseña"
        />

        <InputField
          label="Confirmar contraseña"
          name="confirmar"
          type="password"
          value={form.confirmar}
          onChange={handleChange}
          placeholder="Confirmar contraseña"
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
          onClick={cambiarPassword}
          className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-2 rounded-lg shadow hover:bg-yellow-700"
        >
          <FiSave />
          Cambiar
        </button>

      </div>

    </Modal>

  )

}