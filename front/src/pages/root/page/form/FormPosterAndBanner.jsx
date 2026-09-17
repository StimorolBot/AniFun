import { Images } from "../../../../ui/icon/Images"

import { InputDragAndDrop } from "../../../../ui/input/InputDragAndDrop"

import { LblRequired } from "../../../../ui/label/LblRequired"

export const FormPosterAndBanner = ({ id, imgFile, setImgFile, isLoading }) => {
	return (
		<div>
			<h3 className="form-root__header">
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
						Постер
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
						Баннер
					</LblRequired>
					<InputDragAndDrop
						id={"form-title-banner"}
						payload={imgFile}
						setPayloadFile={setImgFile}
						paramName={"banner"}
						ratio={"32:9"}
						isLoading={isLoading}
					/>
				</form>
			</div>
		</div>
	)
}
