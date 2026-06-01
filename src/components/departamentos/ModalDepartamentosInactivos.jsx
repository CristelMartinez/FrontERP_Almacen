import Modal from "../Modal"

export default function ModalDepartamentosInactivos({
  departamentos,
  cerrar,
  reactivar
}) {

  return (

    <Modal>

      <h2 className="text-xl font-semibold text-center mb-6">
        Departamentos Inactivos
      </h2>

      <div className="space-y-3 max-h-[300px] overflow-y-auto">

        {departamentos.length === 0 && (
          <p className="text-center text-gray-400">
            No hay departamentos inactivos
          </p>
        )}

        {departamentos.map((d) => (

          <div
            key={d.id_departamento}
            className="flex justify-between items-center border p-3 rounded"
          >

            <span>{d.nombre}</span>

            <button
              onClick={() => reactivar(d.id_departamento)}
              className="text-green-600 hover:text-green-800"
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