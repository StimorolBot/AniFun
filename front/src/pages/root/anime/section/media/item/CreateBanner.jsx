import { memo, useRef, useState } from "react"

import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"

import { api } from "../../../../../../api"
import { rootAnimeBanner } from "../../../../query_key"

import { InputTitle } from "../../../../ui/Input/InputTitle"
import { BtnDefault } from "../../../../../../ui/btn/BtnDefault"

import { Loader } from "../../../../../../components/loader/Loader"
import { InputDragAndDrop } from "../../../../../../ui/input/InputDragAndDrop"
import { alertHandler } from "../../../../../../utils/utils"


export const CreateBanner = memo(({isShowAlert, setUpdateAlert, setAlertData}) => {    
    const formData = new FormData()
    const [payloadFile, setPayloadFile] = useState()

    const formDataRef = useRef()
    const {register, handleSubmit, formState: {errors, isValid}} = useForm({"mode": "onChange"})

    const {isFetching, refetch, error} = useQuery({
        queryKey: [rootAnimeBanner.create],
        retry: 1,
        enabled: false,
        queryFn: async () => {
            formData.append("file", payloadFile.file)
            return api.post("/admin/anime/add-banner", formData,
                {
                    "params" : formDataRef.current,
                    "headers": {"Content-Type": "multipart/form-data"}
                }
            ).then(r => r)
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
            id="root-anime-add-banner"
            onSubmit={handleSubmit(onSubmit)}  
        >
            <h2 className="root-anime__title">
                Добавить баннер
            </h2>            
            <InputTitle
                id={"root-banner-create"}
                placeholder="Название"
                required
                errorMsg={errors?.title?.message}
                register={register}
                param={"title"}
            />
            <InputDragAndDrop
                id={"root-anime-add-banner-file"}
                setPayloadFile={setPayloadFile}
                paramName={"file"}
            />
            <div className="root-anime__btn-container">
                {isFetching
                    ? <Loader size={"small"}/>
                    : <BtnDefault
                        type="submit"
                        form="root-anime-add-banner"
                        disabled={!isValid || isShowAlert}
                    >
                        Добавить
                    </BtnDefault>
                }
            </div>
        </form>
    )
}) 
