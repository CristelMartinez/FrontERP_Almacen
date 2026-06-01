export default function ModalDetalleMovimiento({ data, cerrar }) {

  if (!data) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-[700px] max-h-[80vh] overflow-y-auto p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Detalle del Movimiento
          </h2>

          <button
            onClick={cerrar}
            className="text-gray-500 hover:text-red-500 text-lg"
          >
            ✕
          </button>
        </div>

        {/* INFO GENERAL */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">

          <div>
            <p className="text-gray-500">Folio</p>
            <p className="font-semibold">{data.folio}</p>
          </div>

          <div>
            <p className="text-gray-500">Usuario</p>
            <p className="font-semibold">{data.usuario}</p>
          </div>

          <div>
            <p className="text-gray-500">Tipo</p>
            <p className="font-semibold">{data.tipo_movimiento}</p>
          </div>

          <div>
            <p className="text-gray-500">Fecha</p>
            <p className="font-semibold">
              {new Date(data.fecha).toLocaleString()}
            </p>
          </div>

        </div>

        {/* TABLA DETALLE */}
        <div className="border rounded-lg overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Producto</th>
                <th className="p-3 text-center">Cantidad</th>
                <th className="p-3 text-right">Costo</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {data.detalles?.map((item, i) => {

                const total = item.cantidad * item.costo

                return (
                  <tr key={i} className="border-t">

                    <td className="p-3">
                      {item.producto}
                    </td>

                    <td className="p-3 text-center">
                      {item.cantidad}
                    </td>

                    <td className="p-3 text-right">
                      ${item.costo}
                    </td>

                    <td className="p-3 text-right font-medium">
                      ${total}
                    </td>

                  </tr>
                )
              })}
            </tbody>

          </table>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end mt-6">

          <button
            onClick={cerrar}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Cerrar
          </button>

        </div>

      </div>

    </div>
  )
}