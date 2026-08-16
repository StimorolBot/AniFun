import Skeleton from "react-loading-skeleton"

export const ScheduleSkeleton = () => {
	return (
		<li className="schedule__item">
			<div className="schedule__link">
				<Skeleton
					className="skeleton__background"
					style={{ width: 120, height: 20 }}
				/>
				<Skeleton
					className="skeleton__background"
					style={{ width: 100, height: 14 }}
				/>
				<ul className="schedule__desc-list">
					<Skeleton
						className="skeleton__background"
						style={{ width: 40, height: 14 }}
					/>
					<Skeleton
						className="skeleton__background"
						style={{ width: 40, height: 14 }}
					/>
					<Skeleton
						className="skeleton__background"
						style={{ width: 40, height: 14 }}
					/>
				</ul>
				<ul className="schedule__desc-list">
					<Skeleton
						className="skeleton__background"
						style={{ width: 60, height: 14 }}
					/>
					<Skeleton
						className="skeleton__background"
						style={{ width: 60, height: 14 }}
					/>
				</ul>
			</div>
		</li>
	)
}
