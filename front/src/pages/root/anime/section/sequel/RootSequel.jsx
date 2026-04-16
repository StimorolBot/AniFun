import { memo } from "react"
import Masonry from "react-masonry-css"

import { CreateSequel } from "./item/CreateSequel"
import { DeleteSequel } from "./item/DeleteSequel"

export const RootSequel = memo(
	({ isShowAlert, setUpdateAlert, setAlertData, breakpoints }) => {
		return (
			<section className="root-anime__section">
				<Masonry
					className="masonry-root"
					breakpointCols={breakpoints}
					columnClassName="masonry__column-root"
				>
					<CreateSequel
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
					/>
					<DeleteSequel
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
					/>
				</Masonry>
			</section>
		)
	},
)
