import Skeleton from "react-loading-skeleton"

export const TitleTopSkeleton = () => {
	return (
		<div className="title__top-container">
			<div className="title__poster">
				<Skeleton
					style={{
						width: 250,
						height: 375,
						borderRadius: 8,
						marginBottom: 10,
					}}
				/>
				<Skeleton style={{ width: 250, height: 47, borderRadius: 8 }} />
			</div>
			<div className="title__desc-container">
				<div>
					<div className="title__desc-name">
						<Skeleton width={450} height={60} />
						<Skeleton
							style={{
								width: 300,
								height: 20,
								marginTop: 10,
								marginBottom: 20,
							}}
						/>
					</div>
					<Skeleton
						style={{
							width: 75,
							height: 25,
							marginBottom: 10,
						}}
					/>
					<ul className="title__desc-list">
						<Skeleton width={90} height={27} />
						<Skeleton width={60} height={27} />
						<Skeleton width={50} height={27} />
					</ul>

					<Skeleton
						style={{ width: 800, height: 170, margin: "20px 0" }}
					/>
					<Skeleton width={520} height={43} />
				</div>
			</div>
		</div>
	)
}
