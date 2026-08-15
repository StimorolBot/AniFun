import { memo, useEffect, useRef, useState } from "react"

import { CSSTransition, SwitchTransition } from "react-transition-group"

import { move } from "@dnd-kit/helpers"
import { DragDropProvider } from "@dnd-kit/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Save } from "../../../ui/icon/Save"
import { Warning } from "../../../ui/icon/Warning"

import { BtnDefault } from "../../../ui/btn/BtnDefault"

import { InputRadio } from "../../../ui/input/InputRadio"

import { AlertAPI } from "../../../ui/alert/AlertAPI"
import { DefaultPagination } from "../../../ui/pagination/DefaultPagination"
import { BannerSkeleton } from "../ui/skeleton/BannerSkeleton"

import { Confirm } from "../../../components/popup/Confirm"

import { BannerItem } from "./item/BannerItem"

import { useAutoFontSize } from "../../../hook/useAutoFontSize"

import { api } from "../../../api"

import "./style/banner.sass"

export const Banner = memo(() => {
	const queryClient = useQueryClient()
	const storageUrl = import.meta.env.VITE_STORAGE_URL

	const popupRef = useRef()
	const transitionRef = useRef()
	const deleteData = useRef({ title: "", bannerUUID: "", titleUUID: "" })

	const [isShowPopup, setIsShowPopup] = useState(false)
	const [response, setResponse] = useState()

	const [page, setPage] = useState(1)
	const [status, setStatus] = useState("all")
	const [bannerList, setBannerList] = useState([])

	const { data: bannerData, isLoading } = useQuery({
		queryKey: ["root-banner-data", page, status],
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return await api
				.get("/admin/anime/banners", {
					params: {
						page: page,
						size: 20,
						status_: status,
					},
				})
				.then((r) => r.data)
		},
	})

	const payload = bannerList.filter((item) => item.isChange === true)

	const deleteMutation = useMutation({
		mutationFn: async () =>
			await api.delete(
				`/admin/anime/titles/${deleteData.current.titleUUID}/banners/${deleteData.current.bannerUUID}`,
			),
		onSuccess: (r) => {
			queryClient.invalidateQueries({
				queryKey: ["root-banner-data", page, status],
			})
			setIsShowPopup(false)
			setResponse({
				id: crypto.randomUUID(),
				statusCode: r.status,
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
		maxSize: 26,
		deps: [deleteData.current.title],
	})

	const editBannerMutation = useMutation({
		mutationFn: async () => {
			return await api.patch("/admin/anime/titles/banners", payload)
		},
		onSuccess: (r) => {
			queryClient.setQueryData(
				["root-banner-data", page, status],
				(oldData) => {
					if (!oldData) return oldData

					return {
						...oldData,
						items: bannerList.map((item) => ({
							...item,
							isChange: false,
						})),
					}
				},
			)
			setResponse({
				id: crypto.randomUUID(),
				statusCode: r.status,
			})
		},
	})
	useEffect(() => {
		if (bannerData?.items) {
			setBannerList(bannerData.items)
		}
	}, [bannerData])

	return (
		<div className="root">
			<div className="root-container">
				<header className="root__header">
					<div className="root__checkbox-container">
						<InputRadio
							id={"root-banner-all"}
							callback={() => setStatus("all")}
							text={"Все"}
							name={"status_"}
							defaultChecked
						/>
						<InputRadio
							id={"root-banner-active"}
							callback={() => setStatus("active")}
							text={"Активные"}
							name={"status_"}
						/>
						<InputRadio
							id={"root-banner-inactive"}
							callback={() => setStatus("inactive")}
							text={"Неактивные"}
							name={"status_"}
						/>
					</div>
					<div
						className={
							payload.length
								? "root-header__btn root-header__btn_active"
								: "root-header__btn"
						}
					>
						<BtnDefault
							form="root-edit-banner"
							type={"button"}
							callback={async () =>
								await editBannerMutation.mutateAsync()
							}
						>
							<Save style={{ marginRight: 10, stroke: "none" }} />
							Сохранить
						</BtnDefault>
					</div>
				</header>
				<SwitchTransition mode="out-in">
					<CSSTransition
						classNames="transition"
						key={isLoading}
						timeout={300}
						nodeRef={transitionRef}
					>
						<div ref={transitionRef}>
							{isLoading ? (
								<BannerSkeleton count={6} />
							) : (
								<DragDropProvider
									onDragEnd={(event) => {
										if (event.canceled) return

										setBannerList((items) => {
											const newItems = move(items, event)

											return newItems.map(
												(item, index) => {
													const position = index + 1

													return {
														...item,
														position,
														isChange:
															item.banner_uuid !==
															bannerData?.items[
																index
															]?.banner_uuid,
													}
												},
											)
										})
									}}
								>
									<form id="root-edit-banner">
										<ul className="root-banner__list">
											{bannerList?.map((item, index) => {
												return (
													<BannerItem
														item={item}
														id={item.banner_uuid}
														index={index}
														storageUrl={storageUrl}
														callback={(
															bannerUuid,
															title,
															titleUUID,
														) => {
															setIsShowPopup(true)

															deleteData.current.title =
																title
															deleteData.current.bannerUUID =
																bannerUuid
															deleteData.current.titleUUID =
																titleUUID
														}}
														bannerData={
															bannerData?.items
														}
														setBannerList={
															setBannerList
														}
														key={item.banner_uuid}
													/>
												)
											})}
										</ul>
									</form>
								</DragDropProvider>
							)}
						</div>
					</CSSTransition>
				</SwitchTransition>
				<DefaultPagination
					currentPage={bannerData?.page}
					totalPage={bannerData?.pages}
					setPage={setPage}
				/>
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
							await deleteMutation.mutateAsync()
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
								<p>Вы уверены, что хотите удалить баннер</p>
								<p className="root-confirm__msg" ref={titleRef}>
									&#34;
									{deleteData.current.title}
									&#34;
								</p>
								<p style={{ fontSize: 16 }}>
									Это действие нельзя будет отменить
								</p>
							</div>
						</>
					</Confirm>
				</CSSTransition>
				<AlertAPI
					id={response?.id}
					msg={response?.details}
					statusCode={response?.statusCode}
				/>
				{isLoading === false && bannerData?.items.length === 0 && (
					<div className="root-title__error">
						<img
							src={`${storageUrl}/stickers/72b0282a20594165a6511c8fbd8c5dfd.png`}
							alt="Нет результата"
						/>
					</div>
				)}
			</div>
		</div>
	)
})
