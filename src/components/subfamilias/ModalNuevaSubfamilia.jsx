import { useEffect, useState } from "react"

import {
  FiSave,
  FiX
} from "react-icons/fi"

import toast from "react-hot-toast"

import api from "../../api/api"

import Modal from "../Modal"

import InputField from "../InputField"

import SelectField from "../SelectField"

export default function ModalNuevaSubfamilia({
  cerrar,
  guardar
}) {

  const [familias, setFamilias] =
    useState([])

  const [form, setForm] = useState({
    id_familia: "",
    codigo: "",
    nombre: ""
  })

  useEffect(() => {

    cargarFamilias()

  }, [])

  const cargarFamilias =
    async () => {

      try {

        const res =
          await api.get("/familias")

        setFamilias(res.data)

      } catch (error) {

        console.error(error)

        toast.error(
          "Error cargando familias"
        )

      }

    }

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }

  const handleGuardar = () => {

    if (!form.id_familia) {

      toast.error(
        "Debe seleccionar una familia"
      )

      return

    }

    if (!form.codigo.trim()) {

      toast.error(
        "El código es obligatorio"
      )

      return

    }

    if (!form.nombre.trim()) {

      toast.error(
        "El nombre es obligatorio"
      )

      return

    }

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
          Nueva Subfamilia
        </span>

        <span className="
          text-sm
          opacity-90
        ">
          Registrar nueva subfamilia
        </span>

      </div>

      {/* FORM */}
      <div className="
        grid
        grid-cols-1
        gap-6
      ">

        <SelectField
          label="Familia"
          name="id_familia"
          value={form.id_familia}
          onChange={handleChange}
          options={familias.map(f => ({
            id: f.id_familia,
            nombre:
              `${f.codigo} - ${f.nombre}`
          }))}
        />

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
          placeholder="Ej. Nylon"
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