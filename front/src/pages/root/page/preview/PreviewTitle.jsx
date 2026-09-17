import { useEffect, useState } from "react"

import { useAutoFontSize } from "../../../../hook/useAutoFontSize"

import "./style.sass"

export const PreviewTitle = ({ storageUrl, watch, img }) => {
	const [previewUrl, setPreviewUrl] = useState("")

	const titleRef = useAutoFontSize({
		minSize: 14,
		maxSize: 20,
		deps: [watch("title")],
	})

	useEffect(() => {
		if (!img) return

		setPreviewUrl(URL.createObjectURL(img?.poster))
	}, [img])

	return (
		<div className="preview">
			<h3>Предпросмотр</h3>
			<div className="preview-container">
				<div className="preview__poster">
					<img
						src={
							previewUrl
								? previewUrl
								: `${storageUrl}/stickers/6093866d92af49f68292ba298b383eea.png`
						}
					/>
				</div>
				<div className="preview__desc-container">
					<div className="preview__desc-name">
						<h4 ref={titleRef}>
							{watch("title") || "Название тайтла"}
						</h4>
						<h5>{watch("sub_title") || "Оригинальное название"}</h5>
					</div>
					<p
						className="title__status"
						data-title-status={watch("status")}
					>
						{watch("status") || "Статус"}
					</p>
					<ul className="preview__desc-list">
						<li>{watch("type") || "Тип"}</li>
						<li>{watch("season") || "Сезон"}</li>
						<li>{watch("year") || "Год"}</li>
						<li>
							{watch("age_restrict") || "Возрастное ограничение"}
						</li>
					</ul>

					<p className="preview__description-text">
						{watch("description") || "Описание"}
					</p>
					<ul className="preview__desc-genres">
						{watch("genres")?.map((genre, index) => {
							return <li key={index}>{genre}</li>
						}) || "Жанры"}
					</ul>
				</div>
			</div>
		</div>
	)
}
