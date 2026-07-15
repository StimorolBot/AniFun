import { Images } from "../../../../ui/icon/Images"

import { InputDragAndDrop } from "../../../../ui/input/InputDragAndDrop"

export const FormPosterAndBanner = ({ id, imgFile, setImgFile }) => {
	return (
		<form className="form-title" id={id}>
			<h3>
				<Images />
				<span>Медия</span>
			</h3>
			<ul
				className="form-title__list"
				style={{
					display: "flex",
					alignItems: "start",
					justifyContent: "space-between",
					gap: 20,
				}}
			>
				<li>
					<label
						className="form-title__input-lbl"
						htmlFor="form-title-poster"
						data-required={false}
					>
						Для тайтла
					</label>
					<InputDragAndDrop
						id={"form-title-poster"}
						payload={imgFile}
						setPayloadFile={setImgFile}
						paramName={"poster"}
						ratio={"2:3"}
					/>
				</li>
				<li>
					<label
						className="form-title__input-lbl"
						htmlFor="form-title-banner"
						data-required={false}
					>
						Для баннер
					</label>
					<InputDragAndDrop
						id={"form-title-banner"}
						payload={imgFile}
						setPayloadFile={setImgFile}
						paramName={"banner"}
						ratio={"21:9"}
					/>
				</li>
			</ul>
		</form>
	)
}
