import { memo, useRef } from "react"
import { useForm } from "react-hook-form"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { useQuery } from "@tanstack/react-query"

import { InputSearch } from "../../ui/input/InputSearch"

import { SearchItem } from "./item/search_item/SearchItem"

import { LoaderSkeletonSearch } from "./loader/LoaderSkeletonSearch"

import { useClickOutside } from "../../hook/useClickOutside"
import { useDebounce } from "../../hook/useDebounce"

import { api } from "../../api"

import "./style/search.sass"

export const Search = memo(({ ref, setIsShow }) => {
	const clickRef = useRef()
	const transitionRef = useRef()
	const {
		register,
		control,
		formState: { errors, isValid },
		watch,
		getValues,
		reset,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			title: null,
		},
	})

	const debounceSearchVal = useDebounce(watch("title"))

	const {
		data: searchData,
		isFetching,
		refetch,
	} = useQuery({
		queryKey: [
			"header-search-title-data",
			debounceSearchVal?.length > 5 && isValid ? debounceSearchVal : null,
		],
		staleTime: 1000 * 60 * 3,
		enabled: !!(debounceSearchVal?.length >= 5 && isValid),
		queryFn: async () => {
			return await api
				.get("/search-title", {
					params: { size: 20, page: 1, title: debounceSearchVal },
				})
				.then((r) => r.data)
		},
	})
	useClickOutside(clickRef, setIsShow, "", true, true)

	return (
		<dialog className="search-popup transition" ref={ref}>
			<div className="search-popup__container" ref={clickRef}>
				<button className="btn-close-popup">
					<svg>
						<use
							xlinkHref="/main.svg#close-svg"
							onClick={() => {
								document.body.classList.remove("scroll_block")
								setIsShow(false)
							}}
						/>
					</svg>
				</button>
				<search>
					<form action="/search-title" method="get">
						<InputSearch
							id={"search-title-header"}
							register={register}
							errorMsg={errors?.title?.message}
							autoComplete={"off"}
							placeholder={"Введите название аниме"}
						/>
					</form>
				</search>
				<SwitchTransition mode="out-in">
					<CSSTransition
						classNames="transition"
						key={isFetching}
						nodeRef={transitionRef}
						timeout={300}
					>
						{isFetching ? (
							<LoaderSkeletonSearch count={4} />
						) : (
							<ul className="search-popup__list transition">
								{searchData?.items ||
								(debounceSearchVal !== null &&
									debounceSearchVal?.length !== 0) ? (
									searchData?.items.length > 0 ? (
										searchData?.items?.map(
											(item, index) => {
												return (
													<SearchItem
														item={item}
														key={index}
													/>
												)
											},
										)
									) : (
										<li className="search-popup__not-found transition">
											<svg>
												<use xlinkHref="/public/svg/header.svg#not-find-svg" />
											</svg>
											<p>
												{`Не удалось найти тайтл с именем: ${debounceSearchVal}`}
											</p>
										</li>
									)
								) : (
									<li className="search-popup__svg">
										<svg>
											<use xlinkHref="/public/svg/header.svg#search-doc-svg" />
										</svg>
										<p>Введите название релиза</p>
										<p>
											Результаты вашего поиска появятся
											здесь
										</p>
									</li>
								)}
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
