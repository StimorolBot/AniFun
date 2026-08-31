import { useRef } from "react"

import { Link } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { Rating } from "./rating/Rating"

import { Play } from "../../../../ui/icon/Play"
import { genres } from "../../../../ui/icon/genres/genres"

import { MainNav } from "../../../../ui/nav/MainNav"

import { TitleTopSkeleton } from "./skeleton/TitleTopSkeleton"

import { useAutoFontSize } from "../../../../hook/useAutoFontSize"

import "./style.sass"

const navList = (lastItem) => {
	return [
		{
			name: "Главная страница",
			path: "/",
		},
		{
			name: "Аниме",
			path: "/anime/",
		},
		{
			name: lastItem,
			path: "#",
		},
	]
}

const getIcon = (value, label, index) => {
	const GenreIcon = genres?.[value]

	return (
		<li key={index}>
			<GenreIcon />
			<span>{label}</span>
		</li>
	)
}

export const TitleTop = ({ titleData, isLoading, storageUrl }) => {
	const nav = navList(titleData.anime.title)

	const transitionRef = useRef()
	const titleRef = useAutoFontSize({
		minSize: 14,
		maxSize: 35,
		deps: [titleData.anime.title],
	})

	const subTitleRef = useAutoFontSize({
		minSize: 12,
		maxSize: 16,
		deps: [titleData.anime.title],
	})

	return (
		<section>
			<MainNav subNav={nav} />
			<div className="title__top">
				<SwitchTransition mode="out-in">
					<CSSTransition
						classNames="transition"
						key={isLoading}
						nodeRef={transitionRef}
						timeout={300}
					>
						{isLoading ? (
							<TitleTopSkeleton />
						) : (
							<div
								className="title__top-container transition"
								ref={transitionRef}
							>
								<div className="title__poster">
									<div className="title__poster-container">
										<img
											src={`${storageUrl}/anime-${titleData.anime.uuid}/${titleData.anime.poster.poster_uuid}.webp`}
											onError={(e) => {
												const img = e.currentTarget
												img.onerror = null
												img.src = `${storageUrl}/stickers/6093866d92af49f68292ba298b383eea.png`
											}}
											loading="lazy"
											alt="Постер"
										/>
									</div>
									<Link className="title__poster-link">
										<Play
											style={{
												width: 23,
												height: 23,
												fill: "currentColor",
											}}
										/>
										<span>Смотреть</span>
									</Link>
								</div>
								<div className="title__desc-container">
									<div>
										<div className="title__desc-name">
											<h3 ref={titleRef}>
												{titleData.anime.title}
											</h3>
											<h4 ref={subTitleRef}>
												{titleData.anime.sub_title}
											</h4>
										</div>
										<p
											className="title__status"
											data-title-status={
												titleData.anime.status.value
											}
										>
											{titleData.anime.status.label}
										</p>
										<ul className="title__desc-list">
											<li>
												{titleData.anime.type.label}
											</li>
											<li>
												{titleData.anime.season.label}
											</li>
											<li>{titleData.anime.year}</li>
											<li>
												{
													titleData.anime.age_restrict
														.label
												}
											</li>
										</ul>

										<p className="title__description-text">
											{titleData.anime.description}
										</p>
										<ul className="title__desc-genres">
											{titleData.anime.genres.map(
												(genre, index) => {
													return getIcon(
														genre.value,
														genre.label,
														index,
													)
												},
											)}
										</ul>
									</div>
								</div>
							</div>
						)}
					</CSSTransition>
				</SwitchTransition>
				<Rating titleUUID={titleData.anime.uuid} />
			</div>
		</section>
	)
}
