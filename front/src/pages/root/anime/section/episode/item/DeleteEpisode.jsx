import { memo, useRef } from "react"

import { api } from "../../../../../../api"
import { rootAnimeEpisode } from "../../../../query_key"

import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"

import { InputTitle } from "../../../../ui/Input/InputTitle"
import { InputEpisode } from "../../../../ui/Input/InputEpisode"
import { BtnDefault } from "../../../../../../ui/btn/BtnDefault"
import { Loader } from "../../../../../../components/loader/Loader"
import { alertHandler } from "../../../../../../utils/utils"


export const DeleteEpisode = memo(({isShowAlert, setUpdateAlert, setAlertData}) => {
    const formDataRef = useRef()
    const {register, handleSubmit, formState: {errors, isValid}} = useForm({"mode": "onChange"})
        
    const {isFetching, refetch, error} = useQuery({
        queryKey: [rootAnimeEpisode.deleteEpisode],
        retry: 1,
        enabled: false,
        queryFn: async () => {
            return api.delete("/admin/anime/delete-episode", {"params" : formDataRef.current}).then(r => r)
        }
    })

    const onSubmit = async (data) => {
        formDataRef.current = data
        const response = await refetch()
        
        await alertHandler(response, error, setAlertData, setUpdateAlert)
    }

    return(
        <form
            className="root-anime__item"
            id="root-anime-delete-episode"
            onSubmit={handleSubmit(onSubmit)}
        >
            <h2 className="root-anime__title">
                Удалить эпизод
            </h2>
            <InputTitle
                id={"root-episode-delete"}
                placeholder="Название"
                required
                errorMsg={errors?.title?.message}
                register={register}
                param={"title"}
            />
            <InputEpisode
                id={"root-episode-count-delete"}
                required
                errorMsg={errors?.episode_number?.message}
                register={register}
                param={"episode_number"}
                placeholder={"Номер эпизода"}
            />
            <div className="root-anime__btn-container">
                {isFetching
                    ? <Loader size={"small"}/>
                    : <BtnDefault
                        type="submit"
                        form="root-anime-delete-episode"
                        disabled={!isValid || isShowAlert}
                    >
                        Удалить
                    </BtnDefault>
                }
            </div>
        </form>
    )
})
