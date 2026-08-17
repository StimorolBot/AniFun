import Skeleton from "react-loading-skeleton"

export const SkeletonSearch = ({ count }) => {
	return (
		<ul className="search-popup__list transition">
			{Array(count)
				.fill(0)
				.map((_, index) => {
					return (
						<li className="search-popup_skeleton" key={index}>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									height: 90,
									marginTop: 20,
									backgroundColor: "#201f1f",
									padding: "0 10px",
									borderRadius: 6,
								}}
							>
								<div
									style={{
										width: 65,
										height: 80,
									}}
								>
									<Skeleton
										style={{
											width: "100%",
											height: "100%",
										}}
									/>
								</div>
								<div
									className="search-popup__content"
									style={{
										justifyContent: "center",
										gap: 5,
									}}
								>
									<Skeleton
										style={{
											width: 140,
											height: 20,
										}}
									/>
									<Skeleton
										style={{
											width: 100,
											height: 20,
										}}
									/>
									<Skeleton
										style={{
											width: 150,
											height: 20,
										}}
									/>
								</div>
							</div>
						</li>
					)
				})}
		</ul>
	)
}
