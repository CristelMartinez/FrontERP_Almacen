export default function ModalEliminarFamilia({ familia, cerrar, confirmar }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold mb-2">Eliminar familia</h2>
        <p className="text-sm text-gray-600 mb-6">
          ¿Estás seguro de eliminar{" "}
          <span className="font-medium text-gray-900">{familia.nombre}</span>?
          Esta acción la marcará como inactiva.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={cerrar}
            className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={confirmar}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}