import { memo, useRef, useState } from "react"

import { SearchGenres } from "../../../../ui/search/SearchGenres"
import { FilterTitle } from "./../../../../components/filter/FilterTitle"
import { FilterTitleRange } from "./../../../../components/filter/FilterTitleRange"
import { BtnDefault } from "../../../../ui/btn/BtnDefault"

import "./style.sass"


export const ReleaseFilter = memo(({
    isShowFilter, isLoading, request,
    setResponse, genres, setGenres
}) => {
    const formRef = useRef()
    const [filterData, setFilterData] = useState({
        "year": [],
        "type": [],
        "season": [],
        "status": [],
        "age_restrict": []
    })

    const filterTypeList = ["ТВ сериал", "OVA", "ONA", "Фильм", "Спешл"]
    const filterStatusList = ["Онгоинг", "Вышел"]
    const filterSeasonList = ["Зима", "Весна", "Лето", "Осень"]
    const filterAgeList = ["0+", "6+", "12+", "16+", "18+"]

    const resetFormData = async () => {
        if ((Object.values(filterData).some(arr => arr.length > 0) || (genres.length !== 0))){
            setFilterData({
                "year": [],
                "type": [],
                "season": [],
                "status": [],
                "age_restrict": []
            })
            setGenres([])
            formRef.current.reset()
            await request("/anime/release/")
        }
    }

    return(
        <aside className={isShowFilter ? "filter-release" : "filter-release filter-release_active"} >
            <form 
                className="release-filter__form" 
                id="release-form-id"
                ref={formRef}
                onSubmit={ 
                    async (e) => {
                        e.preventDefault()
                        if ((Object.values(filterData).some(arr => arr.length > 0)) || (genres.length !== 0)){
                            setResponse({"items": [], "page": 1,"pages": 1})
                                await request("/anime/release/filter-title",
                                    {"data": JSON.stringify({"genres": genres, ...filterData})}
                        )
                    }  
                }}
            >
                <div className="filter-release__item">
                    <h3>Жанры</h3>    
                    <SearchGenres
                        genres={genres}
                        setGenres={setGenres}
                        isSearchable={true}
                        isMulti={true}
                        placeholder={"Выберите жанр"}
                        noOptionsMessage={() => "Не удалось найти жанр"}
                    />
                </div>
                <div className="filter-release__item">
                    <h3>Тип</h3>
                    <FilterTitle 
                        filterList={filterTypeList} filterParams={filterData.type}
                        setFilterParams={setFilterData} keyFilter={"type"}
                    />
                </div>
                <div className="filter-release__item">
                    <h3>Статус выхода</h3>
                    <FilterTitle
                        filterList={filterStatusList} filterParams={filterData.status}
                        setFilterParams={setFilterData} keyFilter={"status"}
                    />
                </div>
                <div className="filter-release__item">
                    <h3>Сезоны</h3>
                    <FilterTitle 
                        filterList={filterSeasonList} filterParams={filterData.season}
                        setFilterParams={setFilterData} keyFilter={"season"}
                    />
                </div>
                <div className="filter-release__item">
                    <h3>Период выхода</h3>
                    <FilterTitleRange year={filterData.year} setYear={setFilterData}/>
                </div>
                <div className="filter-release__item">
                    <h3>Возрастной рейтинг</h3>
                    <FilterTitle 
                        filterList={filterAgeList} filterParams={filterData.age_restrict} 
                        setFilterParams={setFilterData} keyFilter={"age_restrict"}
                    />
                </div>
            </form>
            <div className="filter-release__btn">
                <BtnDefault 
                    type="submit"
                    form="release-form-id" 
                    disabled={isLoading}
                    data-apply={true}
                >
                    ✔ Применить
                </BtnDefault>
                <BtnDefault
                    data-reset-form={true}
                    callback={async () => await resetFormData()}
                >
                    ⛌ Сбросить
                </BtnDefault>
            </div>                                              
    </aside>
    )
})
