import { memo } from "react"
import { Helmet } from "react-helmet"

import { Footer } from "../../../components/footer/Footer"
import { Header } from "../../../components/header/Header"

import { Franchises } from "./section/franchises/Franchises"
import { Genres } from "./section/genres/Genres"
import { NewEpisodes } from "./section/new_episodes/NewEpisodes"
import { Schedule } from "./section/schedule/Schedule"
import { SwiperCustom } from "./section/swiper/SwiperCustom"

export const Home = memo(() => {
	return (
		<>
			<Helmet>
				<title>AniFun</title>
			</Helmet>
			<div className="wrapper">
				<Header />
				<main className="main">
					<h1 className="title-page">Главная страница</h1>
					<SwiperCustom />
					<NewEpisodes />
					<Schedule />
					<Franchises />
					<Genres />
				</main>
				<Footer />
			</div>
		</>
	)
})
