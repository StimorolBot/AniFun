import Skeleton from "react-loading-skeleton"

export const EpisodeSkeleton = ({ count }) => {
	return (
		<ul
			style={{
				display: "flex",
				gap: 20,
				justifyContent: "space-between",
			}}
		>
			{Array(count)
				.fill(0)
				.map((_, index) => {
					return (
						<li key={index}>
							<Skeleton
								style={{
									height: 265,
									width: 180,
									borderRadius: 6,
								}}
							/>
							<div style={{ marginTop: 10 }}>
								<Skeleton style={{ width: 130, height: 20 }} />
								<Skeleton
									style={{
										width: 100,
										height: 20,
										margin: "5px 0 ",
									}}
								/>
								<Skeleton style={{ width: 130, height: 20 }} />
							</div>
						</li>
					)
				})}
		</ul>
	)
}
