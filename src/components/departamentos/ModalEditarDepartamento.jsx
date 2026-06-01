import { useState } from "react"
import Modal from "../Modal"

export default function ModalEditarDepartamento({ departamento, cerrar, guardar }) {

  const [nombre, setNombre] = useState(departamento.nombre)

  const handleGuardar = () => {

    if (!nombre.trim()) {
      return
    }

    guardar({
      nombre
    })

  }

  return (

    <Modal>

      {/* Título */}
      <h2 className="text-xl font-semibold text-center mb-6">
        Editar Departamento
      </h2>

      {/* Formulario */}
      <div className="space-y-4">

        <div>

          <label className="block text-sm text-gray-600 mb-1">
            Nombre
          </label>

          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

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