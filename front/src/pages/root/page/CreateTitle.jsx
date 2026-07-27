import { useState } from "react"

import { useForm } from "react-hook-form"
import Masonry from "react-masonry-css"

import { useMutation } from "@tanstack/react-query"

import { AlertAPI } from "../../../ui/alert/AlertAPI"

import { api } from "../../../api"
import { FormPosterAndBanner } from "./form/FormPosterAndBanner"
import { FormTitle } from "./form/FormTitle"
import { HeaderForm } from "./header/HeaderForm"

const breakpoints = {
	default: 2,
	750: 1,
}

export const CreateTitle = () => {
	const [response, setResponse] = useState({})
	const [imgFile, setImgFile] = useState()
	const formData = new FormData()

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			alias: null,
			sub_title: null,
		},
	})

	const createPosterMutation = useMutation({
		mutationFn: async (uuid) => {
			formData.append("poster", imgFile.poster)
			await api.post(`/admin/anime/titles/${uuid}/poster`, formData)
		},
	})

	const createBannerMutation = useMutation({
		mutationFn: async (uuid) => {
			formData.append("banner", imgFile.banner)
			await api.post(`/admin/anime/titles/${uuid}/banners`, formData)
		},
	})

	const createTitleMutation = useMutation({
		mutationFn: async (data) => {
			const response = await api.post("/admin/anime/titles", data)
			const uuid = response.data.uuid

			const tasks = []

			if (imgFile.poster) {
				tasks.push(createPosterMutation.mutateAsync(uuid))
			}

			if (imgFile.banner) {
				tasks.push(createBannerMutation.mutateAsync(uuid))
			}

			await Promise.all(tasks)

			return response
		},
		onSuccess: (r) => {
			setResponse({
				id: crypto.randomUUID(),
				statusCode: r.status,
			})
		},
		onError: (e) => {
			setResponse({
				id: crypto.randomUUID(),
				statusCode: e.status,
				details: e.response.data?.detail,
			})
		},
	})

	const mutations = [
		createTitleMutation,
		createPosterMutation,
		createBannerMutation,
	]

	const isPending = mutations.some((m) => m.isPending)

	const onSubmit = (data) => {
		if (data.sub_title === "") data.sub_title = null
		else if (data.alias === "") data.alias = null
		createTitleMutation.mutate(data)
	}

	return (
		<div className="root">
			<div className="root-container">
				<HeaderForm
					nameForm={"root-create-title-form"}
					isPending={isPending}
					resetCallback={() => {
						setImgFile()
						reset()
					}}
				/>
				<Masonry
					breakpointCols={breakpoints}
					className="masonry"
					columnClassName="masonry__column-root"
				>
					<FormTitle
						id={"root-create-title-form"}
						handleSubmit={handleSubmit(onSubmit)}
						errors={errors}
						register={register}
						control={control}
					/>
					<FormPosterAndBanner
						id={"root-create-poster-form"}
						imgFile={imgFile}
						setImgFile={setImgFile}
					/>
				</Masonry>
				<AlertAPI
					id={response.id}
					msg={response.details}
					statusCode={response.statusCode}
				/>
			</div>
		</div>
	)
}
