export default function Modal({ children, ancho = "max-w-2xl" }) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div
        className={`
          bg-white w-full ${ancho}
          rounded-t-2xl sm:rounded-xl
          shadow-xl
          p-5 sm:p-8
          max-h-[92vh] sm:max-h-[90vh]
          overflow-y-auto
        `}
      >
        {children}
      </div>
    </div>
  )
}