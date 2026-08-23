import Skeleton from "react-loading-skeleton"

export const GenreSkeleton = ({ count }) => {
	return (
		<ul style={{ display: "flex", gap: 18 }}>
			{Array(count)
				.fill(0)
				.map((_, index) => {
					return (
						<li key={index}>
							<Skeleton
								style={{
									width: 300,
									height: 46,
									borderRadius: 10,
								}}
							/>
						</li>
					)
				})}
		</ul>
	)
}
