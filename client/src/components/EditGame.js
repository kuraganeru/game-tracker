import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import "../customtest.css"

import Select from 'react-select'

function EditGame(props) {
    // console.log("EditGame:", props.gameData)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // game data states
    const [status, setStatus] = useState(props.gameData.game_status)
    const [rating, setRating] = useState(props.gameData.game_rating)
    const [year, setYear] = useState(props.gameData.year_completed)
    const [review, setReview] = useState(props.gameData.game_review)
    const [platform, setPlatform] = useState(props.gameData.game_platform)

    // clear old states on exit

    // save changes
    const handleEdit = async () => {
        const body = {
            game_status: status,
            game_rating: rating,
            game_review: review,
            game_platform: platform,
            year_completed: year
        }
        const response = await fetch(`http://localhost:5000/games/${props.gameData.users_games_id}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        const responseData = await response.json()
        if (responseData === "success") {
            props.updateGamesList()
            handleClose()
        }
    }

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

    const gamePlatformOptions = props.gameData.game_platforms_all.map((plat, index) => {
        return { value: plat.name, label: plat.name }
    })
    return (
        <>
            {props.listView ? <Button variant="secondary" onClick={handleShow} >
                Edit
            </Button> : <img src={`https://images.igdb.com/igdb/image/upload/t_cover_small/${props.gameData.game_img}.png`} alt={props.gameData.title} onClick={handleShow} role='button' />}



            <Modal show={show} onHide={handleClose} dialogClassName="modal-w">
                <Modal.Header closeButton>
                    <Modal.Title>Editing {props.gameData.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex">
                        <div className="me-3">
                            <img src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${props.gameData.game_img}.png`} alt={props.gameData.title} />
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <Select options={gameStatusOptions} placeholder={"Game Status"} onChange={(selected) => setStatus(selected.value)} value={{ label: status }} />
                            </div>

                            <div className="mb-3 col-md-6">
                                <Select options={gameRatingOptions} placeholder={"Game Rating"} onChange={(selected) => setRating(selected.value)} value={{ label: rating }} />
                            </div>

                            {status === "Completed" ? <div className="mb-3 col-md-6">
                                <Select options={gameYearOptions} placeholder={"Year Completed"} onChange={(selected) => setYear(selected.value)} value={{ label: year }} />

                            </div> : null}

                            <div className="mb-3 col-md-6">
                                <Select options={gamePlatformOptions} placeholder={"Platform"} onChange={(selected) => setPlatform(selected.value)} value={{ label: platform }} />
                            </div>

                            <div className="mb-3">
                                <textarea value={review} onChange={(e) => setReview(e.target.value)} className="form-control" rows="7">
                                </textarea>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditGame;