import { useState } from "react"
import { SkeletonTheme } from "react-loading-skeleton"
import { RouterProvider } from "react-router-dom"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { GenresContext } from "./context/GenresContext"
import { router } from "./router"

export function App() {
	const [genresContext, setGenresContext] = useState([])
	const queryClient = new QueryClient()

	return (
		<SkeletonTheme baseColor="#101010" highlightColor="#141414">
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen={false} />
				<GenresContext.Provider
					value={{ genresContext, setGenresContext }}
				>
					<RouterProvider router={router} />
				</GenresContext.Provider>
			</QueryClientProvider>
		</SkeletonTheme>
	)
}
