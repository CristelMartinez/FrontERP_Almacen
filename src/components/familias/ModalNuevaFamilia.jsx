import { useState } from "react"

import {
  FiSave,
  FiX
} from "react-icons/fi"

import Modal from "../Modal"

import InputField from "../InputField"

export default function ModalNuevaFamilia({
  cerrar,
  guardar
}) {

  const [form, setForm] = useState({
    codigo: "",
    nombre: ""
  })

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }

  const handleGuardar = () => {

    guardar(form)

  }

  return (

    <Modal ancho="max-w-xl">

      {/* HEADER */}
      <div className="
        bg-blue-600
        text-white

        text-lg
        font-semibold

        p-4
        rounded
        mb-6

        flex
        justify-between
      ">

        <span>
          Nueva Familia
        </span>

        <span className="
          text-sm
          opacity-90
        ">
          Registrar nueva familia
        </span>

      </div>

      {/* FORM */}
      <div className="
        grid
        grid-cols-1
        gap-6
      ">

        <InputField
          label="Código"
          name="codigo"
          value={form.codigo}
          onChange={handleChange}
          placeholder="Ej. 10"
        />

        <InputField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Ej. Etiquetas"
        />

      </div>

      {/* BOTONES */}
      <div className="
        flex
        justify-between
        mt-8
      ">

        <button
          onClick={cerrar}
          className="
            flex
            items-center
            gap-2

            bg-gray-200

            px-6
            py-2

            rounded-lg
            shadow

            hover:bg-gray-300
          "
        >
          <FiX />
          Cancelar
        </button>

        <button
          onClick={handleGuardar}
          className="
            flex
            items-center
            gap-2

            bg-blue-600
            text-white

            px-6
            py-2

            rounded-lg
            shadow

            hover:bg-blue-700
          "
        >
          <FiSave />
          Guardar
        </button>

      </div>

    </Modal>

  )

}