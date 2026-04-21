import { memo } from "react"
import { Helmet } from "react-helmet"

import { Franchises } from "./section/franchises/Franchises"
import { Genres } from "./section/genres/Genres"
import { NewEpisodes } from "./section/new_episodes/NewEpisodes"
import { Schedule } from "./section/schedule/Schedule"
import { SwiperCustom } from "./section/swiper/SwiperCustom"

import "./adaptive.sass"

export const Home = memo(() => {
	return (
		<>
			<Helmet>
				<title>AniFun</title>
			</Helmet>
			<h1 className="title-page">Главная страница</h1>
			<SwiperCustom />
			<NewEpisodes />
			<Schedule />
			<Franchises />
			<Genres />
		</>
	)
})
