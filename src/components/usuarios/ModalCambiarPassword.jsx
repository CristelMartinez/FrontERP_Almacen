import { useState } from "react"
import api from "../../api/api"
import toast from "react-hot-toast"
import { FiX, FiSave } from "react-icons/fi"

import Modal from "../Modal"
import InputField from "../InputField"

export default function ModalCambiarPassword({
  cerrar,
  usuario
}) {

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

      await api.put(
        `/usuarios/${usuario.id_usuario}/password`,
        {
          password: form.password
        }
      )

      toast.success(
        "Contraseña actualizada correctamente"
      )

      cerrar()

    } catch (error) {

      console.error(
        "Error cambiando contraseña",
        error
      )

      toast.error(
        "Error cambiando contraseña"
      )

    }

  }

  return (

    <Modal ancho="max-w-md">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-base font-semibold text-gray-800">
            Cambiar contraseña
          </h2>

          <p className="text-xs text-gray-400 mt-0.5">
            {usuario.nombre}
          </p>

        </div>

        <button
          onClick={cerrar}
          className="
            p-1.5
            rounded-md

            text-gray-400

            hover:text-gray-600
            hover:bg-gray-100

            transition
          "
        >
          <FiX size={16} />
        </button>

      </div>

      {/* FORM */}
      <div className="space-y-4">

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

      {/* FOOTER */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-5 border-t border-gray-100">

        <button
          onClick={cerrar}
          className="
            w-full sm:w-auto

            flex
            items-center
            justify-center
            gap-2

            px-4
            py-2

            text-sm

            text-gray-600
            bg-white

            border
            border-gray-200

            rounded-lg

            hover:bg-gray-50
            transition
          "
        >
          <FiX size={14} />
          Cancelar
        </button>

        <button
          onClick={cambiarPassword}
          className="
            w-full sm:w-auto

            flex
            items-center
            justify-center
            gap-2

            px-4
            py-2

            text-sm
            font-medium

            bg-yellow-600
            text-white

            rounded-lg

            hover:bg-yellow-700
            transition

            shadow-sm
          "
        >
          <FiSave size={14} />
          Cambiar contraseña
        </button>

      </div>

    </Modal>

  )

}