import Skeleton from "react-loading-skeleton"

export const TitleSkeleton = ({ count }) => {
	const heightSkeleton = 25
	const widthSkeleton = 100
	return (
		<>
			{Array.from({ length: count }).map((_, index) => {
				return (
					<tr className="root-title__item" key={index}>
						<td>
							<div className="root-title__img-container">
								<Skeleton style={{ height: 100, width: 70 }} />
							</div>
						</td>
						<td>
							<div>
								<Skeleton style={{ width: 150 }} />
								<Skeleton
									style={{
										width: widthSkeleton,
										marginTop: 5,
									}}
								/>
							</div>
						</td>
						<td>
							<Skeleton
								style={{
									height: heightSkeleton,
									width: widthSkeleton,
								}}
							/>
						</td>
						<td>
							<Skeleton
								style={{
									height: heightSkeleton,
									width: widthSkeleton,
								}}
							/>
						</td>

						<td>
							<Skeleton
								style={{
									height: heightSkeleton,
									width: widthSkeleton,
								}}
							/>
						</td>
						<td>
							<p>
								<Skeleton
									style={{
										height: heightSkeleton,
										width: widthSkeleton,
									}}
								/>
							</p>
						</td>
						<td>
							<Skeleton
								style={{
									height: heightSkeleton,
									width: widthSkeleton,
								}}
							/>
						</td>
						<td>
							<div className="root-title__btn">
								<Skeleton
									style={{
										height: heightSkeleton,
										width: heightSkeleton,
										borderRadius: "50%",
									}}
								/>
								<Skeleton
									style={{
										height: heightSkeleton,
										width: heightSkeleton,
										borderRadius: "50%",
									}}
								/>
							</div>
						</td>
					</tr>
				)
			})}
		</>
	)
}
