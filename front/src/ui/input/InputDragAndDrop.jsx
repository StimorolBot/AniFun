import { memo, useEffect, useRef, useState } from "react"

import { Loader } from "../../components/loader/Loader"

import "./style/input_drag_and_drop.sass"

export const InputDragAndDrop = memo(
	({
		id,
		setPayloadFile,
		paramName,
		ratio,
		payload,
		isLoading,
		accept = "image/webp, image/jpeg",
		typeFile = "image",
		...props
	}) => {
		const inputRef = useRef(null)
		const [isDragOver, setIsDragOver] = useState(false)
		const [previewUrl, setPreviewUrl] = useState("")
		const [isError, setIsError] = useState()

		const isPreviewImage = (file) => file?.type?.startsWith(typeFile)

		const syncFile = (file) => {
			if (!isPreviewImage(file)) {
				setIsError(true)
				return
			}

			setPayloadFile((prev) => ({
				...prev,
				[paramName]: file,
			}))
			setIsError(false)
		}

		const handleDrop = (e) => {
			e.preventDefault()
			setIsDragOver(false)

			const file = e.dataTransfer.files?.[0]
			if (file) syncFile(file)
		}

		const handleFileInput = (e) => {
			const file = e.target.files?.[0]
			if (file) syncFile(file)
		}

		useEffect(() => {
			const value = payload?.[paramName]

			if (value instanceof File) {
				const url = URL.createObjectURL(value)
				setPreviewUrl(url)

				return () => URL.revokeObjectURL(url)
			}

			if (typeof value === "string") {
				setPreviewUrl(value)
				return
			}

			setPreviewUrl("")
		}, [payload, paramName])

		return (
			<div
				className={`input-drag-and-drop__container ${isDragOver ? "is-drag-over" : ""}`}
				onDragEnter={(e) => {
					e.preventDefault()
					setIsDragOver(true)
				}}
				onDragOver={(e) => {
					e.preventDefault()
					setIsDragOver(true)
				}}
				onDragLeave={(e) => {
					e.preventDefault()
					setIsDragOver(false)
				}}
				onDrop={handleDrop}
			>
				<input
					ref={inputRef}
					className="input-drag-and-drop"
					id={id}
					type="file"
					accept={accept}
					onChange={handleFileInput}
					{...props}
				/>

				<label
					className="input-drag-and-drop__label"
					htmlFor={id}
					data-ratio={ratio}
				>
					{isLoading ? (
						<Loader />
					) : previewUrl ? (
						<img
							className="input-drag-and-drop__preview"
							src={previewUrl}
							alt="preview"
						/>
					) : (
						<>
							<span className="input-drag-and-drop__placeholder">
								+
							</span>
							<span className="input-drag-and-drop__title">
								Выберите файл
							</span>
							{typeFile == "image" ? (
								<span className="input-drag-and-drop__type-file">
									.webp, .jpg
								</span>
							) : (
								<span className="input-drag-and-drop__type-file">
									.mp4
								</span>
							)}
							{isError && (
								<span className="input-drag-and-drop__error">
									Неподдерживаемый тип файла
								</span>
							)}
						</>
					)}
				</label>
			</div>
		)
	},
)
