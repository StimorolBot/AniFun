import Skeleton from "react-loading-skeleton"

export const TitleEpisodeSkeleton = ({ count }) => {
	return (
		<>
			{Array(count)
				.fill(0)
				.map((_, index) => {
					return (
						<li className="title-episode__item" key={index}>
							<Skeleton width={340} height={145} />
						</li>
					)
				})}
		</>
	)
}
