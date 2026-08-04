import { memo } from "react"

import { Link } from "react-router-dom"

import { Edit } from "../../../../ui/icon/Edit"
import { Remove } from "../../../../ui/icon/Remove"

import { BtnDefault } from "../../../../ui/btn/BtnDefault"

import { useAutoFontSize } from "../../../../hook/useAutoFontSize"

import { formatDate } from "../../../../utils/date"

export const EpisodeItem = memo(({ item, callback, ...props }) => {
	const titleRef = useAutoFontSize({
		minSize: 14,
		maxSize: 20,
		deps: [item.title],
	})

	const episodeNameRef = useAutoFontSize({
		minSize: 12,
		maxSize: 18,
		deps: [item.name],
	})

	return (
		<tr className="root-title__item transition" {...props}>
			<td>
				<h4 ref={titleRef}>{item.title}</h4>
			</td>
			<td>
				<h5 ref={episodeNameRef}>{item.name}</h5>
			</td>
			<td>
				<p>{item.number}</p>
			</td>

			<td>
				<time dateTime={item.date_add}>
					{formatDate(item.date_add)}
				</time>
			</td>
			<td>
				<div className="root-title__btn">
					<Link to={`${item.episode_uuid}/edit`}>
						<Edit />
					</Link>
					<BtnDefault
						isStroke={false}
						callback={() =>
							callback(
								item.name,
								item.episode_uuid,
								item.title_uuid,
							)
						}
					>
						<Remove />
					</BtnDefault>
				</div>
			</td>
		</tr>
	)
})
