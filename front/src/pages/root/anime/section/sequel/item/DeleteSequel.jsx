import { memo, useRef } from "react"
import { useForm } from "react-hook-form"

import { useQuery } from "@tanstack/react-query"

import { BtnDefault } from "../../../../../../ui/btn/BtnDefault"

import { InputTitle } from "../../../../ui/Input/InputTitle"

import { Loader } from "../../../../../../components/loader/Loader"

import { api } from "../../../../../../api"
import { alertHandler } from "../../../../../../utils/utils"
import { rootAnimeSequel } from "../../../../query_key"

export const DeleteSequel = memo(
	({ isShowAlert, setUpdateAlert, setAlertData }) => {
		const formDataRef = useRef()
		const {
			register,
			handleSubmit,
			formState: { errors, isValid },
		} = useForm({ mode: "onChange" })

		const { isFetching, refetch, error } = useQuery({
			queryKey: [rootAnimeSequel.delete],
			retry: 1,
			enabled: false,
			queryFn: async () => {
				return api
					.delete("/admin/anime/delete-sequel-title", {
						params: formDataRef.current,
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
				id="root-anime-form-delete-sequel"
				onSubmit={handleSubmit(onSubmit)}
			>
				<h2 className="root-anime__title">Удалить</h2>
				<InputTitle
					id={"root-sequel-title-delete"}
					placeholder="Текущий тайтл"
					required
					errorMsg={errors?.title?.message}
					register={register}
					param={"title"}
				/>
				<InputTitle
					id={"root-sequel-name-delete"}
					placeholder="Название сиквела / приквела"
					required
					errorMsg={errors?.sequel_title?.message}
					register={register}
					param={"sequel_title"}
				/>
				<div className="root-anime__btn-container">
					{isFetching ? (
						<Loader size={"small"} />
					) : (
						<BtnDefault
							type="submit"
							form="root-anime-form-delete-sequel"
							disabled={!isValid || isShowAlert}
						>
							Удалить
						</BtnDefault>
					)}
				</div>
			</form>
		)
	},
)
