import { memo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"

import { api } from "../../../../../../api"
import { rootAnimeTitle } from "../../../../query_key"

import { CustomSelect } from "../../../../../../ui/input/CustomSelect"
import { InputTitle } from "../../../../ui/Input/InputTitle"
import { InputAlias } from "../../../../ui/Input/InputAlias"
import { InputYear } from "../../../../ui/Input/InputYear"
import { InputEpisode } from "../../../../ui/Input/InputEpisode"
import { TextareaValidate } from "../../../../../../ui/input/TextareaValidate"
import { SearchGenres } from "../../../../../../ui/search/SearchGenres"
import { CheckboxDefault } from "../../../../../../ui/input/CheckboxDefault"

import { BtnDefault } from "../../../../../../ui/btn/BtnDefault"

import { Loader } from "../../../../../../components/loader/Loader"
import { AlertResponse } from "../../../../../../ui/alert/AlertResponse"

import { alertHandler } from "../../../../../../utils/utils"


export const CreateTitle = memo(({typeList, seasonList, statusList, ageRestrictList}) => {    
    const [isShowAlert, setIsShowAlert] = useState(false)
    const [updateAlert, setUpdateAlert] = useState(0)
    const [alertData, setAlertData] = useState({
        "msg": undefined,
        "statusCode": undefined,
        "prefix": undefined,
    })

    const formDataRef = useRef()
    const [genres, setGenres] = useState()
    const [params, setParams] = useState()
    const {register, handleSubmit, formState: {errors, isValid}, watch, setValue} = useForm({
        "mode": "onChange",
        "defaultValues": {
            "title": "",
            "alias": "",
            "description": "",
            "year": null,
            "total_episode": null,
            "description": "",
        }
    })
    
    const {isFetching, refetch, error} = useQuery({
        queryKey: [rootAnimeTitle.create],
        retry: 1,
        enabled: false,
        queryFn: async () => {
            return api.post("/admin/anime/create-title", formDataRef.current).then(r => r)
        }
    })

    const onSubmit = async (data) => {
        if (data?.alias === "")
            data.alias = null
        
        formDataRef.current = {...genres, ...data, ...params}
        const response = await refetch()

        await alertHandler(response, error, setAlertData, setUpdateAlert)
    }

    return(
        <form
            className="root-anime__item" 
            id="root-anime-form-create-title"
            onSubmit={handleSubmit(onSubmit)}
        >
            <h2 className="root-anime__title">
                Создать тайтл
            </h2>
            <InputTitle
                id={"root-title-create"}
                placeholder="Название"
                required
                errorMsg={errors?.title?.message}
                register={register}
                param={"title"}
            />
            <InputAlias
                id={"root-alias-create"}
                errorMsg={errors?.alias?.message}
                register={register}  
            />
            <div className="root-anime__row">
                <InputYear 
                    id={"root-year-create"}
                    required
                    errorMsg={errors?.year?.message}
                    register={register}
                />
                <InputEpisode
                    id={"root-episode-count-create"}
                    required
                    errorMsg={errors?.total_episode?.message}
                    register={register}
                />            
            </div>
            <TextareaValidate
                id={"root-description-create"}
                placeholder="Описание"
                required
                countLineBreak={6}
                setValue={setValue}
                value={watch("description") || ""}
                errorMsg={errors?.description?.message}
                register={register}
                param={"description"}
            />
            <SearchGenres
                placeholder="Жанры"
                required
                genres={genres}
                setGenres={setGenres}
                noOptionsMessage={() => "Не удалось найти жанр"}
            />
            <div className="root-anime__row">
                <CustomSelect
                    options={typeList}
                    placeholder={"тип"}
                    required
                    paramName={"type"}
                    isSearchable={false}
                    value={params} 
                    setValue={setParams}
                />
                <CustomSelect
                    options={seasonList}
                    placeholder={"сезон"}
                    required
                    paramName={"season"}
                    isSearchable={false}
                    value={params} 
                    setValue={setParams}
                />
            </div>
            <div className="root-anime__row">
                <CustomSelect 
                    options={statusList} 
                    placeholder={"статус"}
                    required
                    paramName={"status"}
                    isSearchable={false}
                    value={params} 
                    setValue={setParams}
                />
                <CustomSelect
                    options={ageRestrictList} 
                    placeholder={"возрастное ограничение"}
                    required
                    paramName={"age_restrict"}
                    isSearchable={false}
                    value={params} 
                    setValue={setParams}
                />
            </div>
            <CheckboxDefault
                id={"root-create-is_origin"}
                value={params?.is_origin || false}
                callback={() => setParams(s => ({...s, "is_origin": !s?.is_origin}))}
            >
                Оригинальный тайтл
            </CheckboxDefault>
            <div className="root-anime__btn-container">
                {isFetching
                    ? <Loader size={"small"}/>
                    : <BtnDefault
                        type="submit"
                        form="root-anime-form-create-title"
                        disabled={!isValid || isShowAlert}
                    >
                        Создать
                    </BtnDefault>
                }
            </div>
            <AlertResponse
                msg={alertData.msg} 
                statusCode={alertData.statusCode} 
                update={updateAlert}
                prefix={alertData.prefix}
                isShowAlert={isShowAlert}
                setIsShowAlert={setIsShowAlert}
            />        
        </form>
    )
})
