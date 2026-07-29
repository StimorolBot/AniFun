import { Images } from "../../../../ui/icon/Images"

import { InputDragAndDrop } from "../../../../ui/input/InputDragAndDrop"

import { LblRequired } from "../../../../ui/label/LblRequired"

export const FormPosterAndBanner = ({ id, imgFile, setImgFile, isLoading }) => {
	return (
		<div>
			<h3 className="form-title__header">
				<Images />
				<span>Медия</span>
			</h3>
			<div
				className="form-title__list"
				style={{
					display: "flex",
					alignItems: "start",
					justifyContent: "space-between",
					gap: 20,
				}}
			>
				<form className="form-title" id={id}>
					<LblRequired htmlFor="form-title-poster">
						Для тайтла
					</LblRequired>
					<InputDragAndDrop
						id={"form-title-poster"}
						payload={imgFile}
						setPayloadFile={setImgFile}
						paramName={"poster"}
						ratio={"2:3"}
						isLoading={isLoading}
					/>
				</form>
				<form>
					<LblRequired htmlFor="form-title-banner">
						Для баннер
					</LblRequired>
					<InputDragAndDrop
						id={"form-title-banner"}
						payload={imgFile}
						setPayloadFile={setImgFile}
						paramName={"banner"}
						ratio={"21:9"}
						isLoading={isLoading}
					/>
				</form>
			</div>
		</div>
	)
}
