import { memo } from "react"

import { Helmet } from "react-helmet"

import { Banner } from "./section/banner/Banner"
import { Franchises } from "./section/franchises/Franchises"
import { Genres } from "./section/genres/Genres"
import { NewEpisodes } from "./section/new_episodes/NewEpisodes"
import { Schedule } from "./section/schedule/Schedule"

import "./style.sass"

export const Home = memo(() => {
	const storageUrl = import.meta.env.VITE_STORAGE_URL
	return (
		<>
			<Helmet>
				<title>AniFun</title>
			</Helmet>
			<Banner storageUrl={storageUrl} />
			<main className="home">
				<div className="container">
					<div className="home__grid">
						<div className="home__main">
							<NewEpisodes storageUrl={storageUrl} />
							<Franchises storageUrl={storageUrl} />
						</div>
						<aside className="home__sidebar">
							<Schedule storageUrl={storageUrl} />
						</aside>
					</div>
					<Genres />
				</div>
			</main>
		</>
	)
})
