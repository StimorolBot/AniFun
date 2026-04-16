import { memo } from "react"
import Masonry from "react-masonry-css"

import { CreateEpisode } from "./item/CreateEpisode"
import { CreatePreview } from "./item/CreatePreview"
import { DeleteEpisode } from "./item/DeleteEpisode"

export const RootEpisode = memo(
	({ isShowAlert, setUpdateAlert, setAlertData, breakpoints }) => {
		return (
			<section className="root-anime__section">
				<Masonry
					className="masonry-root"
					breakpointCols={breakpoints}
					columnClassName="masonry__column-root"
				>
					<CreateEpisode
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
					/>
					<CreatePreview
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
					/>
					<DeleteEpisode
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
					/>
				</Masonry>
			</section>
		)
	},
)
