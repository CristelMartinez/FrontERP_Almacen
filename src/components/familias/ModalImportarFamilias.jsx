import { useState } from "react"
import Modal from "../Modal"
import toast from "react-hot-toast"
import api from "../../api/api"
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi"

export default function ModalImportarFamilias({ cerrar, cargarFamilias }) {

  const [archivo, setArchivo]   = useState(null)
  const [errores, setErrores]   = useState([])   // lista de errores del 422
  const [cargando, setCargando] = useState(false)

  const handleArchivo = (e) => {
    setArchivo(e.target.files[0])
    setErrores([]) // limpiar errores al cambiar archivo
  }

  const handleSubmit = async () => {
    if (!archivo) {
      toast.error("Selecciona un archivo")
      return
    }

    setCargando(true)
    setErrores([])

    try {
      const formData = new FormData()
      formData.append("archivo", archivo)

      const res = await api.post("/importaciones/familias", formData)

      const insertados = res.data.insertados || 0
      const texto =
        insertados === 1
          ? "1 familia importada correctamente"
          : `${insertados} familias importadas correctamente`

      toast.success(`✅ ${texto}`)
      cargarFamilias()
      cerrar()

    } catch (error) {
      const data = error.response?.data

      // ── 422: errores de validación fila por fila ──────────────
      if (error.response?.status === 422 && Array.isArray(data?.errores)) {
        setErrores(data.errores)
        return
      }

      // ── Otro error genérico ───────────────────────────────────
      toast.error(data?.message || "Error al importar familias")

    } finally {
      setCargando(false)
    }
  }

  return (
    <Modal ancho="max-w-lg">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-800">
          Importar familias
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Selecciona un archivo Excel (.xlsx) con las columnas: <strong>Código</strong> y <strong>Nombre</strong>
        </p>
      </div>

      {/* SELECTOR DE ARCHIVO */}
      <div className="space-y-3">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleArchivo}
          className="
            w-full text-sm
            file:mr-4 file:px-4 file:py-2
            file:rounded-lg file:border-0
            file:bg-blue-50 file:text-blue-700 file:font-medium
            hover:file:bg-blue-100
          "
        />

        {archivo && errores.length === 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-3 py-2">
            <FiCheckCircle className="text-green-600 shrink-0" size={15} />
            <p className="text-sm text-green-700 break-all">{archivo.name}</p>
          </div>
        )}
      </div>

      {/* TABLA DE ERRORES */}
      {errores.length > 0 && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 overflow-hidden">

          {/* encabezado */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-red-200">
            <FiAlertCircle className="text-red-500 shrink-0" size={16} />
            <p className="text-sm font-semibold text-red-700">
              Se encontraron {errores.length} error{errores.length !== 1 ? "es" : ""} — no se importó nada
            </p>
          </div>

          {/* lista scrolleable */}
          <ul className="max-h-52 overflow-y-auto divide-y divide-red-100">
            {errores.map((msg, i) => (
              <li
                key={i}
                className="px-4 py-2 text-xs text-red-700 flex items-start gap-2"
              >
                <span className="mt-0.5 shrink-0 font-bold text-red-400">✕</span>
                {msg}
              </li>
            ))}
          </ul>

        </div>
      )}

      {/* BOTONES */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
        <button
          onClick={cerrar}
          className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          Cancelar
        </button>

        <button
          onClick={handleSubmit}
          disabled={cargando}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {cargando ? "Importando..." : "Importar"}
        </button>
      </div>

    </Modal>
  )
}