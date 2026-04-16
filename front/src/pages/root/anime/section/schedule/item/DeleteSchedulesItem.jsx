import { memo, useRef } from "react"
import { useForm } from "react-hook-form"

import { useQuery } from "@tanstack/react-query"

import { BtnDefault } from "../../../../../../ui/btn/BtnDefault"

import { InputEpisode } from "../../../../ui/Input/InputEpisode"
import { InputTitle } from "../../../../ui/Input/InputTitle"

import { Loader } from "../../../../../../components/loader/Loader"

import { api } from "../../../../../../api"
import { alertHandler } from "../../../../../../utils/utils"
import { rootAnimeSchedule } from "../../../../query_key"

export const DeleteSchedulesItem = memo(
	({ isShowAlert, setUpdateAlert, setAlertData }) => {
		const formDataRef = useRef()
		const {
			register,
			handleSubmit,
			resetField,
			formState: { errors, isValid },
		} = useForm({ mode: "onChange" })

		const { isFetching, refetch, error } = useQuery({
			queryKey: [rootAnimeSchedule.deleteItem],
			retry: 1,
			enabled: false,
			queryFn: async () => {
				return api
					.delete("/admin/anime/delete-schedules-item", {
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
				id="root-anime-form-delete-schedule-item"
				onSubmit={handleSubmit(onSubmit)}
			>
				<h2 className="root-anime__title">
					Удалить эпизод из расписания
				</h2>
				<InputTitle
					id={"root-schedule-delete-item"}
					placeholder="Название"
					required
					errorMsg={errors?.title?.message}
					register={register}
					param={"title"}
				/>
				<InputEpisode
					id={"root-schedule-episode-delete-item"}
					required
					errorMsg={errors?.episode_number?.message}
					register={register}
					param={"episode_number"}
					placeholder={"Номер эпизода"}
				/>
				<div className="root-anime__btn-container">
					{isFetching ? (
						<Loader size={"small"} />
					) : (
						<BtnDefault
							type="submit"
							form="root-anime-form-delete-schedule-item"
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
