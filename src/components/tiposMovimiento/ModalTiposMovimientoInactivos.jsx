import Modal from "../Modal"

export default function ModalTiposMovimientoInactivos({
  tipos,
  cerrar,
  reactivar
}) {

  return (

    <Modal>

      {/* Título */}
      <h2 className="text-xl font-semibold text-center mb-6">
        Tipos de Movimiento Inactivos
      </h2>

      {/* Lista */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto">

        {tipos.length === 0 && (

          <p className="text-center text-gray-400">
            No hay tipos de movimiento inactivos
          </p>

        )}

        {tipos.map((tipo) => (

          <div
            key={tipo.id_tipo_movimiento}
            className="flex justify-between items-center border p-3 rounded"
          >

            <div className="flex flex-col">

              <span className="font-medium">
                {tipo.nombre}
              </span>

              <span className="text-sm text-gray-500">
                {tipo.tipo_operacion}
              </span>

            </div>

            <button
              onClick={() => reactivar(tipo.id_tipo_movimiento)}
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Reactivar
            </button>

          </div>

        ))}

      </div>

      {/* Botón cerrar */}
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