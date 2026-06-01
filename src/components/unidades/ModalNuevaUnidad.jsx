import { useState } from "react"
import Modal from "../Modal"

export default function ModalNuevaUnidad({ unidad, cerrar, guardar }) {

  const [formData, setFormData] = useState({
    nombre: "",
    abreviatura: ""
  })

  const handleChange = (e) => {

    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })

  }

  const handleGuardar = () => {

    if (!formData.nombre.trim()) return

    guardar(formData)

  }

  return (

    <Modal>

      <h2 className="text-xl font-semibold text-center mb-6">
        Editar Categoría
      </h2>

      <div className="space-y-4">

        <div>

          <label className="block text-sm text-gray-600 mb-1">
            Nombre
          </label>

          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

        </div>

        <div>

          <label className="block text-sm text-gray-600 mb-1">
            Descripción
          </label>

          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

        </div>

      </div>

      <div className="flex justify-center gap-6 mt-8">

        <button
          onClick={cerrar}
          className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>

        <button
          onClick={handleGuardar}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Guardar
        </button>

      </div>

    </Modal>

  )

}