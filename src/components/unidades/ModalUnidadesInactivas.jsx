import Modal from "../Modal"

export default function ModalUnidadesInactivas({
  unidades,
  cerrar,
  reactivar
}) {

  return (

    <Modal>

      <h2 className="text-xl font-semibold text-center mb-6">
        Categorías Inactivas
      </h2>

      <div className="space-y-3 max-h-[300px] overflow-y-auto">

        {unidades.length === 0 && (

          <p className="text-center text-gray-400">
            No hay unidades inactivas
          </p>

        )}

        {unidades.map((unidad) => (

          <div
            key={unidad.id_unidad}
            className="flex justify-between items-center border p-3 rounded"
          >

            <div className="flex flex-col">

              <span className="font-medium">
                {unidad.nombre}
              </span>

              <span className="text-sm text-gray-500">
                {unidad.abreviatura || "-"}
              </span>

            </div>

            <button
              onClick={() => reactivar(unidad.id_unidad)}
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Reactivar
            </button>

          </div>

        ))}

      </div>

      <div className="flex justify-center mt-6">

        <button
          onClick={cerrar}
          className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cerrar
        </button>

      </div>

    </Modal>

  )

}