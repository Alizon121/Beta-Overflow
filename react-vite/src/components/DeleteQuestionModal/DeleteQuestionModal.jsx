import { useModal } from "../../context/Modal"
import { thunkDeleteQuestion } from "../../redux/question"
import { useDispatch } from "react-redux"


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
        <div>
            <h2>Delete Question</h2>
            <p>Question cannot be recovered once deleted</p>
            <div>
                <button onClick={handleDelete}>Delete</button>
                <button onClick={closeModal}>Cancel</button>
            </div>
        </div>
    )
}

export default DeleteQuestionModal