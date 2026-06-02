import {
  FiRotateCcw,
  FiX
} from "react-icons/fi"

import Modal from "../Modal"

export default function ModalSubfamiliasInactivas({
  subfamilias,
  cerrar,
  reactivar
}) {

  return (

    <Modal ancho="max-w-3xl">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-base font-semibold text-gray-800">
            Subfamilias inactivas
          </h2>

          <p className="text-xs text-gray-400 mt-0.5">
            Reactivar subfamilias disponibles
          </p>

        </div>

        <button
          onClick={cerrar}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
        >
          <FiX size={16} />
        </button>

      </div>

      {/* LISTADO */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto">

        {subfamilias.length === 0 && (

          <div className="text-center text-gray-500 py-6">
            No hay subfamilias inactivas
          </div>

        )}

        {subfamilias.map((subfamilia) => (

          <div
            key={subfamilia.id_subfamilia}
            className="
              flex
              flex-col
              sm:flex-row

              gap-4
              sm:gap-0

              sm:justify-between
              sm:items-center

              border
              border-gray-200

              rounded-lg

              p-4
            "
          >

            <div>

              <div className="font-semibold break-words">

                {subfamilia.familia_codigo}
                {" - "}
                {subfamilia.familia_nombre}

              </div>

              <div className="text-sm text-gray-500 mt-1 break-words">

                {subfamilia.codigo}
                {" - "}
                {subfamilia.nombre}

              </div>

            </div>

            <button
              onClick={() =>
                reactivar(
                  subfamilia.id_subfamilia
                )
              }
              className="
                w-full sm:w-auto

                flex
                items-center
                justify-center
                gap-2

                bg-green-600
                text-white

                px-4
                py-2

                rounded-lg

                hover:bg-green-700
                transition
              "
            >
              <FiRotateCcw size={14} />
              Reactivar
            </button>

          </div>

        ))}

      </div>

      {/* FOOTER */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-5 border-t border-gray-100">

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
          Cerrar
        </button>

      </div>

    </Modal>

  )

}