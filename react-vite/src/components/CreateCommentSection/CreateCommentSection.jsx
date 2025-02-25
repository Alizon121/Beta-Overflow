import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { thunkAddAnswer } from "../../redux/question"

function CreateCommentSection({onCreate, questionId}) {
    const dispatch = useDispatch()
    const [commentText, setCommentText] = useState("")
    const [errors, setErrors] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault()

        //  Add validations here
        const newErrors = {}
        if (commentText.length < 15) newErrors.commentText = "Comment must be a minimum of 15 characters"

        if (Object.values(newErrors).length > 0) {
            setErrors(newErrors)
        }

        const payload = {
            comment_text: commentText
        }

        try{
            await dispatch(thunkAddAnswer(questionId, payload))
            setCommentText("")
            onCreate()
        } catch(error) {
            console.error(error)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Your Answer</h2>
                <textarea
                    value={commentText}
                    onChange={(e)=> setCommentText(e.target.value)}
                ></textarea>
                {errors.commentText && <p className="error">{errors.commentText}</p>}
                <div>
                    <button type="submit">Post Answer</button>
                </div>
            </form>
        </div>
    )
}

export default CreateCommentSection