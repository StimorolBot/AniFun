import { memo, useRef, useState } from "react"

import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Add } from "../../../ui/icon/Add"
import { Search as SearchIcon } from "../../../ui/icon/Search"
import { Warning } from "../../../ui/icon/Warning"

import { InputRadio } from "../../../ui/input/InputRadio"
import { InputSearch } from "../../../ui/input/InputSearch"

import { AlertAPI } from "../../../ui/alert/AlertAPI"
import { DefaultPagination } from "../../../ui/pagination/DefaultPagination"
import { TitleSkeleton } from "../ui/skeleton/TitleSkeleton"

import { Confirm } from "../../../components/popup/Confirm"

import { TitleItem } from "./item/TitleItem"

import { useAutoFontSize } from "../../../hook/useAutoFontSize"
import { useDebounce } from "../../../hook/useDebounce"

import { api } from "../../../api"

import "./style/title.sass"

export const Title = memo(() => {
	const storageUrl = import.meta.env.VITE_STORAGE_URL
	const queryClient = useQueryClient()

	const popupRef = useRef()
	const transitionRef = useRef()
	const deleteData = useRef({ title: "", uuid: "" })

	const [response, setResponse] = useState({
		id: null,
		statusCode: null,
		details: "",
	})

	const [isShowPopup, setIsShowPopup] = useState(false)
	const [page, setPage] = useState(1)
	const [status, setStatus] = useState(null)

	const { register, watch } = useForm({
		mode: "onChange",
		defaultValues: {
			title: null,
		},
	})

	const debounceSearchVal = useDebounce(() => {
		const valueDebounce = watch("title")

		if (valueDebounce?.length >= 5) return valueDebounce
		else return null
	})

	const { data: titleData, isLoading } = useQuery({
		queryKey: ["root-title-data", page, debounceSearchVal, status],
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return await api
				.get(`anime/releases`, {
					params: {
						page: page,
						size: 20,
						title: debounceSearchVal || null,
						status_: status,
					},
				})
				.then((r) => r.data)
		},
	})

	const mutation = useMutation({
		mutationFn: async (uuid) =>
			await api.delete(`/admin/anime/titles/${uuid}`),
		onSuccess: (r) => {
			queryClient.invalidateQueries({
				queryKey: ["root-title-data", page],
			})
			setIsShowPopup(false)
			setResponse({
				id: crypto.randomUUID(),
				statusCode: r.status,
				details: r.data,
			})
		},
		onError: (e) => {
			setIsShowPopup(false)
			setResponse({
				id: crypto.randomUUID(),
				statusCode: e.status,
				details: e.response.data?.detail,
			})
		},
	})

	const titleRef = useAutoFontSize({
		minSize: 12,
		maxSize: 18,
		deps: [deleteData.current.title],
	})

	return (
		<div className="root">
			<div className="root-container">
				<header className="root__header">
					<div className="root__checkbox-container">
						<InputRadio
							id={"root-title-all"}
							callback={() => setStatus(null)}
							text={"Все"}
							name={"status"}
						/>
						<InputRadio
							id={"root-title-ongoing"}
							callback={() => setStatus("ongoing")}
							text={"Онгоинг"}
							name={"status"}
						/>
						<InputRadio
							id={"root-title-completed"}
							callback={() => setStatus("completed")}
							text={"Вышедшие"}
							name={"status"}
						/>
					</div>
					<search className="root__search-title">
						<InputSearch
							id={"root-search-title-header"}
							register={register}
							autoComplete={"off"}
							placeholder={"Введите название аниме"}
						/>
						<SearchIcon />
					</search>
					<Link className="root__header-link" to={"create"}>
						<Add />
						Создать тайтл
					</Link>
				</header>
				<div className="root__table">
					<div className="root__table-container">
						<table>
							<thead>
								<tr>
									<th>Постер</th>
									<th>Название</th>
									<th>Статус</th>
									<th>Эпизоды</th>
									<th>Год</th>
									<th>Сезон</th>
									<th>Рейтинг</th>
									<th>Действия</th>
								</tr>
							</thead>
							<SwitchTransition mode="out-in">
								<CSSTransition
									classNames="transition"
									key={isLoading}
									timeout={300}
									nodeRef={transitionRef}
								>
									<tbody ref={transitionRef}>
										{isLoading ? (
											<TitleSkeleton count={20} />
										) : (
											titleData?.items?.map(
												(item, index) => {
													return (
														<TitleItem
															item={item}
															storageUrl={
																storageUrl
															}
															callback={(
																title,
																uuid,
															) => {
																deleteData.current =
																	{
																		title: title,
																		uuid: uuid,
																	}
																setIsShowPopup(
																	true,
																)
															}}
															key={index}
														/>
													)
												},
											)
										)}
									</tbody>
								</CSSTransition>
							</SwitchTransition>
						</table>
						<CSSTransition
							classNames="transition"
							nodeRef={popupRef}
							in={isShowPopup}
							timeout={300}
							mountOnEnter
							unmountOnExit
						>
							<Confirm
								onConfirm={async () =>
									await mutation.mutate(
										deleteData.current.uuid,
									)
								}
								ref={popupRef}
								onClose={() => setIsShowPopup(false)}
							>
								<div>
									<div className="root-confirm__title">
										<Warning />
										Подтверждение удаления
									</div>
									<div className="root-confirm__body">
										<p>Вы уверены, что хотите удалить</p>
										<p
											className="root-title__msg"
											ref={titleRef}
										>
											&#34;
											{deleteData.current.title}
											&#34;
										</p>
										<p style={{ fontSize: 14 }}>
											Это действие нельзя будет отменить
										</p>
									</div>
								</div>
							</Confirm>
						</CSSTransition>
					</div>
					<DefaultPagination
						currentPage={titleData?.page}
						totalPage={titleData?.pages}
						setPage={setPage}
					/>
				</div>
				{isLoading === false && titleData?.items.length === 0 && (
					<div className="root-title__error">
						<img
							src={`${storageUrl}/stickers/72b0282a20594165a6511c8fbd8c5dfd.png`}
							alt="Нет результата"
						/>
					</div>
				)}
				<AlertAPI
					id={response.id}
					msg={response.details}
					statusCode={response.statusCode}
				/>
			</div>
		</div>
	)
})
