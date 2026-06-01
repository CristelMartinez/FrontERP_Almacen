import { FiDownload, FiPlus, FiArchive } from "react-icons/fi"
import Table from "./Table"

/**
 * CatalogoPage — layout base para todas las páginas de catálogo maestro.
 *
 * Props:
 *  - titulo        string        Título de la página
 *  - subtitulo     string?       Texto descriptivo debajo del título
 *  - columns       array         Columnas para <Table>
 *  - data          array         Datos para <Table>
 *  - onNuevo       fn            Callback botón "Nuevo"
 *  - onInactivos   fn?           Callback botón "Ver inactivos"
 *  - onImportar    fn?           Callback botón "Importar" (solo si se pasa)
 *  - labelNuevo    string?       Texto del botón nuevo (default "Nuevo")
 *  - children                    Modales y overlays
 */
export default function CatalogoPage({
  titulo,
  subtitulo,
  columns,
  data,
  onNuevo,
  onInactivos,
  onImportar,
  labelNuevo = "Nuevo",
  children,
}) {
  return (
    <div className="flex flex-col gap-5">

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">

        {/* TÍTULO */}
        <div>
          <h1 className="text-lg font-semibold text-gray-800">{titulo}</h1>
          {subtitulo && (
            <p className="text-sm text-gray-400 mt-0.5">{subtitulo}</p>
          )}
        </div>

        {/* ACCIONES */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {onInactivos && (
            <button
              onClick={onInactivos}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition"
            >
              <FiArchive size={14} />
              Inactivos
            </button>
          )}

          {onImportar && (
            <button
              onClick={onImportar}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition"
            >
              <FiDownload size={14} />
              Importar
            </button>
          )}

          {onNuevo && (
            <button
              onClick={onNuevo}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              <FiPlus size={15} />
              {labelNuevo}
            </button>
          )}

        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl border border-gray-100">
        <Table columns={columns} data={data} />
      </div>

      {/* MODALES */}
      {children}

    </div>
  )
}