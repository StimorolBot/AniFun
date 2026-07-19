import { Controller } from "react-hook-form"

import { useQuery } from "@tanstack/react-query"

import { CustomSelect } from "../../ui/input/CustomSelect"

import { api } from "../../api"

import "./style/search_genres.sass"

export const SearchGenres = ({ control, ...props }) => {
	const { data: genresData } = useQuery({
		queryKey: ["genres-data-list"],
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return api.get("anime/genres/").then((r) => r.data)
		},
	})

	return (
		<Controller
			name="genres"
			control={control}
			render={({ field }) => {
				const handleChange = (selected) => {
					field.onChange(selected ? selected.map((v) => v.value) : [])
				}

				const selectedValues = (genresData || []).filter((g) =>
					field?.value?.includes(g.value),
				)
				return (
					<CustomSelect
						options={genresData}
						value={selectedValues}
						onChange={handleChange}
						className="genres-select"
						isMulti={true}
						{...props}
					/>
				)
			}}
		/>
	)
}
