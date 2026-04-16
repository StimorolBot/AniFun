import { memo, useRef } from "react"
import { useForm } from "react-hook-form"

import { useQuery } from "@tanstack/react-query"

import { BtnDefault } from "../../../../../../ui/btn/BtnDefault"

import { InputTitle } from "../../../../ui/Input/InputTitle"

import { Loader } from "../../../../../../components/loader/Loader"

import { api } from "../../../../../../api"
import { alertHandler } from "../../../../../../utils/utils"
import { rootAnimeSequel } from "../../../../query_key"

export const CreateSequel = memo(
	({ isShowAlert, setUpdateAlert, setAlertData }) => {
		const formDataRef = useRef()
		const {
			register,
			handleSubmit,
			formState: { errors, isValid },
		} = useForm({ mode: "onChange" })

		const { isFetching, refetch, error } = useQuery({
			queryKey: [rootAnimeSequel.create],
			retry: 1,
			enabled: false,
			queryFn: async () => {
				return api
					.post("/admin/anime/add-sequel-title", formDataRef.current)
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
				id="root-anime-form-create-sequel"
				onSubmit={handleSubmit(onSubmit)}
			>
				<h2 className="root-anime__title">Добавить</h2>
				<InputTitle
					id={"root-sequel-title-create"}
					placeholder="Текущий тайтл"
					required
					errorMsg={errors?.title?.message}
					register={register}
					param={"title"}
				/>
				<InputTitle
					id={"root-sequel-name-create"}
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
							form="root-anime-form-create-sequel"
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
