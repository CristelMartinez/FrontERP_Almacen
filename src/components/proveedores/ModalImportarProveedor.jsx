import { useState } from "react"
import Modal from "../Modal"
import toast from "react-hot-toast"
import api from "../../api/api"

export default function ModalImportarProveedores({ cerrar }) {

  const [archivo, setArchivo] = useState(null)

  const handleSubmit = async () => {

    if (!archivo) {
      toast.error("Selecciona un archivo")
      return
    }

    try {

      const formData = new FormData()
      formData.append("archivo", archivo)

      const res = await api.post(
        "/importaciones/proveedores",
        formData
      )

      const insertados = res.data.insertados || 0

      const texto =
        insertados === 1
          ? "1 proveedor importado correctamente"
          : `${insertados} proveedores importados correctamente`

      toast.success(`✅ ${texto}`)

      cerrar()

    } catch (error) {

      const mensaje =
        error.response?.data?.message ||
        "Error al importar proveedores"

      toast.error(mensaje)

    }

  }

  return (
    <Modal>

      <h2 className="text-lg font-semibold mb-4">
        Importar proveedores
      </h2>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={(e) => setArchivo(e.target.files[0])}
        className="mb-4"
      />

      {archivo && (
        <p className="text-sm text-green-600 mb-4">
          Archivo: {archivo.name}
        </p>
      )}

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