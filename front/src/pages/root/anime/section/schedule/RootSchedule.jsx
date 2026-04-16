import { memo } from "react"
import Masonry from "react-masonry-css"

import { CreateSchedules } from "./item/CreateSchedules"
import { DeleteSchedules } from "./item/DeleteSchedules"
import { DeleteSchedulesItem } from "./item/DeleteSchedulesItem"
import { UpdateSchedules } from "./item/UpdateSchedules"

const dayWeekList = [
	{ value: "monday", label: "понедельник" },
	{ value: "tuesday", label: "вторник" },
	{ value: "wednesday", label: "среда" },
	{ value: "thursday", label: "четверг" },
	{ value: "friday", label: "пятница" },
	{ value: "saturday", label: "суббота" },
	{ value: "sunday", label: "воскресенье" },
	{ value: "completed", label: "вышел" },
]

export const RootSchedule = memo(
	({ isShowAlert, setUpdateAlert, setAlertData, breakpoints }) => {
		return (
			<section className="root-anime__section">
				<Masonry
					className="masonry-root"
					breakpointCols={breakpoints}
					columnClassName="masonry__column-root"
				>
					<CreateSchedules
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
						dayWeekList={dayWeekList}
					/>
					<UpdateSchedules
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
						dayWeekList={dayWeekList}
					/>
					<DeleteSchedules
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
					/>
					<DeleteSchedulesItem
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
					/>
				</Masonry>
			</section>
		)
	},
)
