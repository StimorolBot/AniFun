import { memo, useRef, useState } from "react"
import { useForm } from "react-hook-form"

import { useQuery } from "@tanstack/react-query"

import { BtnDefault } from "../../../../../../ui/btn/BtnDefault"

import { CheckboxDefault } from "../../../../../../ui/input/CheckboxDefault"
import { CustomSelect } from "../../../../../../ui/input/CustomSelect"
import { TextareaValidate } from "../../../../../../ui/input/TextareaValidate"

import { SearchGenres } from "../../../../../../ui/search/SearchGenres"
import { InputAlias } from "../../../../ui/Input/InputAlias"
import { InputEpisode } from "../../../../ui/Input/InputEpisode"
import { InputTitle } from "../../../../ui/Input/InputTitle"
import { InputYear } from "../../../../ui/Input/InputYear"

import { Loader } from "../../../../../../components/loader/Loader"

import { api } from "../../../../../../api"
import { alertHandler } from "../../../../../../utils/utils"
import { rootAnimeTitle } from "../../../../query_key"

export const UpdateTitle = memo(
	({
		typeList,
		seasonList,
		statusList,
		ageRestrictList,
		isShowAlert,
		setUpdateAlert,
		setAlertData,
	}) => {
		const formDataRef = useRef()
		const [genres, setGenres] = useState()
		const [params, setParams] = useState()

		const {
			register,
			handleSubmit,
			formState: { errors, isValid },
			watch,
			setValue,
		} = useForm({
			mode: "onChange",
			defaultValues: {
				old_title_name: "",
				new_title_name: "",
				alias: "",
				description: "",
				year: null,
				total_episode: null,
				description: null,
			},
		})

		const { isFetching, refetch, error } = useQuery({
			queryKey: [rootAnimeTitle.update],
			retry: 1,
			enabled: false,
			queryFn: async () => {
				return api
					.patch("/admin/anime/update-title", formDataRef.current)
					.then((r) => r)
			},
		})

		const onSubmit = async (data) => {
			if (data?.alias === "") data.alias = null

			if (data?.description === "") data.description = null

			if (data?.new_title_name === "") data.new_title_name = null

			formDataRef.current = { ...genres, ...data, ...params }
			const response = await refetch()

			await alertHandler(response, error, setAlertData, setUpdateAlert)
		}

		return (
			<form
				className="root-anime__item"
				id="root-anime-form-update-title"
				onSubmit={handleSubmit(onSubmit)}
			>
				<h2 className="root-anime__title">Обновить тайтл</h2>
				<div className="root-anime__row">
					<InputTitle
						id={"root-title-update"}
						placeholder="Текущее название"
						required
						errorMsg={errors?.old_title_name?.message}
						register={register}
						param={"old_title_name"}
					/>
					<InputTitle
						id={"root-rename-title-update"}
						placeholder="Новое название"
						errorMsg={errors?.new_title_name?.message}
						register={register}
						param={"new_title_name"}
					/>
				</div>
				<InputAlias
					id={"root-alias-update"}
					errorMsg={errors?.alias?.message}
					register={register}
				/>
				<div className="root-anime__row">
					<InputYear
						id={"root-year-update"}
						errorMsg={errors?.year?.message}
						register={register}
					/>
					<InputEpisode
						id={"root-episode-count-update"}
						errorMsg={errors?.total_episode?.message}
						register={register}
					/>
				</div>
				<TextareaValidate
					id={"root-description-update"}
					placeholder="Описание"
					countLineBreak={6}
					setValue={setValue}
					value={watch("description") || ""}
					errorMsg={errors?.description?.message}
					register={register}
					param={"description"}
				/>
				<SearchGenres
					placeholder="Жанры"
					genres={genres}
					setGenres={setGenres}
					noOptionsMessage={() => "Не удалось найти жанр"}
				/>
				<div className="root-anime__row">
					<CustomSelect
						options={typeList}
						placeholder={"тип"}
						paramName={"type"}
						isSearchable={false}
						value={params}
						setValue={setParams}
					/>
					<CustomSelect
						options={seasonList}
						placeholder={"сезон"}
						paramName={"season"}
						isSearchable={false}
						value={params}
						setValue={setParams}
					/>
				</div>
				<div className="root-anime__row">
					<CustomSelect
						options={statusList}
						placeholder={"статус"}
						paramName={"status"}
						isSearchable={false}
						value={params}
						setValue={setParams}
					/>
					<CustomSelect
						options={ageRestrictList}
						placeholder={"возрастное ограничение"}
						paramName={"age_restrict"}
						isSearchable={false}
						value={params}
						setValue={setParams}
					/>
				</div>
				<CheckboxDefault
					id={"root-update-is_origin"}
					value={params?.is_origin || false}
					callback={() =>
						setParams((s) => ({ ...s, is_origin: !s?.is_origin }))
					}
				>
					Оригинальный тайтл
				</CheckboxDefault>
				<div className="root-anime__btn-container">
					{isFetching ? (
						<Loader size={"small"} />
					) : (
						<BtnDefault
							type="submit"
							form="root-anime-form-update-title"
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
