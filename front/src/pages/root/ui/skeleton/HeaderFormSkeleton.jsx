import Skeleton from "react-loading-skeleton"

export const HeaderFormSkeleton = () => {
	const height = 18

	return (
		<div>
			<Skeleton width={200} height={height} />
			<div>
				<Skeleton
					width={270}
					height={height}
					style={{ margin: "5px 0" }}
				/>
				<Skeleton width={190} height={height} />
			</div>
		</div>
	)
}
