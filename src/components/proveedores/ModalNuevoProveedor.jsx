import { useState } from "react"
import Modal from "../Modal"

export default function ModalNuevoProveedor({
  cerrar,
  guardar
}) {

  const [formData, setFormData] = useState({
    nombre: "",
    numero_contacto: "",
    direccion: ""
  })

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const handleGuardar = () => {
    guardar(formData)
  }

  return (

    <Modal>

      {/* Titulo */}
      <div className="text-center text-xl font-semibold mb-6">

        Nuevo Proveedor

      </div>

      {/* Formulario */}
      <div className="space-y-4 mb-8">

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
            Teléfono
          </label>

          <input
            type="text"
            name="numero_contacto"
            value={formData.numero_contacto}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>


        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Dirección
          </label>

          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

      </div>


      {/* Botones */}
      <div className="flex justify-center gap-6">

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