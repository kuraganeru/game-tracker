import React, { useState, useRef } from 'react';
import Select from 'react-select'

const FilterGame = (props) => {
    const [filterState, setFilterState] = useState({
        game_status: null,
        game_rating: "",
        year_completed: "",
        game_platform: ""
    })
    const [displayFiltersState, setDisplayFiltersState] = useState(false)

    // ref stuff
    const ref = useRef(filterState)

    const handleFilterState = (target, filter) => {
        ref.current = { ...filterState, [filter]: target } // keep ref = state
        setFilterState(prevState => ({
            ...prevState,
            [filter]: target
        }))
    }

    const handleFilter = async () => {
        // filter string to concatenate over
        let filterStr = ""
        let filterArr = []
        // loop over state object
        // if has key, add to string
        for (const [key, value] of Object.entries(ref.current)) {
            if (value) {
                filterArr = [...filterArr, value]
                if (filterStr.length === 0) {
                    filterStr += `${key}=${value}`
                } else {
                    filterStr += `&${key}=${value}`
                }
            }
        }
        console.log(filterStr)
        console.log(filterArr)

        const response = await fetch(`http://localhost:5000/games/filter?${filterStr}`)
        const responseData = await response.json()
        // props setgames
        // may need a new fn here
        // console.log(responseData)
        props.setGames(responseData)
        if (filterArr.length > 0) {
            setDisplayFiltersState(true)
        } else {
            setDisplayFiltersState(false)
        }
        console.log(ref)
    }

    const handleClearFilter = (target, filter) => {
        handleFilterState("", filter)
        handleFilter()
    }

    // Completion select
    const gameStatusOptions = [
        { value: 'Completed', label: "Completed" },
        { value: "Unfinished", label: "Unfinished" }
    ]

    const gameRatingOptions = [
        { value: '5', label: "5" },
        { value: "4", label: "4" },
        { value: '3', label: "3" },
        { value: '2', label: "2" },
        { value: '1', label: "1" }
    ]

    const gameYearOptions = [
        { value: '2022', label: "2022" },
        { value: '2021', label: "2021" },
        { value: '2020', label: "2020" },
        { value: '2019', label: "2019" },
        { value: '2018', label: "2018" },
        { value: '2017', label: "2017" },
        { value: '2016', label: "2016" },
        { value: '2015', label: "2015" }
    ]

    const gamePlatformOptions = props.platforms.map((plat, index) => {
        // console.log(plat)
        return { value: plat.platform, label: plat.platform }
    })

    const newSelectChange = (selectedOption, filter) => {
        ref.current = { ...filterState, [filter]: selectedOption.value }
        setFilterState(prevState => ({ ...prevState, [filter]: selectedOption.value }))
        // console.log(ref.current.game_status)
        handleFilter()
    }

    return (
        <div>
            <div className="d-flex mb-3">
                <div className="pe-3 col-md-3">
                    <Select options={gameStatusOptions} isClearable placeholder={"Game Status"} onChange={(selectedOption) => newSelectChange(selectedOption, "game_status")} value={gameStatusOptions.find(filter => filter.value === ref.current.game_status) || null} />
                </div>

                <div className="pe-3 col-md-3">
                    <Select options={gameRatingOptions} isClearable placeholder={"Game Rating"} onChange={(selectedOption) => newSelectChange(selectedOption, "game_rating")} value={gameRatingOptions.find(filter => filter.value === ref.current.game_rating) || null} />
                </div>

                <div className="pe-3 col-md-3">
                    <Select options={gameYearOptions} placeholder={"Year Completed"} onChange={(selectedOption) => newSelectChange(selectedOption, "year_completed")} value={gameYearOptions.find(filter => filter.value === ref.current.year_completed) || null} />
                </div>

                <div className="col-md-3">
                    <Select options={gamePlatformOptions} placeholder={"Platform"} onChange={(selectedOption) => newSelectChange(selectedOption, "game_platform")} value={gamePlatformOptions.find(filter => filter.value === ref.current.game_platform) || null} />
                </div>
                {/* <div className="pw-3 col-md-2">
                    <div className="d-grid">
                        <button onClick={handleFilter} className="btn btn-primary ">Filter</button>
                    </div>
                </div> */}
            </div>
            {displayFiltersState ?
                <div className="col-md-12 d-flex">
                    <h5 className="me-2">Filtering by:</h5>
                    <div>
                        {filterState.game_status ? <span role='button' className='badge bg-primary me-2' onClick={(e) => handleClearFilter(e.target.value, "game_status")}>{filterState.game_status}</span> : null}
                        {filterState.game_rating ? <span role='button' className='badge bg-primary me-2' onClick={(e) => handleClearFilter(e.target.value, "game_rating")}>{filterState.game_rating}</span> : null}
                        {filterState.year_completed ? <span role='button' className='badge bg-primary me-2' onClick={(e) => handleClearFilter(e.target.value, "year_completed")}>{filterState.year_completed}</span> : null}
                        {filterState.game_platform ? <span role='button' className='badge bg-primary' onClick={(e) => handleClearFilter(e.target.value, "game_platform")}>{filterState.game_platform}</span> : null}
                    </div>
                </div>

                : null
            }
        </div>
    )
}

export default FilterGame