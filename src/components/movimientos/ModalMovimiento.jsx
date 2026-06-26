import { useState } from "react"
import api from "../../api/api"
import Modal from "../Modal"
import toast from "react-hot-toast"
import { FiPlus, FiTrash } from "react-icons/fi"

export default function ModalMovimiento({
    cerrar,
    tiposMovimiento,
    almacenes,
    proveedores,
    productos,
    recargar
}) {

    const usuario = JSON.parse(localStorage.getItem("usuario"))

    const [form, setForm] = useState({
        id_tipo_movimiento: "",
        id_proveedor: "",
        id_almacen: "",
        responsable_solicita: "",
        //id_departamento: "",
        observaciones: ""

    })

    const [detalle, setDetalle] = useState({
        id_producto: "",
        cantidad: "",
        costo_unitario: ""
    })
    const [codigoEscaneado, setCodigoEscaneado] = useState("")


    const esEntrada = form.id_tipo_movimiento === "1"
    const esSalida = form.id_tipo_movimiento === "2"


    const [detalles, setDetalles] = useState([])

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        })

    }

    const handleDetalle = (e) => {

        setDetalle({
            ...detalle,
            [e.target.name]: e.target.value
        })

    }
    const handleScan = (e) => {

        const codigo = e.target.value.trim()

        setCodigoEscaneado(codigo)

    }

    const handleScanEnter = (e) => {

        if (e.key !== "Enter") return

        const producto = productos.find(
            p => String(p.codigo_barras).trim() === codigoEscaneado.trim()
        )

        if (!producto) {
            toast.error("Producto no encontrado")
            return
        }

        setDetalle({
            ...detalle,
            id_producto: producto.id_producto
        })

    }

    const agregarProducto = () => {

        if (!detalle.id_producto || !detalle.cantidad) {
            toast.error("Debe seleccionar producto y cantidad")
            return
        }

        const producto = productos.find(
            p => p.id_producto == detalle.id_producto
        )

        if (!producto) {
            toast.error("Producto no encontrado")
            return
        }

        setDetalles([
            ...detalles,
            {
                id_producto: detalle.id_producto,
                nombre: producto.nombre,
                cantidad: Number(detalle.cantidad),
                costo_unitario: Number(detalle.costo_unitario || 0),
                id_almacen: form.id_almacen
            }
        ])

        setDetalle({
            id_producto: "",
            cantidad: "",
            costo_unitario: ""
        })
        setCodigoEscaneado("")

    }

    const eliminarDetalle = (index) => {

        const nuevos = detalles.filter((_, i) => i !== index)

        setDetalles(nuevos)

    }

    const guardarMovimiento = async () => {

        if (!form.id_tipo_movimiento) {
            toast.error("Seleccione tipo de movimiento")
            return
        }

        if (!form.id_almacen) {
            toast.error("Seleccione almacén")
            return
        }

        if (detalles.length === 0) {
            toast.error("Debe agregar al menos un producto")
            return
        }

        try {

            const payload = {
                ...form,
                detalles
            }

            await api.post("/movimientos", payload)

            toast.success("Movimiento registrado")

            recargar()
            cerrar()

        } catch (error) {


            const mensaje =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Error registrando movimiento"

            toast.error(mensaje)

        }

    }

    return (

        <Modal ancho="max-w-4xl">
            <div className="max-h-[85vh] overflow-y-auto pr-2">
                {/* HEADER */}

                <div className="bg-blue-600 text-white rounded-lg px-6 py-3 mb-6 flex justify-between">

                    <h2 className="text-lg font-semibold">
                        Registrar Movimiento
                    </h2>

                    <span className="text-sm opacity-90">
                        Registrar entrada o salida del inventario
                    </span>

                </div>

                {/* FORM */}

                <div className="grid grid-cols-2 gap-6">

                    <div>

                        <label className="text-sm">Tipo movimiento</label>

                        <select
                            name="id_tipo_movimiento"
                            value={form.id_tipo_movimiento}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        >

                            <option value="">Seleccionar</option>

                            {tiposMovimiento && tiposMovimiento.map((t) => (

                                <option
                                    key={t.id_tipo_movimiento}
                                    value={t.id_tipo_movimiento}
                                >
                                    {t.nombre}
                                </option>

                            ))}

                        </select>

                    </div>

                    <input
                        type="text"
                        placeholder="SKU"
                        value={form.sku}
                        onChange={(e) =>
                            setForm({ ...form, sku: e.target.value })
                        }
                    />

                    <div>

                        <label className="text-sm">Almacén</label>

                        <select
                            name="id_almacen"
                            value={form.id_almacen}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        >

                            <option value="">Seleccionar</option>

                            {almacenes && almacenes.map((a) => (

                                <option
                                    key={a.id_almacen}
                                    value={a.id_almacen}
                                >
                                    {a.nombre}
                                </option>

                            ))}

                        </select>

                    </div>

                    <div>

                        <label className="text-sm">Proveedor</label>

                        <select
                            name="id_proveedor"
                            value={form.id_proveedor}
                            onChange={handleChange}
                            disabled={!esEntrada}
                            className="w-full border rounded-lg px-3 py-2"
                        >

                            <option value="">Seleccionar</option>

                            {proveedores && proveedores.map((p) => (

                                <option
                                    key={p.id_proveedor}
                                    value={p.id_proveedor}
                                >
                                    {p.nombre}
                                </option>

                            ))}

                        </select>

                    </div>

                    <div>

                        <label className="text-sm">Usuario</label>

                        <input
                            disabled
                            value={usuario?.nombre || ""}
                            className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                        />

                    </div>
                    {esSalida && (

                        <div>

                            <label className="text-sm">Responsable solicita</label>

                            <input
                                name="responsable_solicita"
                                value={form.responsable_solicita}
                                onChange={handleChange}
                                placeholder="Quién solicita el material"
                                className="w-full border rounded-lg px-3 py-2"
                            />

                        </div>

                    )}
                    <div>
                        <label className="text-sm">Número de pedido</label>
                        <input
                            name="numero_pedido"
                            value={form.numero_pedido}
                            onChange={handleChange}
                            placeholder="Pedido"
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm">Factura</label>

                        <input
                            name="factura"
                            value={form.factura}
                            onChange={handleChange}
                            placeholder="Factura"
                            disabled={!esEntrada}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                </div>
                <div className="flex flex-col items-center mt-6">

                    <label className="text-sm mb-2">Código de barras</label>

                    <input
                        placeholder="Escanear"
                        value={codigoEscaneado}
                        onChange={handleScan}
                        onKeyDown={handleScanEnter}
                        className="border rounded-lg px-4 py-2 w-64 text-center"
                    />

                </div>

                {/* AGREGAR PRODUCTO */}

                <div className="grid grid-cols-4 gap-4 mt-6">

                    <select
                        name="id_producto"
                        value={detalle.id_producto}
                        onChange={handleDetalle}
                        className="border rounded-lg px-3 py-2 w-full"
                    >

                        <option value="">Producto</option>

                        {productos && productos.map((p) => (

                            <option
                                key={p.id_producto}
                                value={p.id_producto}
                            >
                                {p.nombre}
                            </option>

                        ))}

                    </select>

                    <input
                        name="cantidad"
                        type="number"
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="Cantidad"
                        value={detalle.cantidad}
                        onChange={handleDetalle}
                        className="border rounded-lg px-3 py-2"
                    />

                    <input
                        name="costo_unitario"
                        type="number"
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="Costo"
                        value={detalle.costo_unitario}
                        onChange={handleDetalle}
                        className="border rounded-lg px-3 py-2"
                    />

                    <button
                        onClick={agregarProducto}
                        disabled={!detalle.id_producto || !detalle.cantidad || !form.id_almacen}
                        className={`rounded-lg flex items-center justify-center text-xl 
            ${!detalle.id_producto || !detalle.cantidad || !form.id_almacen
                                ? "bg-gray-200 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                    >
                        <FiPlus />
                    </button>

                </div>

                {/* TABLA PRODUCTOS */}

                {detalles.length > 0 && (

                    <table className="w-full mt-6 text-sm">

                        <thead>

                            <tr className="border-b text-gray-600">

                                <th className="text-left py-2">Producto</th>
                                <th className="text-center">Cantidad</th>
                                <th className="text-center">Costo</th>
                                <th className="text-center w-12"></th>

                            </tr>

                        </thead>

                        <tbody>

                            {detalles.map((item, index) => (

                                <tr key={`${item.id_producto}-${index}`} className="border-b hover:bg-gray-50">

                                    <td className="py-2">{item.nombre}</td>

                                    <td className="text-center">
                                        {item.cantidad}
                                    </td>

                                    <td className="text-center">
                                        ${Number(item.costo_unitario).toFixed(2)}
                                    </td>

                                    <td className="text-center">

                                        <button
                                            onClick={() => eliminarDetalle(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FiTrash size={18} />
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

                {/* OBSERVACIONES */}

                <div className="mt-6">

                    <label className="text-sm">Observaciones</label>

                    <input
                        name="observaciones"
                        value={form.observaciones}
                        onChange={handleChange}
                        placeholder="Breve observación"
                        className="w-full border rounded-lg px-3 py-2"
                    />

                </div>

                {/* BOTONES */}

                <div className="flex justify-between mt-8">

                    <button
                        onClick={cerrar}
                        className="bg-gray-200 px-6 py-2 rounded-lg"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={guardarMovimiento}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                    >
                        Registrar
                    </button>

                </div>
            </div>
        </Modal>

    )

}