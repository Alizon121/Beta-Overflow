import { useModal } from "../../context/Modal"
import { thunkDeleteQuestion } from "../../redux/question"
import { useDispatch } from "react-redux"
import "./DeleteQuestion.css"


function DeleteQuestionModal({onDelete, id}) {
const {closeModal} = useModal()
const dispatch = useDispatch()

// Add helper function to handle deletion
const handleDelete = async (e) => {
    e.preventDefault()
    await dispatch(thunkDeleteQuestion(id))
    onDelete()
    closeModal()
}

    return (
        <div className="delete_question_modal_container">
            <div className="delete_question_headers">
                <h2>Delete Question?</h2>
                <p>Question cannot be recovered once deleted</p>
            </div>
            <div className="delete_question_modal_buttons_container">
                <button id="delete_question_delete_button" onClick={handleDelete}>Delete</button>
                <button onClick={closeModal}>Cancel</button>
            </div>
        </div>
    )
}

export default DeleteQuestionModal