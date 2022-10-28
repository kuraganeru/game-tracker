import React, { Fragment, useEffect, useRef, useState } from "react";
import AddGameForm from "./AddGameForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faSearch, faXmark } from "@fortawesome/free-solid-svg-icons"

const AddGame = (props) => {
    const [searchValue, setSearchValue] = useState("");

    // For igdb API call for images
    const [fetchResults, setFetchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const timer = useRef();

    // Clear igdb API call states
    const clear = () => {
        setFetchResults([])
        setSearchValue("")
    }

    // handles API call when search state changes
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`http://localhost:5000/games/search/${searchValue}`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            })
            return await response.json();
        }

        if (searchValue.length === 0) { // stops request if searchbar is emptied
            clearTimeout(timer.current)
            setLoading(false);
            clear()
        } else if (searchValue && searchValue.length > 0) {
            clearTimeout(timer.current)
            setLoading(true);

            timer.current = setTimeout(() => {
                fetchData() // async returns a promise, so we use promise .then to read the result
                    .then(data => {
                        const formatData = data.map((val, index) => {
                            return ({
                                ...val,
                                game_status: "",
                                game_rating: "",
                                game_review: "",
                                game_platform: "",
                                year_completed: ""
                            })
                        })
                        setFetchResults(formatData)
                    })
                    .catch(() => alert("Error"))
                    .finally(() => setLoading(false))
            }, 2000)
        }
    }, [searchValue]) // checks if input has changed since last render; if changed, run the function

    // adds item into database
    const onFormSubmit = async (e, value, src) => {
        e.preventDefault()

        // filter through fetchresults array for correct item
        const gameToSubmit = fetchResults.filter(game => {
            return value === game.cover.image_id
        })

        // build object using updated state values and post
        try {
            const body = {
                title: gameToSubmit[0].name,
                game_status: gameToSubmit[0].game_status,
                game_rating: parseInt(gameToSubmit[0].game_rating, 10),
                game_review: gameToSubmit[0].game_review,
                // game_img: src,
                game_img: gameToSubmit[0].cover.image_id,
                game_platform: gameToSubmit[0].game_platform,
                game_platforms_all: JSON.stringify(gameToSubmit[0].platforms),
                year_completed: parseInt(gameToSubmit[0].year_completed, 10),
                game_igdb_id: gameToSubmit[0].id
            }
            const response = await fetch("http://localhost:5000/games", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            const postResponse = await response.json()
            if (postResponse === "success") {
                props.updateGamesList()
            } else {
                alert(postResponse)
            }
            // clear()
        } catch (error) {
            console.error(error.message)
        }
    }

    const updateData = (id, field, newValue) => {
        // onchange
        // loop through fetchresults array
        // find the item to be edited
        // if matches, update
        // return array
        // set to fetchresults
        const updateArray = fetchResults.map((fetchedValue, index) => {
            if (id === fetchedValue.cover.image_id) {
                return { ...fetchedValue, [field]: newValue }
            } else {
                return fetchedValue
            }
        })
        setFetchResults(updateArray)
    }

    const returnSearchIcon = () => {
        if (!loading && fetchResults.length === 0) {
            return (
                <span className="input-group-text bg-primary" id="basic-addon1">
                    <FontAwesomeIcon icon={faSearch} />
                </span>
            )
        } else if ((loading && searchValue.length > 0)) {
            return (
                <span className="input-group-text bg-primary" id="basic-addon1">
                    <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                </span>
            )
        } else if (!loading && fetchResults.length > 0) {
            return (
                <span className="input-group-text bg-danger" id="basic-addon1">
                    <FontAwesomeIcon icon={faXmark} onClick={clear} />
                </span>
            )
        }
    }

    return (
        <Fragment>
            <div className="input-group my-3">
                <input
                    type="text"
                    value={searchValue}
                    placeholder="Type to search"
                    onChange={e => { setSearchValue(e.target.value) }}
                    className="form-control"
                />
                <div className="input-group-append">
                    {returnSearchIcon()}
                </div>
            </div>

            {fetchResults.length > 0 ?
                <ul className="list-group mb-3">
                    {fetchResults.map((val, index) => {

                        return (
                            <li key={val.cover.image_id} className="list-group-item d-flex bg-light">
                                <div className="container-img me-3">
                                    <img src={`https://images.igdb.com/igdb/image/upload/t_thumb/${val.cover.image_id}.png`} alt={val.name} className="img-fluid" />
                                </div>
                                <div>
                                    <h5 className="mb-1">{val.name}</h5>
                                </div>
                                <div className="position-absolute bottom-0 end-0 mb-3 me-3">
                                    <AddGameForm updateData={updateData} onFormSubmit={onFormSubmit} game={val} />
                                </div>
                            </li>
                        )
                    })}
                </ul>
                : null}
        </Fragment>
    )
}

export default AddGame;