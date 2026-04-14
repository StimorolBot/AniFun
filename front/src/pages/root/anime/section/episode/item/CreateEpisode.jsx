import { memo, useRef, useState } from "react"

import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"

import { api } from "../../../../../../api"
import { rootAnimeEpisode } from "../../../../query_key"

import { InputTitle } from "../../../../ui/Input/InputTitle"
import { InputEpisode } from "../../../../ui/Input/InputEpisode"
import { InputDragAndDrop } from "../../../../../../ui/input/InputDragAndDrop"

import { CheckboxDefault } from "../../../../../../ui/input/CheckboxDefault"
import { BtnDefault } from "../../../../../../ui/btn/BtnDefault"
import { Loader } from "../../../../../../components/loader/Loader"

import { alertHandler } from "../../../../../../utils/utils"


export const CreateEpisode = memo(({isShowAlert, setUpdateAlert, setAlertData}) => {
    const formData = new FormData()
    const formDataRef = useRef()
    const [payloadFile, setPayloadFile] = useState()
    const [params, setParams] = useState()
    const {register, handleSubmit, formState: {errors, isValid}} = useForm({"mode": "onChange"})
    
    const {isFetching, refetch, error} = useQuery({
        queryKey: [rootAnimeEpisode.createEpisode],
        retry: 1,
        enabled: false,
        queryFn: async () => {
            formData.append("file", payloadFile.file)
            return api.post("/admin/anime/add-episode", formData,
                {
                    "params" : formDataRef.current,
                    "headers": {"Content-Type": "multipart/form-data"}
                }
            ).then(r => r)
        }
    })

    const onSubmit = async (data) => {
        formDataRef.current = {...data, ...params}
        const response = await refetch()
        
        await alertHandler(response, error, setAlertData, setUpdateAlert)
    }

    return(
        <form
            className="root-anime__item"
            id="root-anime-create-episode"
            onSubmit={handleSubmit(onSubmit)}    
        >
            <h2 className="root-anime__title">
                Добавить эпизод
            </h2>
            <InputTitle
                id={"root-episode-create"}
                placeholder="Название"
                required
                errorMsg={errors?.title?.message}
                register={register}
                param={"title"}
            />
            <div className="root-anime__row">
                <InputEpisode
                    id={"root-episode-title-create"}
                    param={"episode_number"}
                    placeholder={"Номер эпизода"}
                    required
                    errorMsg={errors?.total_episode?.message}
                    register={register}
                />
                <InputTitle
                    id={"root-episode-name-create"}
                    placeholder="Название эпизода"
                    required
                    errorMsg={errors?.episode_name?.message}
                    register={register}
                    param={"episode_name"}
                />
            </div>
            <CheckboxDefault
                id={"is_schedule_exist"}
                value={params?.is_schedule_exist || false}
                callback={() => setParams(s => ({...s, "is_schedule_exist": !s?.is_schedule_exist}))}
            >
                Привязать к расписанию
            </CheckboxDefault>
            <InputDragAndDrop
                id={"root-anime-add-video-episode"}
                setPayloadFile={setPayloadFile}
                paramName={"file"}
                required
                accept={"video/mp4"}
            />
            <div className="root-anime__btn-container">
                {isFetching
                    ? <Loader size={"small"}/>
                    : <BtnDefault
                        type="submit"
                        form="root-anime-create-episode"
                        disabled={!isValid || isShowAlert}
                    >
                        Добавить
                    </BtnDefault>
                }
            </div>
        </form>
    )
})
