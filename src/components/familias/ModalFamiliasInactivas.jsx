import {
  FiRotateCcw,
  FiX
} from "react-icons/fi"

import Modal from "../Modal"

export default function ModalFamiliasInactivas({
  familias,
  cerrar,
  reactivar
}) {

  return (

    <Modal ancho="max-w-2xl">

      {/* HEADER */}
      <div className="
        bg-gray-700
        text-white

        text-lg
        font-semibold

        p-4
        rounded
        mb-6

        flex
        justify-between
      ">

        <span>
          Familias Inactivas
        </span>

        <span className="
          text-sm
          opacity-90
        ">
          Reactivar familias
        </span>

      </div>

      {/* TABLA */}
      <div className="space-y-4">

        {familias.length === 0 && (

          <div className="
            text-center
            text-gray-500
            py-6
          ">
            No hay familias inactivas
          </div>

        )}

        {familias.map((familia) => (

          <div
            key={familia.id_familia}
            className="
              flex
              justify-between
              items-center

              border
              rounded-lg

              p-4
            "
          >

            <div>

              <div className="
                font-semibold
              ">
                {familia.nombre}
              </div>

              <div className="
                text-sm
                text-gray-500
              ">
                Código: {familia.codigo}
              </div>

            </div>

            <button
              onClick={() =>
                reactivar(
                  familia.id_familia
                )
              }
              className="
                flex
                items-center
                gap-2

                bg-green-600
                text-white

                px-4
                py-2

                rounded-lg

                hover:bg-green-700
              "
            >
              <FiRotateCcw />
              Reactivar
            </button>

          </div>

        ))}

      </div>

      {/* FOOTER */}
      <div className="
        flex
        justify-end
        mt-8
      ">

        <button
          onClick={cerrar}
          className="
            flex
            items-center
            gap-2

            bg-gray-200

            px-6
            py-2

            rounded-lg

            hover:bg-gray-300
          "
        >
          <FiX />
          Cerrar
        </button>

      </div>

    </Modal>

  )

}