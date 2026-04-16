import { useQuery } from "@tanstack/react-query"

import { CustomSelect } from "../../ui/input/CustomSelect"

import { api } from "../../api"

import "./style/search_genres.sass"

export const SearchGenres = ({ genres, setGenres, ...props }) => {
	const { data: genresData } = useQuery({
		queryKey: ["genres-data-list"],
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return api.get("anime/genres/list").then((r) => r.data)
		},
	})

	return (
		<CustomSelect
			options={genresData}
			value={genres}
			setValue={setGenres}
			className="genres-select"
			isMulti={true}
			paramName={"genres"}
			{...props}
		/>
	)
}
