export default function Modal({ children, ancho = "max-w-2xl" }) {

  return (

    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">

      <div className={`bg-white rounded-xl shadow-xl w-full ${ancho} p-8`}>

        {children}

      </div>

    </div>

  )

}