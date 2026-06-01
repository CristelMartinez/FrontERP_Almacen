import { useState } from "react"
import Modal from "../Modal"

export default function ModalNuevoTipoMovimiento({ cerrar, guardar }) {

  const [formData, setFormData] = useState({
    nombre: "",
    tipo_operacion: "entrada"
  })

const handleChange = (e) => {

  const { name, value } = e.target

  setFormData({
    ...formData,
    [name]: name === "tipo_operacion"
      ? value.toUpperCase()
      : value
  })

}

  const handleGuardar = () => {

    if (!formData.nombre.trim()) {
      return
    }

    guardar(formData)

  }

  return (

    <Modal>

      {/* Título */}
      <h2 className="text-xl font-semibold text-center mb-6">
        Nuevo Tipo de Movimiento
      </h2>

      {/* Formulario */}
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
            placeholder="Nombre del tipo de movimiento"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        <div>

          <label className="block text-sm text-gray-600 mb-1">
            Tipo de operación
          </label>

          <select
            name="tipo_operacion"
            value={formData.tipo_operacion}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >

            <option value="entrada">
              Entrada
            </option>

            <option value="salida">
              Salida
            </option>

          </select>

        </div>

      </div>

      {/* Botones */}
      <div className="flex justify-center gap-6 mt-8">

        <button
          onClick={cerrar}
          className="px-6 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300"
        >
          Cancelar
        </button>

        <button
          onClick={handleGuardar}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Guardar
        </button>

      </div>

    </Modal>

  )

}