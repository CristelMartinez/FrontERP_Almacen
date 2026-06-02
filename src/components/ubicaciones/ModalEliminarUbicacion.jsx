import { FiAlertTriangle } from "react-icons/fi"
import Modal from "../Modal"

export default function ModalEliminarUbicacion({
  ubicacion,
  cerrar,
  confirmar
}) {

  return (

    <Modal ancho="max-w-md">

      {/* TÍTULO */}
      <div className="flex flex-col items-center text-center mb-6">

        <FiAlertTriangle
          size={36}
          className="text-red-500 mb-3"
        />

        <h2 className="text-lg font-semibold text-gray-800">
          Desactivar ubicación
        </h2>

      </div>

      {/* MENSAJE */}
      <div className="text-center text-gray-700 space-y-2 mb-8">

        <p>
          Esta ubicación será desactivada.
        </p>

        <p className="font-medium break-words">
          Ubicación: {ubicacion.codigo}
        </p>

        {ubicacion.descripcion && (
          <p className="text-gray-500 text-sm break-words">
            {ubicacion.descripcion}
          </p>
        )}

      </div>

      {/* BOTONES */}
      <div className="flex flex-col-reverse sm:flex-row justify-center gap-3">

        <button
          onClick={cerrar}
          className="
            w-full sm:w-auto

            px-6
            py-2

            bg-gray-200

            rounded-lg
            shadow

            hover:bg-gray-300
            transition
          "
        >
          Cancelar
        </button>

        <button
          onClick={confirmar}
          className="
            w-full sm:w-auto

            px-6
            py-2

            bg-red-500
            text-white

            rounded-lg
            shadow

            hover:bg-red-600
            transition
          "
        >
          Desactivar
        </button>

      </div>

    </Modal>

  )

}