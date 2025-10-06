import { useState } from "react"
import { router } from "./router"
import { RouterProvider } from "react-router-dom"

import { GenresContext } from "./context/GenresContext"


export function App() {
  const [genresContext, setGenresContext] = useState([])

  return (
    <GenresContext.Provider value={{genresContext, setGenresContext}}>
      <RouterProvider router={ router }/>
    </GenresContext.Provider>
  )
}
