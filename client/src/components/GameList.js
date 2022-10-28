import React from "react";
import EditGame from "./EditGame"
import Button from 'react-bootstrap/Button';

const GameList = (props) => {

    const handleDelete = async (id, gid) => {
        const deleteItem = await fetch(`http://localhost:5000/games/${id}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        const deleteResponse = await deleteItem.json()
        if (deleteResponse === "success") {
            props.updateGamesList()
        }
    }
    // generate array of length of rating - fill with true, true, false. true = filled star, false = empty star
    return (
        <ul className="list-group mt-2">
        {props.gamesData.map((value, index) => {
            return (
                <li key={value.game_id} className="list-group-item d-flex">
                    <div className="container-img me-3">
                        <img src={`https://images.igdb.com/igdb/image/upload/t_cover_small/${value.game_img}.png`} alt={value.title} className="img-fluid" />
                    </div>
                    <div>
                        <h5 className="mb-1">{value.title}</h5>
                        <span className={`badge bg-${value.game_status === "Completed" ? "primary" : "danger"} me-2 fw-normal`}>{value.game_status}</span>
                        <span className="badge bg-secondary me-2 fw-normal">{value.game_platform}</span>
                        {value.year_completed ? <span className="badge bg-secondary fw-normal">{value.year_completed}</span> : ""}
                        { value.game_status !== "Completed" ? null : <div>
                            {
                                Array.apply(null, Array(value.game_rating)).map((val, index) => {
                                    return (
                                        <span key={index}>★</span>
                                    )
                                })
                            }
                        </div>}
                        <div className="position-absolute bottom-0 end-0 mb-3 me-3">
                            <EditGame gameData={value} updateGamesList={props.updateGamesList} listView={props.listView} />
                            <Button className="ms-2" variant="danger" onClick={() => handleDelete(value.users_games_id)}>Delete</Button>
                        </div>
                        {/* <p>{value.game_review}</p> */}
                    </div>
                </li>
            )
        })}
    </ul>
    )
}

export default GameList;