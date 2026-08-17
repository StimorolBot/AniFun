import { memo, useRef } from "react"

import { useForm } from "react-hook-form"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../api"
import { SkeletonSearch } from "./skeleton/SkeletonSearch"
import { useQuery } from "@tanstack/react-query"

import { Close } from "../../ui/icon/Close"
import { Search as SearchIcon } from "../../ui/icon/Search"

import { BtnDefault } from "../../ui/btn/BtnDefault"

import { InputSearch } from "../../ui/input/InputSearch"

import { SearchItem } from "./item/search_item/SearchItem"

import { useClickOutside } from "../../hook/useClickOutside"
import { useDebounce } from "../../hook/useDebounce"

import "./style/search.sass"

export const Search = memo(({ ref, isShowPopup, setIsShow, storageUrl }) => {
	const clickRef = useRef()
	const transitionRef = useRef()
	const {
		register,
		formState: { isValid },
		watch,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			title: null,
		},
	})

	const debounceSearchVal = useDebounce(watch("title"))

	const { data: searchData, isLoading } = useQuery({
		queryKey: ["search-title-data", debounceSearchVal],
		staleTime: 1000 * 60 * 3,
		enabled: !!(debounceSearchVal?.length >= 5 && isValid),
		queryFn: async () => {
			return await api
				.get("/titles/search", {
					params: { size: 20, page: 1, title: debounceSearchVal },
				})
				.then((r) => r.data)
		},
	})

	useClickOutside({
		refs: [clickRef],
		enabled: isShowPopup,
		handler: () => {
			setIsShow(false)
			document.body.classList.remove("scroll_block")
		},
	})

	const items = searchData?.items ?? []

	const searchContent =
		items.length > 0 ? (
			items.map((item) => (
				<SearchItem
					item={item}
					storageUrl={storageUrl}
					key={item.uuid}
				/>
			))
		) : debounceSearchVal?.length >= 5 ? (
			<li className="search-popup__not-found">
				<img
					src={`${storageUrl}/stickers/72b0282a20594165a6511c8fbd8c5dfd.png`}
					alt="Нет результата"
				/>
			</li>
		) : (
			<li className="search-popup__svg">
				<SearchIcon style={{ fill: "currentColor" }} />
				<p>Введите название релиза</p>
				<p>Результаты вашего поиска появятся здесь</p>
			</li>
		)

	return (
		<dialog className="search-popup transition" ref={ref}>
			<div className="search-popup__container" ref={clickRef}>
				<BtnDefault
					callback={() => {
						document.body.classList.remove("scroll_block")
						setIsShow(false)
					}}
				>
					<Close />
				</BtnDefault>
				<search>
					<form>
						<InputSearch
							id={"search-title-header"}
							register={register}
							autoComplete={"off"}
							placeholder={"Введите название аниме"}
						/>
					</form>
				</search>
				<SwitchTransition mode="out-in">
					<CSSTransition
						classNames="transition"
						key={isLoading}
						nodeRef={transitionRef}
						timeout={300}
					>
						{isLoading ? (
							<SkeletonSearch count={3} />
						) : (
							<ul
								className="search-popup__list transition"
								ref={transitionRef}
							>
								{searchContent}
							</ul>
						)}
					</CSSTransition>
				</SwitchTransition>
			</div>
			<div className="search-popup__footer">
				<p>
					Данное поисковое окно можно вызывать в любое время клавишей
					<code>/</code>
				</p>
				<p>
					Чтобы закрыть поиск, вы можете нажать
					<code>Esc</code>
				</p>
			</div>
		</dialog>
	)
})
