import { useState } from "react"
import Modal from "../Modal"
import toast from "react-hot-toast"
import api from "../../api/api"

export default function ModalImportarProductos({ cerrar }) {

  const [archivo, setArchivo] = useState(null)

  const handleSeleccion = (e) => {
    const file = e.target.files[0]

    if (!file) return

    setArchivo(file)
  }

const handleSubmit = async () => {

  if (!archivo) {
    toast.error("Selecciona un archivo")
    return
  }

  try {

    const formData = new FormData()
    formData.append("archivo", archivo)

    const res = await api.post(
      "/importaciones/productos",
      formData
    )

    // 🔥 OBTENER DATOS DEL BACKEND
    const insertados = res.data.insertados || 0

    // 🔥 MENSAJE DINÁMICO
    const texto =
      insertados === 1
        ? "1 producto importado correctamente"
        : `${insertados} productos importados correctamente`

    toast.success(`${texto}`)

    cerrar()

  } catch (error) {

    const mensaje =
      error.response?.data?.message ||
      "Error al importar archivo"

    toast.error(mensaje)
  }

}

  return (
    <Modal>

      <h2 className="text-lg font-semibold mb-4">
        Importar productos
      </h2>

      {/* Input archivo */}
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleSeleccion}
        className="mb-4"
      />

      {/* Nombre archivo */}
      {archivo && (
        <p className="text-sm text-green-600 mb-4">
          Archivo: {archivo.name}
        </p>
      )}

      {/* Botones */}
      <div className="flex justify-between">

        <button
          onClick={cerrar}
          className="bg-gray-300 px-4 py-2 rounded-lg"
        >
          Cancelar
        </button>

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Importar
        </button>

      </div>

    </Modal>
  )
}