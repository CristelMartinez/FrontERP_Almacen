import { useState } from "react"
import { FiSave, FiX } from "react-icons/fi"

import Modal from "../Modal"
import InputField from "../InputField"

export default function ModalEditarUbicaciones({
  ubicacion,
  cerrar,
  guardar
}) {

  const [formData, setFormData] = useState({
    codigo: ubicacion.codigo,
    descripcion: ubicacion.descripcion || ""
  })

  const handleChange = (e) => {

    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })

  }

  const handleGuardar = () => {

    if (!formData.codigo.trim()) return

    guardar(formData)

  }

  return (

    <Modal ancho="max-w-xl">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-base font-semibold text-gray-800">
            Editar ubicación
          </h2>

          <p className="text-xs text-gray-400 mt-0.5">
            Modificar información de la ubicación
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
      <div className="space-y-4">

        <InputField
          label="Código"
          name="codigo"
          value={formData.codigo}
          onChange={handleChange}
          placeholder="Código de ubicación"
        />

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Descripción
          </label>

          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={4}
            className="
              w-full
              mt-1.5
              px-3
              py-2.5
              text-sm
              bg-gray-50
              border
              border-gray-200
              rounded-lg
              text-gray-800
              placeholder-gray-300
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500/30
              focus:border-blue-400
              transition
              resize-none
            "
          />
        </div>

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
          onClick={handleGuardar}
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
          Guardar cambios
        </button>

      </div>

    </Modal>

  )

}