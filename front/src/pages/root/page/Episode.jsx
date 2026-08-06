import { memo, useRef, useState } from "react"

import { Link } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Add } from "../../../ui/icon/Add"
import { Warning } from "../../../ui/icon/Warning"

import { InputRadio } from "../../../ui/input/InputRadio"

import { AlertAPI } from "../../../ui/alert/AlertAPI"
import { DefaultPagination } from "../../../ui/pagination/DefaultPagination"
import { EpisodeSkeleton } from "../ui/skeleton/EpisodeSkeleton"

import { Confirm } from "../../../components/popup/Confirm"

import { EpisodeItem } from "../../root/page/item/EpisodeItem"

import { useAutoFontSize } from "../../../hook/useAutoFontSize"

import { api } from "../../../api"

export const Episode = memo(() => {
	const queryClient = useQueryClient()

	const popupRef = useRef()
	const transitionRef = useRef(false)
	const deleteData = useRef({ name: "", episodeUUID: "", titleUUID: "" })

	const [sortByDate, setSortByDate] = useState()
	const [isShowPopup, setIsShowPopup] = useState(false)
	const [page, setPage] = useState()
	const [response, setResponse] = useState()

	const { data: episodeData, isLoading } = useQuery({
		queryKey: ["root-episode-data", page, sortByDate],
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return await api
				.get("admin/anime/episodes/", {
					params: {
						page: page,
						size: 20,
						sort_asc: sortByDate,
					},
				})
				.then((r) => r.data)
		},
	})

	const mutation = useMutation({
		mutationFn: async () => {
			await api.delete(
				`/admin/anime/titles/${deleteData.current.titleUUID}/episodes/${deleteData.current.episodeUUID}`,
			)
		},

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["root-episode-data", page, sortByDate],
			})
			setIsShowPopup(false)
			setResponse({
				id: crypto.randomUUID(),
				statusCode: 204,
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

	const nameRef = useAutoFontSize({
		minSize: 18,
		maxSize: 25,
		deps: [deleteData.current.name],
	})

	return (
		<div className="root">
			<div className="root-container">
				<header className="root__header">
					<div className="root__checkbox-container">
						<InputRadio
							id={"root-date-filter-desc"}
							callback={() => setSortByDate(false)}
							text={"Новые"}
							name={"date"}
							defaultChecked
						/>
						<InputRadio
							id={"root-date-filter-asc"}
							callback={() => setSortByDate(true)}
							text={"Старые"}
							name={"date"}
						/>
					</div>
					<Link className="root__header-link" to={"create"}>
						<Add />
						Добавить эпизод
					</Link>
				</header>
				<div className="root__table">
					<div className="root__table-container">
						<table>
							<thead>
								<tr>
									<th>Тайтл</th>
									<th>Название серии </th>
									<th>Номер эпизода</th>
									<th>Дата публикации</th>
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
											<EpisodeSkeleton count={20} />
										) : (
											episodeData?.items?.map(
												(item, index) => {
													return (
														<EpisodeItem
															item={item}
															callback={(
																name,
																episodeUUID,
																titleUUID,
															) => {
																deleteData.current =
																	{
																		name: name,
																		episodeUUID:
																			episodeUUID,
																		titleUUID:
																			titleUUID,
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
									await mutation.mutateAsync()
								}
								ref={popupRef}
								onClose={() => setIsShowPopup(false)}
							>
								<>
									<div className="root-confirm__action">
										<Warning />
										Подтверждение удаления
									</div>
									<div className="root-confirm__body">
										<p>Вы уверены, что хотите удалить</p>
										<p
											className="root-confirm__msg"
											ref={nameRef}
										>
											&#34;
											{deleteData.current.name}
											&#34;
										</p>
										<p style={{ fontSize: 16 }}>
											Это действие нельзя будет отменить
										</p>
									</div>
								</>
							</Confirm>
						</CSSTransition>
						<DefaultPagination
							currentPage={episodeData?.page}
							totalPage={episodeData?.pages}
							setPage={setPage}
						/>
					</div>
					<AlertAPI
						id={response?.id}
						msg={response?.details}
						statusCode={response?.statusCode}
					/>
				</div>
			</div>
		</div>
	)
})
