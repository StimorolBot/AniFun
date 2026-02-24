import { useState } from "react"
import { router } from "./router"
import { RouterProvider } from "react-router-dom"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"


import { GenresContext } from "./context/GenresContext"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"


export function App() {
  const [genresContext, setGenresContext] = useState([])
  const queryClient = new QueryClient()


  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false}/>
      <GenresContext.Provider value={{genresContext, setGenresContext}}>
        <RouterProvider router={ router }/>
      </GenresContext.Provider>
    </QueryClientProvider>
  )
}
