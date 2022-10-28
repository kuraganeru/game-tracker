import React, { Fragment, useState } from "react"

import Button from "react-bootstrap/Button"
import Modal from 'react-bootstrap/Modal';

const AddGameForm = (props) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = (e, id, src) => {
        props.onFormSubmit(e, id, src)
        handleClose()
    }

    return (
        <Fragment>
            <>
                <Button variant="secondary" onClick={handleShow}>
                    Add to list
                </Button>

                <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
                    <Modal.Header closeButton>
                        <Modal.Title>Adding New Entry</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div key={props.game.cover.image_id} className="d-flex">
                            <div className="me-3">
                                <img src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${props.game.cover.image_id}.png`} alt={props.game.name} />
                            </div>
                            <form className="row">
                                <h4>{props.game.name}</h4>
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="statusInput" className="form-label">Completion</label>
                                    <select
                                        className="form-select"
                                        id="statusInput"
                                        defaultValue={"default"}
                                        onChange={e => props.updateData(props.game.cover.image_id, "game_status", e.target.value)}>
                                        <option value="default" disabled>Compeletion Status</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Unfinished">Unfinished</option>
                                    </select>
                                </div>

                                <div className="mb-3 col-md-6">
                                    <label htmlFor="ratingInput" className="form-label">Rating</label>
                                    <select
                                        className="form-select"
                                        id="ratingInput"
                                        defaultValue={"default"}
                                        onChange={e => props.updateData(props.game.cover.image_id, "game_rating", e.target.value)}>
                                        <option value="default" disabled>Rating</option>
                                        <option value="5">5</option>
                                        <option value="4">4</option>
                                        <option value="3">3</option>
                                        <option value="2">2</option>
                                        <option value="1">1</option>
                                        <option value="0">N/A</option>
                                    </select>
                                </div>

                                <div className="mb-3 col-md-6">
                                    <label htmlFor="yearInput" className="form-label">Year Completed</label>
                                    <select
                                        className="form-select"
                                        id="yearInput"
                                        defaultValue={"default"}
                                        onChange={e => props.updateData(props.game.cover.image_id, "year_completed", e.target.value)}>
                                        <option value="default" disabled>Year Completed</option>
                                        <option value="2022">2022</option>
                                        <option value="2021">2021</option>
                                        <option value="2020">2020</option>
                                        <option value="2019">2019</option>
                                        <option value="2018">2018</option>
                                        <option value="2017">2017</option>
                                        <option value="2016">2016</option>
                                        <option value="2015">2015</option>
                                        <option value="2015">N/A</option>
                                    </select>
                                </div>

                                <div className="mb-3 col-md-6">
                                    <label htmlFor="platformInput" className="form-label">Platform</label>
                                    <select
                                        className="form-select"
                                        id="platformInput"
                                        defaultValue={"default"}
                                        required
                                        onChange={e => props.updateData(props.game.cover.image_id, "game_platform", e.target.value)}>
                                        <option value="default" disabled>Platform</option>
                                        {props.game.platforms.map((platform) => {
                                            return (
                                                <option>{platform.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="reviewInput" className="form-label">Review</label>
                                    <textarea
                                        rows="5"
                                        className="form-control"
                                        id="reviewInput"
                                        value={props.game.game_review}
                                        placeholder="review"
                                        onChange={e => props.updateData(props.game.cover.image_id, "game_review", e.target.value)}
                                    >
                                    </textarea>
                                </div>
                                <Button variant="primary" onClick={e => handleSubmit(e, props.game.cover.image_id, `https://images.igdb.com/igdb/image/upload/t_cover_big/${props.game.cover.image_id}.png`)}>Add to list</Button>
                            </form>
                        </div>
                    </Modal.Body>
                    {/* <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={}>
                            Save Changes
                        </Button>
                    </Modal.Footer> */}
                </Modal>
            </>
        </Fragment>
    )
}

export default AddGameForm