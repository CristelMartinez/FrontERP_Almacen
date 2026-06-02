import { useState } from "react"
import Modal from "../Modal"
import toast from "react-hot-toast"
import api from "../../api/api"

export default function ModalImportarProveedores({
  cerrar
}) {

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

    <Modal ancho="max-w-md">

      {/* HEADER */}
      <div className="mb-6">

        <h2 className="text-base font-semibold text-gray-800">
          Importar proveedores
        </h2>

        <p className="text-xs text-gray-400 mt-1">
          Selecciona un archivo Excel para importar proveedores
        </p>

      </div>

      {/* ARCHIVO */}
      <div className="space-y-4">

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setArchivo(e.target.files[0])}
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

          <div
            className="
              rounded-lg
              border
              border-green-100
              bg-green-50

              px-3
              py-2
            "
          >

            <p
              className="
                text-sm
                text-green-700
                break-all
              "
            >
              {archivo.name}
            </p>

          </div>

        )}

      </div>

      {/* FOOTER */}
      <div
        className="
          flex
          flex-col-reverse
          sm:flex-row

          justify-end

          gap-3
          mt-6
          pt-5

          border-t
          border-gray-100
        "
      >

        <button
          onClick={cerrar}
          className="
            w-full sm:w-auto

            px-4
            py-2

            text-sm

            text-gray-600
            bg-white

            border
            border-gray-200

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

            px-4
            py-2

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