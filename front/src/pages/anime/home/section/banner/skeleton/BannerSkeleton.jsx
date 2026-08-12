import Skeleton from "react-loading-skeleton"

export const BannerSkeleton = () => {
	return (
		<div style={{ height: 380 }}>
			<div className="banner">
				<Skeleton
					className="skeleton__background"
					style={{
						width: "100%",
						height: "100%",
						borderRadius: 20,
					}}
				/>
				<div className="banner__inner">
					<Skeleton style={{ width: 250, height: 30 }} />
					<ul className="banner-desc__list" style={{ gap: 20 }}>
						<Skeleton style={{ width: 70, height: 25 }} />
						<Skeleton style={{ width: 70, height: 25 }} />
						<Skeleton style={{ width: 70, height: 25 }} />
					</ul>
					<ul className="banner-desc__list" style={{ gap: 20 }}>
						<Skeleton style={{ width: 80, height: 25 }} />
						<Skeleton style={{ width: 80, height: 25 }} />
						<Skeleton style={{ width: 80, height: 25 }} />
					</ul>
					<Skeleton
						style={{ width: "100%", height: 90, margin: "10px 0" }}
					/>
					<Skeleton
						style={{
							position: "absolute",
							bottom: -30,
							width: 120,
							height: 40,
						}}
					/>
				</div>
				<div className="banner__btn">
					<Skeleton style={{ width: 30, height: 30 }} />
					<Skeleton style={{ width: 30, height: 30 }} />
				</div>
			</div>
		</div>
	)
}
