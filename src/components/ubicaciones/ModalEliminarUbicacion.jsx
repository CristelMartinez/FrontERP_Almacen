import { FiAlertTriangle } from "react-icons/fi"
import Modal from "../Modal"

export default function ModalEliminarUbicacion({
  ubicacion,
  cerrar,
  confirmar
}) {

  return (

    <Modal>

      <div className="flex items-center justify-center gap-2 text-red-500 text-xl font-semibold mb-6">

        <FiAlertTriangle />

        Desactivar Ubicacion

      </div>

      <div className="text-center text-gray-700 space-y-2 mb-8">

        <p>
          Esta ubicacion será desactivada.
        </p>

        <p className="font-medium">
          Ubicacion: {ubicacion.codigo}
        </p>

      </div>

      <div className="flex justify-center gap-6">

        <button
          onClick={cerrar}
          className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>

        <button
          onClick={confirmar}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Desactivar
        </button>

      </div>

    </Modal>

  )

}