import { memo, useRef, useState } from "react"
import { useForm } from "react-hook-form"

import { useQuery } from "@tanstack/react-query"

import { BtnDefault } from "../../../../../../ui/btn/BtnDefault"

import { InputDragAndDrop } from "../../../../../../ui/input/InputDragAndDrop"

import { InputEpisode } from "../../../../ui/Input/InputEpisode"
import { InputTitle } from "../../../../ui/Input/InputTitle"

import { Loader } from "../../../../../../components/loader/Loader"

import { api } from "../../../../../../api"
import { alertHandler } from "../../../../../../utils/utils"
import { rootAnimeEpisodePreview } from "../../../../query_key"

export const CreatePreview = memo(
	({ isShowAlert, setUpdateAlert, setAlertData }) => {
		const formData = new FormData()
		const formDataRef = useRef()
		const [payloadFile, setPayloadFile] = useState()
		const {
			register,
			handleSubmit,
			formState: { errors, isValid },
		} = useForm({ mode: "onChange" })

		const { isFetching, refetch, error } = useQuery({
			queryKey: [rootAnimeEpisodePreview.create],
			retry: 1,
			enabled: false,
			queryFn: async () => {
				formData.append("file", payloadFile.file)
				return api
					.post("/admin/anime/add-preview-episode", formData, {
						params: formDataRef.current,
						headers: { "Content-Type": "multipart/form-data" },
					})
					.then((r) => r)
			},
		})

		const onSubmit = async (data) => {
			formDataRef.current = data
			const response = await refetch()

			await alertHandler(response, error, setAlertData, setUpdateAlert)
		}

		return (
			<form
				className="root-anime__item"
				id="root-anime-create-episode-preview"
				onSubmit={handleSubmit(onSubmit)}
			>
				<h2 className="root-anime__title">Добавить превью</h2>
				<InputTitle
					id={"root-episode-create"}
					placeholder="Название"
					required
					errorMsg={errors?.title?.message}
					register={register}
					param={"title"}
				/>
				<InputEpisode
					id={"root-episode-count-create"}
					required
					errorMsg={errors?.episode_number?.message}
					register={register}
					param={"episode_number"}
					placeholder={"Номер эпизода"}
				/>
				<InputDragAndDrop
					id={"root-anime-add-banner-file"}
					setPayloadFile={setPayloadFile}
					paramName={"file"}
				/>
				<div className="root-anime__btn-container">
					{isFetching ? (
						<Loader size={"small"} />
					) : (
						<BtnDefault
							type="submit"
							form="root-anime-create-episode-preview"
							disabled={!isValid || isShowAlert}
						>
							Добавить
						</BtnDefault>
					)}
				</div>
			</form>
		)
	},
)
