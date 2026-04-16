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

export const CreatePoster = memo(
	({ isShowAlert, setUpdateAlert, setAlertData }) => {
		const formData = new FormData()
		const [payloadFile, setPayloadFile] = useState()

		const {
			register,
			handleSubmit,
			formState: { errors, isValid },
		} = useForm({ mode: "onChange" })

		const formDataRef = useRef()
		const { isFetching, refetch, error } = useQuery({
			queryKey: [rootAnimePoster.create],
			retry: 1,
			enabled: false,
			queryFn: async () => {
				formData.append("file", payloadFile.file)
				return api
					.post("/admin/anime/add-poster-title", formData, {
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
				id="root-anime-add-poster"
				onSubmit={handleSubmit(onSubmit)}
			>
				<h2 className="root-anime__title">Добавить постер</h2>
				<InputTitle
					id={"root-poster-create"}
					placeholder="Название"
					required
					errorMsg={errors?.title?.message}
					register={register}
					param={"title"}
				/>
				<InputDragAndDrop
					id={"root-anime-add-poster-file"}
					setPayloadFile={setPayloadFile}
					paramName={"file"}
				/>
				<div className="root-anime__btn-container">
					{isFetching ? (
						<Loader size={"small"} />
					) : (
						<BtnDefault
							type="submit"
							form="root-anime-add-poster"
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
