import { memo } from "react"

import { Link } from "react-router-dom"

import { genres } from "../../../../../../ui/icon/genres/genres"

import "./style.sass"

export const GenresItem = memo(({ item, ...props }) => {
	const GenreIcon = genres?.[item.value]

	return (
		<li {...props}>
			<Link
				className="genres__item-link"
				to={`/anime/genres/${item.value}`}
			>
				{GenreIcon && <GenreIcon />}
				<h4>{item.label}</h4>
				<p>{item.genres_count}</p>
			</Link>
		</li>
	)
})
