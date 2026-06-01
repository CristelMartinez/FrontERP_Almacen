import { FiAlertTriangle } from "react-icons/fi"
import Modal from "../Modal"

export default function ModalEliminarDepartamento({
  departamento,
  cerrar,
  confirmar
}) {

  return (

    <Modal>

      {/* Título */}
      <div className="flex items-center justify-center gap-2 text-red-500 text-xl font-semibold mb-6">

        <FiAlertTriangle />

        Desactivar Departamento

      </div>

      {/* Mensaje */}
      <div className="text-center text-gray-700 space-y-2 mb-8">

        <p>
          Este departamento será desactivado.
        </p>

        <p className="font-medium">
          Departamento: {departamento.nombre}
        </p>

        <p className="text-gray-500 text-sm">
          Podrá volver a activarse en el futuro si es necesario.
        </p>

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
          onClick={confirmar}
          className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
        >
          Desactivar
        </button>

      </div>

    </Modal>

  )

}