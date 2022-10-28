import React from "react";
import EditGame from "./EditGame"
import Button from 'react-bootstrap/Button';

const GameListCollage = (props) => {

    const handleOpen = () => {

    }

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
        <div className="container d-flex flex-wrap justify-content-center">
            {props.gamesData.map((value, index) => {

                return (
                    <div className="p-1 position-relative" key={value.game_id}>
                        {/* <img src={`https://images.igdb.com/igdb/image/upload/t_cover_small/${value.game_img}.png`} alt={value.title} className="img-fluid border" onClick={() => props.setShow(true)} /> */}
                        <EditGame gameData={value} updateGamesList={props.updateGamesList} listView={props.listView}  />
                    </div>
                )

            })}
        </div>
    )
}

export default GameListCollage;