import { memo, useState } from "react"

import { useForm } from "react-hook-form"
import Masonry from "react-masonry-css"

import { useMutation } from "@tanstack/react-query"

import { Images } from "../../../ui/icon/Images"

import { InputDragAndDrop } from "../../../ui/input/InputDragAndDrop"

import { AlertAPI } from "../../../ui/alert/AlertAPI"
import { LblRequired } from "../../../ui/label/LblRequired"

import { api } from "../../../api"
import { FormEpisode } from "./form/FormEpisode"
import { HeaderForm } from "./header/HeaderForm"

const breakpoints = {
	default: 2,
	750: 1,
}

export const CreateEpisode = memo(() => {
	const [file, setFile] = useState()
	const [response, setResponse] = useState()

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm({
		mode: "onChange",
	})

	const createEpisodePreviewMutation = useMutation({
		mutationFn: async ({ uuid, episodeUuid }) => {
			const formData = new FormData()
			formData.append("preview", file.preview)

			await api.post(
				`/admin/anime/titles/${uuid}/episodes/${episodeUuid}/preview`,
				formData,
			)
		},
	})
	const createEpisodeVideoMutation = useMutation({
		mutationFn: async ({ uuid, episodeUuid }) => {
			const formData = new FormData()
			formData.append("video", file.video)

			await api.post(
				`/admin/anime/titles/${uuid}/episodes/${episodeUuid}/video`,
				formData,
			)
		},
	})

	const createEpisodeMutation = useMutation({
		mutationFn: async (data) => {
			const { uuid, ...payload } = data

			const response = await api.post(
				`/admin/anime/titles/${uuid}/episodes`,
				payload,
			)

			const episodeUuid = response.data.episode_uuid

			await createEpisodePreviewMutation.mutateAsync({
				uuid,
				episodeUuid,
			})

			await createEpisodeVideoMutation.mutateAsync({ uuid, episodeUuid })

			return response
		},
		onSuccess: (r) => {
			setResponse({
				id: crypto.randomUUID(),
				statusCode: r.status,
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
		createEpisodeMutation.mutateAsync(data)
	}

	const mutations = [
		createEpisodeMutation,
		createEpisodeMutation,
		createEpisodePreviewMutation,
	]

	const isPending = mutations.some((m) => m.isPending)

	return (
		<div className="root">
			<div className="root-container">
				<HeaderForm
					nameForm={"root-create-episode-form"}
					resetCallback={reset}
					isPending={isPending}
				/>
				<Masonry
					breakpointCols={breakpoints}
					className="masonry"
					columnClassName="masonry__column-root"
				>
					<FormEpisode
						id={"root-create-episode-form"}
						handleSubmit={handleSubmit(onSubmit)}
						errors={errors}
						register={register}
						control={control}
					/>
					<div>
						<h3 className="form-root__header">
							<Images />
							<span>Медия</span>
						</h3>
						<div
							className="form-title__list"
							style={{
								display: "flex",
								alignItems: "start",
								justifyContent: "space-between",
								gap: 20,
							}}
						>
							<form className="form-title">
								<LblRequired htmlFor="form-create-episode-preview">
									Превью
								</LblRequired>
								<InputDragAndDrop
									id={"form-create-episode-preview"}
									payload={file}
									setPayloadFile={setFile}
									paramName={"preview"}
									isLoading={isPending}
									ratio={"16:9"}
								/>
							</form>
							<form>
								<LblRequired
									htmlFor="form-create-episode-file"
									isRequired={true}
								>
									Эпизод
								</LblRequired>
								<InputDragAndDrop
									id={"form-create-episode-file"}
									payload={file}
									setPayloadFile={setFile}
									paramName={"video"}
									isLoading={isPending}
									ratio={"16:9"}
									accept={"video/mp4"}
									typeFile={"video/mp4"}
									required={true}
								/>
							</form>
						</div>
					</div>
				</Masonry>
				<AlertAPI
					id={response?.id}
					msg={response?.details}
					statusCode={response?.statusCode}
				/>
			</div>
		</div>
	)
})
