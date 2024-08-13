"use client"

export function PrimaryButton({children,onClick}:{
    children : React.ReactNode,
    onClick:()=>void
}) {
  return (
    <button type="button" onClick={onClick} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ">{children}</button>
  )
}

export function SecondaryButton({children,onClick,prefix}:{
    children : React.ReactNode,
    onClick:()=>void,
    prefix ? : React.ReactNode | ""
}) {
  return (
    <button type="button" onClick={onClick} className="text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ">
        <div>
            {prefix}
        </div>
        <div>
            {children}
        </div>
    </button>
  )
}


export function TertiaryButton({children,onClick,prefix}:{
  children : React.ReactNode,
  onClick:()=>void,
  prefix ? : React.ReactNode | ""
}) {
return (
  <button type="button" onClick={onClick} className="text-sky-900  bg-blue-300 w-full  hover:bg-blue-400  focus:ring-1 focus:ring-blue-400 focus:bg-blue-400 font-semibold rounded-md text-sm px-5 py-2.5 ml-2 mr-2 me-2 mb-2 ">
      <div>
          {prefix}
      </div>
      <div>
          {children}
      </div>
  </button>
)
}