import { memo, useRef, useState } from "react"
import { useForm } from "react-hook-form"

import { useQuery } from "@tanstack/react-query"

import { BtnDefault } from "../../../../../../ui/btn/BtnDefault"

import { InputDragAndDrop } from "../../../../../../ui/input/InputDragAndDrop"

import { InputTitle } from "../../../../ui/Input/InputTitle"

import { Loader } from "../../../../../../components/loader/Loader"

import { api } from "../../../../../../api"
import { alertHandler } from "../../../../../../utils/utils"
import { rootAnimePoster } from "../../../../query_key"

export const UpdatePoster = memo(
	({ isShowAlert, setUpdateAlert, setAlertData }) => {
		const formData = new FormData()
		const [payloadFile, setPayloadFile] = useState()

		const formDataRef = useRef()
		const {
			register,
			handleSubmit,
			formState: { errors, isValid },
		} = useForm({ mode: "onChange" })

		const { isFetching, refetch, error } = useQuery({
			queryKey: [rootAnimePoster.update],
			retry: 1,
			enabled: false,
			queryFn: async () => {
				formData.append("file", payloadFile.file)
				return api
					.patch("/admin/anime/update-poster-title", formData, {
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
				id="root-anime-update-poster"
				onSubmit={handleSubmit(onSubmit)}
			>
				<h2 className="root-anime__title">Обновить постер</h2>
				<InputTitle
					id={"root-poster-update"}
					placeholder="Название"
					required
					errorMsg={errors?.title?.message}
					register={register}
					param={"title"}
				/>
				<InputDragAndDrop
					id={"root-anime-update-poster-file"}
					setPayloadFile={setPayloadFile}
					paramName={"file"}
				/>
				<div className="root-anime__btn-container">
					{isFetching ? (
						<Loader size={"small"} />
					) : (
						<BtnDefault
							type="submit"
							form="root-anime-update-poster"
							disabled={!isValid || isShowAlert}
						>
							Обновить
						</BtnDefault>
					)}
				</div>
			</form>
		)
	},
)
