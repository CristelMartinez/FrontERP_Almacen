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
    const total = detalle.reduce((acc, item) => acc + Number(item.cantidad), 0)
    return (
        <Modal ancho="max-w-3xl">

            <div className="p-6">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">
                        Detalle del Apartado
                    </h2>

                    <button onClick={cerrar}>
                        <FiX />
                    </button>
                </div>

                {/* TABLA */}
                <div className="bg-white rounded-xl shadow p-4">
                    <Table
                        columns={columns}
                        data={detalle}
                    />
                </div>
                <div className="flex justify-end mt-4">
                    <span className="font-semibold">
                        Total: {total}
                    </span>
                </div>

            </div>

        </Modal>
    )
}