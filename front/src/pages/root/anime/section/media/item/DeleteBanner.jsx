import { memo, useRef, useState } from "react"

import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"

import { api } from "../../../../../../api"

import { InputTitle } from "../../../../ui/Input/InputTitle"
import { BtnDefault } from "../../../../../../ui/btn/BtnDefault"
import { Loader } from "../../../../../../components/loader/Loader"
import { alertHandler } from "../../../../../../utils/utils"


export const DeleteBanner = memo(({isShowAlert, setUpdateAlert, setAlertData}) => {
    const formDataRef = useRef()
    const {register, handleSubmit, formState: {errors, isValid}} = useForm({"mode": "onChange"})
    
    const {isFetching, refetch, error} = useQuery({
        queryKey: ["rootAnimePoster.update"],
        retry: 1,
        enabled: false,
        queryFn: async () => {
            return api.delete("/admin/anime/delete-banner", {"params" : formDataRef.current}).then(r => r)
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
            id="root-anime-delete-banner"
            onSubmit={handleSubmit(onSubmit)}
        >
            <h2 className="root-anime__title">
                Удалить баннер
            </h2>
            <InputTitle
                id={"root-banner-delete"}
                placeholder="Название"
                required
                errorMsg={errors?.title?.message}
                register={register}
                param={"title"}
            />
            <div className="root-anime__btn-container">
                {isFetching
                    ? <Loader size={"small"}/>
                    : <BtnDefault
                        type="submit"
                        form="root-anime-delete-banner"
                        disabled={!isValid || isShowAlert}
                    >
                        Удалить
                    </BtnDefault>
                }
            </div>
        </form>
    )
})
