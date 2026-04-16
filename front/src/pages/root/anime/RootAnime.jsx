import { memo, useRef, useState } from "react"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { useQuery } from "@tanstack/react-query"

import { InputRadio } from "../../../ui/input/InputRadio"

import { AlertResponse } from "../../../ui/alert/AlertResponse"

import { HeaderRoot } from "../../../components/header/HeaderRoot"
import { Loader } from "../../../components/loader/Loader"

import { RootEpisode } from "./section/episode/RootEpisode"
import { RootGenres } from "./section/genres/RootGenres"
import { RootMedia } from "./section/media/RootMedia"
import { RootSchedule } from "./section/schedule/RootSchedule"
import { RootSequel } from "./section/sequel/RootSequel"
import { RootTitle } from "./section/title/RootTitle"

import { api } from "../../../api"
import { Error } from "../../error/Error"
import { isRoot } from "../query_key"

import "./style.sass"

const subNav = [
	{ name: "Панель администратора", path: "/root" },
	{ name: "Аниме", path: "#" },
]

const sectionList = [
	{ value: "title", label: "Тайтлы", checked: true },
	{ value: "media", label: "Баннеры / Постеры" },
	{ value: "episode", label: "Эпизоды / Превью" },
	{ value: "schedule", label: "Расписание" },
	{ value: "sequel", label: "Сиквелы / Приквелы" },
	{ value: "genres", label: "Жанры" },
]

const breakpoints = {
	default: 2,
	1280: 1,
}

export const RootAnime = memo(() => {
	const [activeSection, setActiveSection] = useState("title")
	const transitionRef = useRef(null)

	const [isShowAlert, setIsShowAlert] = useState(false)
	const [updateAlert, setUpdateAlert] = useState(0)
	const [alertData, setAlertData] = useState({
		msg: undefined,
		statusCode: undefined,
		prefix: undefined,
	})

	const { isLoading, isError } = useQuery({
		queryKey: [isRoot],
		retry: 2,
		queryFn: async () => {
			return api.get("/root").then((r) => r.data)
		},
	})

	if (isError) return <Error />

	const renderActiveSection = () => {
		switch (activeSection) {
			case "title":
				return (
					<RootTitle
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
						breakpoints={breakpoints}
					/>
				)
			case "media":
				return (
					<RootMedia
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
						breakpoints={breakpoints}
					/>
				)
			case "episode":
				return (
					<RootEpisode
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
						breakpoints={breakpoints}
					/>
				)
			case "schedule":
				return (
					<RootSchedule
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
						breakpoints={breakpoints}
					/>
				)
			case "sequel":
				return (
					<RootSequel
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
						breakpoints={breakpoints}
					/>
				)
			case "genres":
				return (
					<RootGenres
						isShowAlert={isShowAlert}
						setUpdateAlert={setUpdateAlert}
						setAlertData={setAlertData}
						breakpoints={breakpoints}
					/>
				)
		}
	}

	return (
		<div className="wrapper">
			<main className="main">
				{isLoading ? (
					<Loader center={true} />
				) : (
					<>
						<HeaderRoot subNav={subNav} />
						<div className="container">
							<div className="root-anime__container">
								<div className="root-anime__section-nav">
									{sectionList.map((item, index) => {
										return (
											<InputRadio
												id={"root-anime"}
												name={"root-anime"}
												index={index}
												value={item.value}
												defaultChecked={
													item?.checked || false
												}
												callbackOnChange={(value) =>
													setActiveSection(value)
												}
												key={index}
											>
												{item.label}
											</InputRadio>
										)
									})}
								</div>
								<SwitchTransition mode="out-in">
									<CSSTransition
										key={activeSection}
										timeout={260}
										classNames="root-anime-switch"
										nodeRef={transitionRef}
									>
										<div ref={transitionRef}>
											{renderActiveSection()}
										</div>
									</CSSTransition>
								</SwitchTransition>
							</div>
						</div>
						<AlertResponse
							msg={alertData.msg}
							statusCode={alertData.statusCode}
							update={updateAlert}
							prefix={alertData.prefix}
							isShowAlert={isShowAlert}
							setIsShowAlert={setIsShowAlert}
						/>
					</>
				)}
			</main>
		</div>
	)
})
