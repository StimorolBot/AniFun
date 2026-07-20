import { Clipboard } from "../../../../ui/icon/Clipboard"

import { InputCheckbox } from "../../../../ui/input/InputCheckbox"
import { TextareaValidate } from "../../../../ui/input/TextareaValidate"
import { ValidSelect } from "../../../../ui/input/ValidSelect"
import { InputAlias } from "../../ui/input/InputAlias"
import { InputEpisode } from "../../ui/input/InputEpisode"
import { InputTitle } from "../../ui/input/InputTitle"
import { InputYear } from "../../ui/input/InputYear"

import { LblRequired } from "../../../../ui/label/LblRequired"
import { SearchGenres } from "../../../../ui/search/SearchGenres"

import "./style/form_title.sass"

const typeList = [
	{ value: "tv", label: "тв сериал" },
	{ value: "ova", label: "ova" },
	{ value: "ona", label: "ona" },
	{ value: "film", label: "фильм" },
	{ value: "special", label: "спешл" },
]

const seasonList = [
	{ value: "winter", label: "зима" },
	{ value: "spring", label: "весна" },
	{ value: "summer", label: "лето" },
	{ value: "autumn", label: "осень" },
]

const statusList = [
	{ value: "ongoing", label: "онгоинг" },
	{ value: "completed", label: "вышел" },
]

const ageRestrictList = [
	{ value: "g", label: "0+" },
	{ value: "pg", label: "6+" },
	{ value: "pg_13", label: "12+" },
	{ value: "nc_17", label: "16+" },
	{ value: "r", label: "18+" },
]
export const FormTitle = ({
	handleSubmit,
	errors,
	register,
	control,
	id,
	isRequiredFields = true,
}) => {
	return (
		<form className="form-title" id={id} onSubmit={handleSubmit}>
			<div>
				<div className="form-title__container">
					<h3>
						<Clipboard />
						<span>Основная информация</span>
					</h3>
					<ul className="form-title__list">
						<li className="form-title__item">
							<LblRequired
								htmlFor={"form-title-title"}
								isRequired={isRequiredFields}
							>
								Название
							</LblRequired>
							<InputTitle
								id={"form-title-title"}
								register={register}
								param={"title"}
								errorMsg={errors?.title?.message}
								required={isRequiredFields}
							/>
						</li>
						<li className="form-title__item">
							<LblRequired
								htmlFor={"form-title-sub-title"}
								isRequired={false}
							>
								Название (оригинальное)
							</LblRequired>
							<InputTitle
								id={"form-title-sub-title"}
								register={register}
								param={"sub_title"}
								errorMsg={errors?.sub_title?.message}
							/>
						</li>
						<li className="form-title__item">
							<LblRequired
								htmlFor={"form-title-alias"}
								isRequired={false}
							>
								Alias (url)
							</LblRequired>
							<InputAlias
								id={"form-title-alias"}
								register={register}
								errorMsg={errors?.alias?.message}
								placeholder=""
							/>
						</li>
						<li className="form-title__item">
							<LblRequired
								htmlFor={"form-title-desc"}
								isRequired={isRequiredFields}
							>
								Описание
							</LblRequired>
							<TextareaValidate
								id={"form-title-desc"}
								register={register}
								param={"description"}
								errorMsg={errors?.description?.message}
								countLineBreak={8}
								required={isRequiredFields}
							/>
						</li>
						<li className="form-title__item">
							<LblRequired isRequired={isRequiredFields}>
								Жанры
							</LblRequired>
							<SearchGenres
								control={control}
								required={isRequiredFields}
								placeholder={""}
							/>
						</li>
						<li
							className="form-title__item"
							style={{ display: "flex", gap: 20 }}
						>
							<div style={{ flex: 1 }}>
								<LblRequired
									htmlFor={"form-title-year"}
									isRequired={isRequiredFields}
								>
									Год
								</LblRequired>
								<InputYear
									id={"form-title-year"}
									register={register}
									errorMsg={errors?.year?.message}
									required={isRequiredFields}
								/>
							</div>
							<div style={{ flex: 1 }}>
								<LblRequired
									htmlFor={"form-title-episode"}
									isRequired={isRequiredFields}
								>
									Количество эпизодов
								</LblRequired>
								<InputEpisode
									id={"form-title-episode"}
									register={register}
									param={"total_episode"}
									errorMsg={errors?.total_episode?.message}
									required={isRequiredFields}
								/>
							</div>
						</li>
						<li
							className="form-title__item"
							style={{
								display: "flex",
								justifyContent: "space-between",
								gap: 20,
							}}
						>
							<div className="form-title__column">
								<div className="form-title__item">
									<LblRequired isRequired={isRequiredFields}>
										Статус
									</LblRequired>
									<ValidSelect
										options={statusList}
										control={control}
										name={"status"}
										placeholder={""}
										required={isRequiredFields}
									/>
								</div>
								<div className="form-title__item">
									<LblRequired isRequired={isRequiredFields}>
										Сезон
									</LblRequired>
									<ValidSelect
										options={seasonList}
										control={control}
										name={"season"}
										placeholder={""}
										required={isRequiredFields}
									/>
								</div>
							</div>
							<div className="form-title__column">
								<div className="form-title__item">
									<LblRequired isRequired={isRequiredFields}>
										Возрастной рейтинг
									</LblRequired>
									<ValidSelect
										options={ageRestrictList}
										control={control}
										name={"age_restrict"}
										placeholder={""}
										required={isRequiredFields}
									/>
								</div>
								<div className="form-title__item">
									<LblRequired isRequired={isRequiredFields}>
										Тип
									</LblRequired>
									<ValidSelect
										options={typeList}
										control={control}
										name={"type"}
										placeholder={""}
										required={isRequiredFields}
									/>
								</div>
							</div>
						</li>
						<li
							className="form-title__item"
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "end",
								gap: 10,
								marginRight: 15,
							}}
						>
							<InputCheckbox
								id={"root-title-is_origin"}
								register={register}
								required={isRequiredFields}
								param={"is_origin"}
							/>
							<LblRequired isRequired={isRequiredFields}>
								Оригинал
							</LblRequired>
						</li>
					</ul>
				</div>
			</div>
		</form>
	)
}
