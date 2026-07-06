import { BtnDefault } from "../btn/BtnDefault"

import "./style/default_pagination.sass"

const getPages = (currentPage, totalPage, siblingCount = 2) => {
	const pages = []

	const left = Math.max(currentPage - siblingCount, 1)

	const right = Math.min(currentPage + siblingCount, totalPage)

	for (let i = 1; i <= totalPage; i++) {
		if (i === 1 || i === totalPage || (i >= left && i <= right)) {
			pages.push(i)
		} else {
			if (pages[pages.length - 1] !== "...") {
				pages.push("...")
			}
		}
	}

	return pages
}

export const DefaultPagination = ({ currentPage, totalPage, setPage }) => {
	const pages = getPages(currentPage, totalPage)
	return (
		<ul className="default-pagination__list">
			{pages.map((i, index) => {
				return (
					<li
						className={
							currentPage == i
								? "default-pagination__item default-pagination__item_active"
								: "default-pagination__item"
						}
						key={index}
					>
						<BtnDefault callback={() => setPage(i)} isStroke={true}>
							{i}
						</BtnDefault>
					</li>
				)
			})}
		</ul>
	)
}
