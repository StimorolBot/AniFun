import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"
import { Outlet } from "react-router-dom"

import { api } from "../../../api"
import { RecTitle } from "./bottom/aside/RecTitle"
import { TitleNav } from "./nav/TitleNav"
import { TitleTop } from "./top/TitleTop"
import { useQuery } from "@tanstack/react-query"

import "./style.sass"

export const Title = () => {
	const { alias } = useParams()
	const storageUrl = import.meta.env.VITE_STORAGE_URL

	const { data: titleData, isLoading } = useQuery({
		queryKey: ["title-data", alias],
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return await api
				.get(`anime/titles/${alias}`, { params: { alias: alias } })
				.then((r) => r.data)
		},
	})

	return (
		<>
			<Helmet>
				<title>{titleData?.anime?.title}</title>
				<meta property="og:title" content={titleData?.anime?.title} />
				<meta
					property="og:description"
					content={titleData?.anime?.description}
				/>
				<meta
					property="og:image"
					content={`${storageUrl}/anime-${titleData?.anime?.uuid}/${titleData?.anime?.poster?.poster_uuid}.webp`}
				/>
			</Helmet>
			<h1 className="title-page">
				{`Смотреть аниме ${titleData?.anime?.title}`}
			</h1>
			<div className="container">
				{titleData?.anime && (
					<div className="container__inner">
						<div className="section__container">
							<TitleTop
								titleData={titleData}
								isLoading={isLoading}
								storageUrl={storageUrl}
							/>
							<TitleNav />
							<div className="title__bottom">
								<div className="title__outlet">
									<Outlet
										context={{
											titleUUID: titleData.anime.uuid,
											storageUrl: storageUrl,
										}}
									/>
								</div>
								<RecTitle storageUrl={storageUrl} />
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	)
}
