import Modal from "../Modal"

export default function ModalProveedoresInactivos({
  proveedores,
  cerrar,
  reactivar
}) {

  return (

    <Modal>

      {/* Título */}
      <h2 className="text-xl font-semibold text-center mb-6">
        Proveedores Inactivos
      </h2>

      {/* Lista */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto">

        {proveedores.length === 0 && (

          <p className="text-center text-gray-400">
            No hay proveedores inactivos
          </p>

        )}

        {proveedores.map((p) => (

          <div
            key={p.id_proveedor}
            className="flex justify-between items-center border p-3 rounded"
          >

            <div className="flex flex-col">

              <span className="font-medium">
                {p.nombre}
              </span>

              <span className="text-sm text-gray-500">
                {p.numero_contacto || "-"}
              </span>

            </div>

            <button
              onClick={() => reactivar(p.id_proveedor)}
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