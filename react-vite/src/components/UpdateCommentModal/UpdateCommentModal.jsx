import { useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import { thunkUpdateComment } from "../../redux/comment"


function UpdateCommentModal({onUpdate, id}) {
    const comments = useSelector(state => state.comments.comments)
    const selectedComment = comments?.find(comment => comment.id === id )
    const [comment, setComment] = useState(selectedComment.comment_text)
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const {closeModal} = useModal()


    const handleSubmit = async (e) => {
        e.preventDefault()

        // Add validations
        const newErrors={}
        if (comment.length < 15) newErrors.comment = "Comment must be a minimum of 15 characters"

        if (Object.values(newErrors).length > 0) {
            setErrors(newErrors)
        }

        const payload = {
            comment_text: comment
        }

        await dispatch(thunkUpdateComment(id, payload))
        onUpdate()
        closeModal()
    }

    return (
        <div>
            <h2>Update Comment</h2>
            <textarea
                value={comment}
                onChange={(e)=> setComment(e.target.value)}
            ></textarea>
            <div>
                <button type="submit" onClick={handleSubmit}>Update</button>
                <button type="button" onClick={closeModal}>Cancel</button>
            </div>
        </div>
    )
}

export default UpdateCommentModal
