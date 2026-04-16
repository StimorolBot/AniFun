import { memo, useRef, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"

import { useQuery } from "@tanstack/react-query"

import { BtnDefault } from "../../../../../../ui/btn/BtnDefault"

import { CheckboxDefault } from "../../../../../../ui/input/CheckboxDefault"
import { CustomSelect } from "../../../../../../ui/input/CustomSelect"

import { InputDate } from "../../../../ui/Input/InputDate"
import { InputEpisode } from "../../../../ui/Input/InputEpisode"
import { InputTitle } from "../../../../ui/Input/InputTitle"

import { Loader } from "../../../../../../components/loader/Loader"

import { api } from "../../../../../../api"
import { alertHandler } from "../../../../../../utils/utils"
import { rootAnimeSchedule } from "../../../../query_key"

import "./style/create_schedules.sass"

export const CreateSchedules = memo(
	({ isShowAlert, setUpdateAlert, setAlertData, dayWeekList }) => {
		const formDataRef = useRef()
		const [params, setParams] = useState()
		const {
			register,
			control,
			handleSubmit,
			formState: { errors, isValid },
			setValue,
			getValues,
		} = useForm({
			mode: "onChange",
			defaultValues: {
				title: "",
				item: [
					{
						date: "",
						episode_number: undefined,
						episode_name: "",
					},
				],
			},
		})

		const { fields, append, remove } = useFieldArray({
			control,
			name: "item",
		})

		const { isFetching, refetch, error } = useQuery({
			queryKey: [rootAnimeSchedule.create],
			retry: 1,
			enabled: false,
			queryFn: async () => {
				return api
					.post("/admin/anime/set-schedules", formDataRef.current)
					.then((r) => r)
			},
		})

		const onSubmit = async (data) => {
			formDataRef.current = { ...data, ...params }
			const response = await refetch()
			await alertHandler(response, error, setAlertData, setUpdateAlert)
		}

		return (
			<form
				className="root-anime__item"
				id="root-anime-form-create-schedule"
				onSubmit={handleSubmit(onSubmit)}
			>
				<h2 className="root-anime__title">Создать расписание</h2>
				<div className="root-anime__row">
					<InputTitle
						id={"root-schedule-create"}
						placeholder="Название"
						required
						errorMsg={errors?.title?.message}
						register={register}
						param={"title"}
					/>
					<CustomSelect
						options={dayWeekList}
						placeholder={"день недели"}
						required
						paramName={"day_week"}
						isSearchable={false}
						value={params}
						setValue={setParams}
						isDict={true}
					/>
				</div>

				{fields.map((_, index) => {
					return (
						<div className="root-schedule__item" key={index}>
							<div className="root-anime__row">
								<InputEpisode
									id={`root-schedule-episode-create_${index}`}
									required
									errorMsg={
										errors?.item?.[index]?.episode_number
											?.message
									}
									register={register}
									param={`item.${index}.episode_number`}
									placeholder={"Номер эпизода"}
								/>
								<InputTitle
									id={`root-schedule-name-create_${index}`}
									placeholder="Название эпизода"
									required
									errorMsg={
										errors?.item?.[index]?.episode_name
											?.message
									}
									register={register}
									param={`item.${index}.episode_name`}
								/>
								<InputDate
									id={`root-schedule-date-create_${index}`}
									required
									errorMsg={
										errors?.item?.[index]?.date?.message
									}
									register={register}
									param={`item.${index}.date`}
								/>
							</div>
						</div>
					)
				})}
				<div className="root-schedule__btn-container">
					<BtnDefault
						type={"button"}
						callback={() =>
							append({
								date: "",
								episode_number: undefined,
								episode_name: "",
							})
						}
					>
						Добавить
					</BtnDefault>
					{fields.length > 1 && (
						<BtnDefault
							type={"button"}
							callback={() => remove(fields.length - 1)}
						>
							Удалить
						</BtnDefault>
					)}
				</div>
				<CheckboxDefault
					id={"root-create-is_extend"}
					value={params?.is_extend || false}
					callback={() =>
						setParams((s) => ({ ...s, is_extend: !s?.is_extend }))
					}
				>
					Добавить к существующему расписанию
				</CheckboxDefault>
				<div className="root-anime__btn-container">
					{isFetching ? (
						<Loader size={"small"} />
					) : (
						<BtnDefault
							type="submit"
							form="root-anime-form-create-schedule"
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
