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
  <Modal ancho="max-w-md">

    {/* HEADER */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-base font-semibold text-gray-800">
          Importar productos
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Selecciona un archivo Excel para importar productos
        </p>
      </div>
    </div>

    {/* INPUT */}
    <div className="space-y-4">

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleSeleccion}
        className="
          w-full
          text-sm
          file:mr-4
          file:px-4
          file:py-2
          file:rounded-lg
          file:border-0
          file:bg-blue-50
          file:text-blue-700
          file:font-medium
          hover:file:bg-blue-100
        "
      />

      {archivo && (
        <div className="rounded-lg border border-green-100 bg-green-50 px-3 py-2">
          <p className="text-sm text-green-700 break-all">
            {archivo.name}
          </p>
        </div>
      )}

    </div>

    {/* FOOTER */}
    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-5 border-t border-gray-100">

      <button
        onClick={cerrar}
        className="
          w-full sm:w-auto
          px-4 py-2
          text-sm
          text-gray-600
          bg-white
          border border-gray-200
          rounded-lg
          hover:bg-gray-50
          transition
        "
      >
        Cancelar
      </button>

      <button
        onClick={handleSubmit}
        className="
          w-full sm:w-auto
          px-4 py-2
          text-sm
          font-medium
          bg-green-600
          text-white
          rounded-lg
          hover:bg-green-700
          transition
        "
      >
        Importar
      </button>

    </div>

  </Modal>
)
}