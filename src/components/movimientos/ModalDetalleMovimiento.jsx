import { FiX, FiArrowDownCircle, FiArrowUpCircle, FiPackage } from "react-icons/fi"

function TipoBadge({ tipo }) {
  const upper = tipo?.toUpperCase()
  if (upper === "ENTRADA")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
        <FiArrowDownCircle size={11} />
        Entrada
      </span>
    )
  if (upper === "SALIDA")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-500">
        <FiArrowUpCircle size={11} />
        Salida
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
      {tipo}
    </span>
  )
}

function InfoItem({ label, value, children }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</p>
      {children ?? <p className="text-sm font-medium text-gray-800">{value || "—"}</p>}
    </div>
  )
}

export default function ModalDetalleMovimiento({ data, cerrar }) {
  if (!data) return null

  const totalGeneral = data.detalles?.reduce(
    (acc, item) => acc + item.cantidad * (item.costo || 0),
    0
  )

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-xl rounded-t-2xl shadow-xl flex flex-col max-h-[92dvh] sm:max-h-[85vh]">

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Detalle del movimiento</h2>
            <p className="text-xs text-gray-400 mt-0.5">Información completa del registro</p>
          </div>
          <button
            onClick={cerrar}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* BODY — scrollable */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

          {/* INFO GENERAL */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 rounded-lg p-4">
            <InfoItem label="Folio">
              <span className="font-mono text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded inline-block mt-0.5">
                {data.folio}
              </span>
            </InfoItem>
            <InfoItem label="Tipo">
              <div className="mt-0.5"><TipoBadge tipo={data.tipo_movimiento} /></div>
            </InfoItem>
            <InfoItem label="Usuario" value={data.usuario} />
            <InfoItem label="Fecha">
              <p className="text-sm font-medium text-gray-800">
                {new Date(data.fecha).toLocaleDateString("es-MX", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(data.fecha).toLocaleTimeString("es-MX", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </InfoItem>
            {data.numero_pedido && (
              <InfoItem label="Número de pedido" value={data.numero_pedido} />
            )}
            {data.proveedor && (
              <InfoItem label="Proveedor" value={data.proveedor} />
            )}
            {data.almacen && (
              <InfoItem label="Almacén" value={data.almacen} />
            )}
            {data.departamento && (
              <InfoItem label="Departamento" value={data.departamento} />
            )}
          </div>

          {/* TABLA PRODUCTOS */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Productos
            </p>

            {data.detalles?.length > 0 ? (
              <div className="border border-gray-100 rounded-xl overflow-x-auto">
                <table className="w-full text-sm min-w-[420px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Producto</th>
                      <th className="text-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Cant.</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Costo u.</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.detalles.map((item, i) => {
                      const total = item.cantidad * (item.costo || 0)
                      return (
                        <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                          <td className="px-4 py-2.5 text-gray-800 font-medium">{item.producto}</td>
                          <td className="px-4 py-2.5 text-center text-gray-600">{item.cantidad}</td>
                          <td className="px-4 py-2.5 text-right text-gray-500 font-mono text-xs">
                            {item.costo != null ? `$${Number(item.costo).toFixed(2)}` : "—"}
                          </td>
                          <td className="px-4 py-2.5 text-right text-gray-800 font-medium font-mono text-xs">
                            {item.costo != null ? `$${total.toFixed(2)}` : "—"}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  {totalGeneral > 0 && (
                    <tfoot>
                      <tr className="bg-gray-50 border-t border-gray-100">
                        <td colSpan={3} className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400 text-right">
                          Total general
                        </td>
                        <td className="px-4 py-2.5 text-right text-gray-800 font-semibold font-mono text-sm">
                          ${totalGeneral.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                <FiPackage size={28} />
                <p className="text-xs mt-2">Sin productos registrados</p>
              </div>
            )}
          </div>

          {data.observaciones && (
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Observaciones</p>
              <p className="text-sm text-gray-600">{data.observaciones}</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-5 py-4 border-t border-gray-100 shrink-0">
          <button
            onClick={cerrar}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <FiX size={14} />
            Cerrar
          </button>
        </div>

      </div>
    </div>
  )
}