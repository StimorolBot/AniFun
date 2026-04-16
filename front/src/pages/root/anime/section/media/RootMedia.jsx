import { memo } from "react"
import Masonry from "react-masonry-css"

import { CreateBanner } from "./item/CreateBanner"
import { CreatePoster } from "./item/CreatePoster"
import { DeleteBanner } from "./item/DeleteBanner"
import { UpdateBanner } from "./item/UpdateBanner"
import { UpdatePoster } from "./item/UpdatePoster"

export const RootMedia = memo(
	({ isShowAlert, setUpdateAlert, setAlertData, breakpoints }) => {
		return (
			<section className="root-anime__section">
				<Masonry
					className="masonry-root"
					breakpointCols={breakpoints}
					columnClassName="masonry__column-root"
				>
					<CreateBanner
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
					/>
					<CreatePoster
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
					/>
					<UpdateBanner
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
					/>
					<UpdatePoster
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
					/>
					<DeleteBanner
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
					/>
				</Masonry>
			</section>
		)
	},
)
