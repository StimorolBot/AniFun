import { useState } from "react"

import { Controller } from "react-hook-form"

import { useQuery } from "@tanstack/react-query"

import { CustomSelect } from "../../ui/input/CustomSelect"

import { useDebounce } from "../../hook/useDebounce"

import { api } from "../../api"

import "./style/search_title.sass"

export const SearchTitle = ({ control, ...props }) => {
	const [searchTitle, setSearchTitle] = useState("")

	const { data: titleData } = useQuery({
		queryKey: ["search-title-data-list"],
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return api
				.get("admin/anime/titles/", { params: { size: 20 } })
				.then((r) => r.data)
		},
	})

	const localResult = titleData?.items.filter((item) =>
		item.label.toLowerCase().includes(searchTitle.toLowerCase()),
	)

	const debounceSearchVal = useDebounce(searchTitle)

	const { data: searchTitleData, isLoading } = useQuery({
		queryKey: ["search-title-data", debounceSearchVal],
		enabled: debounceSearchVal?.length > 5,
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return api
				.get("admin/anime/titles", {
					params: { title: debounceSearchVal, size: 5 },
				})
				.then((r) => r.data)
		},
	})

	const options =
		localResult?.length > 0 ? localResult : (searchTitleData?.items ?? [])

	return (
		<Controller
			name="uuid"
			control={control}
			render={({ field }) => {
				const handleChange = (selected) => {
					field.onChange(selected ? selected.value : "")
				}

				const selectedValues = options.filter((g) =>
					field?.value?.includes(g.value),
				)
				return (
					<CustomSelect
						className="title-select"
						options={options}
						value={selectedValues}
						onChange={handleChange}
						onInputChange={(value) => setSearchTitle(value)}
						isSearchable={true}
						isLoading={isLoading}
						noOptionsMessage={() => null}
						{...props}
					/>
				)
			}}
		/>
	)
}
