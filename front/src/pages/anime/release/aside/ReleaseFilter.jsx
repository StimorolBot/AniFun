import { memo, useRef } from "react"

import { SearchGenres } from "../../../../ui/search/SearchGenres"
import { FilterTitle } from "./../../../../components/filter/FilterTitle"
import { FilterTitleRange } from "./../../../../components/filter/FilterTitleRange"
import { BtnDefault } from "../../../../ui/btn/BtnDefault"

import "./style.sass"


export const ReleaseFilter = memo(({
    isShowFilter, isLoading, 
    filterData, setFilterData, 
    genres, setGenres, 
    refetch
}) => {
    const formRef = useRef()

    const resetFilterData = () => {
        setGenres([])
        setFilterData(s => {
            const newState = {...s}
            Object.keys(newState).forEach(key => newState[key] = [])
            return newState
        })
        formRef.current.reset()
    }

    const refetchQuery = (e) => {
        e.preventDefault()
        refetch()
    }

    return(
        <aside className={isShowFilter ? "filter-release filter-release_active" : "filter-release"}>
            <div className="filter-release__inner">
                <form className="release-filter__form" id="release-form-id" ref={formRef} onSubmit={e => refetchQuery(e)}>
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
                            filterList={["тв сериал", "ova", "ona", "фильм", "спешл"]} filterParams={filterData.type}
                            setFilterParams={setFilterData} keyFilter={"type"}
                        />
                    </div>
                    <div className="filter-release__item">
                        <h3>Статус выхода</h3>
                        <FilterTitle
                            filterList={["онгоинг", "вышел"]} filterParams={filterData.status}
                            setFilterParams={setFilterData} keyFilter={"status"}
                        />
                    </div>
                    <div className="filter-release__item">
                        <h3>Сезоны</h3>
                        <FilterTitle 
                            filterList={["зима", "весна", "лето", "осень"]} filterParams={filterData.season}
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
                            filterList={["0+", "6+", "12+", "16+", "18+"]} filterParams={filterData.age_restrict} 
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
                        callback={() => resetFilterData()}
                    >
                        ⛌ Сбросить
                    </BtnDefault>
                </div>
            </div>
        </aside>
    )
})
