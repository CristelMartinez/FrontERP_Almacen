import Modal from "../Modal"
import Table from "../Table"
import { FiX } from "react-icons/fi"

export default function ModalDetalleApartado({ cerrar, detalle }) {

  const columns = [
    {
      key: "producto",
      label: "Producto"
    },
    {
      key: "cantidad",
      label: "Cantidad",
      render: (row) => (
        <span className="font-semibold">
          {row.cantidad}
        </span>
      )
    },
    {
      key: "almacen",
      label: "Almacén"
    }
  ]

  const total = detalle.reduce(
    (acc, item) => acc + Number(item.cantidad),
    0
  )

  return (
    <Modal ancho="max-w-3xl">

      <div className="p-4 sm:p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Detalle del Apartado
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Productos incluidos en el apartado
            </p>
          </div>

          <button
            onClick={cerrar}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <div className="min-w-[500px]">
            <Table
              columns={columns}
              data={detalle}
            />
          </div>
        </div>

        {/* TOTAL */}
        <div className="flex justify-end mt-4">
          <span className="font-semibold text-sm sm:text-base">
            Total: {total}
          </span>
        </div>

      </div>

    </Modal>
  )
}