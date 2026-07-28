import { memo, useEffect, useState } from "react"

import { useForm } from "react-hook-form"
import Masonry from "react-masonry-css"
import { useParams } from "react-router-dom"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { AlertAPI } from "../../../ui/alert/AlertAPI"
import { HeaderFormSkeleton } from "../ui/skeleton/HeaderFormSkeleton"

import { useAutoFontSize } from "../../../hook/useAutoFontSize"

import { api } from "../../../api"
import { FormPosterAndBanner } from "./form/FormPosterAndBanner"
import { FormTitle } from "./form/FormTitle"
import { HeaderForm } from "./header/HeaderForm"

import "./style/edit_title.sass"

const breakpoints = {
	default: 2,
	750: 1,
}
export const EditTitle = memo(() => {
	const queryClient = useQueryClient()
	const storageUrl = import.meta.env.VITE_STORAGE_URL

	const { alias } = useParams()
	const [imgData, setImgData] = useState()
	const [response, setResponse] = useState({})

	const { data: titleData, isLoading } = useQuery({
		queryKey: ["title-data", alias],
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return await api.get(`anime/titles/${alias}`).then((r) => r.data)
		},
	})

	const titleRef = useAutoFontSize({
		minSize: 16,
		maxSize: 24,
		deps: [titleData?.anime.title],
	})

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm({
		mode: "onChange",
	})

	const resetTitleData = () => {
		reset({
			title: titleData.anime.title,
			sub_title: titleData.anime.sub_title,
			alias: titleData.anime.alias,
			description: titleData.anime.description,
			year: titleData.anime.year,
			type: titleData.anime.type?.value,
			season: titleData.anime.season?.value,
			age_restrict: titleData.anime.age_restrict?.value,
			status: titleData.anime.status?.value,
			is_origin: titleData.anime.is_origin,
			total_episode: titleData.anime.total_episode,
			genres: titleData.anime.genres.map((g) => g.value),
		})
	}

	const resetImgData = () => {
		const posterUuid = titleData.anime?.poster?.poster_uuid
		const bannerUuid = titleData.anime?.banner?.banner_uuid

		setImgData({
			poster: posterUuid
				? `${storageUrl}/anime-${titleData.anime.uuid}/${posterUuid}.webp`
				: undefined,
			banner: bannerUuid
				? `${storageUrl}/anime-${titleData.anime.uuid}/${bannerUuid}.webp`
				: undefined,
		})
	}

	const uuid = titleData?.anime?.uuid

	const updateBannerMutation = useMutation({
		mutationFn: async () => {
			const formData = new FormData()
			formData.append("banner", imgData.banner)
			await api.patch(`admin/anime/titles/${uuid}/banners`, formData)
		},
	})

	const updatePosterMutation = useMutation({
		mutationFn: async () => {
			const formData = new FormData()
			formData.append("poster", imgData.poster)
			await api.patch(`admin/anime/titles/${uuid}/poster`, formData)
		},
	})

	const updateTitleMutation = useMutation({
		mutationFn: async (data) => {
			const response = await api.patch(`admin/anime/titles/${uuid}`, data)

			const tasks = []

			if (imgData.poster instanceof File) {
				tasks.push(updatePosterMutation.mutateAsync())
			}

			if (imgData.banner instanceof File) {
				tasks.push(updateBannerMutation.mutateAsync())
			}

			await Promise.all(tasks)

			return response
		},

		onSuccess: (r) => {
			setResponse({
				id: crypto.randomUUID(),
				statusCode: r.status,
			})
			queryClient.invalidateQueries({
				queryKey: ["title-data", alias],
			})
		},
		onError: (e) => {
			setResponse({
				id: crypto.randomUUID(),
				statusCode: e.status,
				details: e.response.data?.detail,
			})
		},
	})

	const onSubmit = (data) => {
		updateTitleMutation.mutate(data)
	}

	const mutations = [
		updateTitleMutation,
		updatePosterMutation,
		updateBannerMutation,
	]

	const isPending = mutations.some((m) => m.isPending)

	useEffect(() => {
		if (!titleData) return

		resetTitleData()
		resetImgData()
	}, [titleData, reset])

	return (
		<div className="root">
			<div className="root-container">
				<HeaderForm
					nameForm={"root-edit-title-form"}
					isPending={isPending}
					resetCallback={() => {
						resetTitleData()
						resetImgData()
					}}
				>
					{isLoading ? (
						<HeaderFormSkeleton />
					) : (
						<div className="edit-title__header">
							<h2 ref={titleRef}>{titleData?.anime.title}</h2>
							<div>
								<p className="edit-title__uuid">
									UUID: {titleData?.anime.uuid}
								</p>
								<p className="edit-title__create-data">
									Создан:{" "}
									<data value={titleData?.anime.date_add}>
										{new Date(
											titleData?.anime.date_add,
										).toLocaleDateString(
											navigator.language,
										)}
									</data>
								</p>
							</div>
						</div>
					)}
				</HeaderForm>
				<Masonry
					breakpointCols={breakpoints}
					className="masonry"
					columnClassName="masonry__column-root"
				>
					<FormTitle
						id={"root-edit-title-form"}
						handleSubmit={handleSubmit(onSubmit)}
						errors={errors}
						register={register}
						control={control}
					/>
					<FormPosterAndBanner
						id={"root-edit-poster-form"}
						imgFile={imgData}
						setImgFile={setImgData}
					/>
				</Masonry>
				<AlertAPI
					id={response.id}
					msg={response.details}
					statusCode={response.statusCode}
				/>
			</div>
		</div>
	)
})
