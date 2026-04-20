import { useState } from "react"
import { SkeletonTheme } from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { RouterProvider } from "react-router-dom"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { ObserverImgProvider } from "./providers/ObserverImgProvider"

import { router } from "./router"

export const App = () => {
	const queryClient = new QueryClient()

	return (
		<SkeletonTheme baseColor="#101010" highlightColor="#141414">
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen={false} />
				<ObserverImgProvider>
					<RouterProvider router={router} />
				</ObserverImgProvider>
			</QueryClientProvider>
		</SkeletonTheme>
	)
}
