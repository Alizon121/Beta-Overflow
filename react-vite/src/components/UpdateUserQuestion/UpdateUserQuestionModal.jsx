import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateQuestionThunk } from "../../redux/question"
import { useModal } from "../../context/Modal"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css';
import "./UpdateUserQuestion.css"

function UpdateUserQuestionModal ({onUpdate, id}) {
    // We want to render the original title and question, and be able to update these inputs.
    const dispatch = useDispatch()
    const questions = useSelector(state => state.questions.userQuestions)
    const question = questions.find(question => question.id === id)
    const [title, setTitle] = useState(question.title)
    const [userQuestion , setUserQuestion] = useState(question.question_text)
    const [errors, setErrors] = useState({})
    const {closeModal} = useModal()

    const handleUpdate = async (e) => {
        e.preventDefault()

        const newErrors = {}
        // Set validations here
        if (title.length < 5) newErrors.title = "Title must be at least 5 characters long"
        if (title.length > 50) newErrors.title = "Title must be less than 50 characters"
        if (userQuestion.length < 25) newErrors.question = "Question must be at least 25 characters long"

        if (Object.values(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        const payload = {
            title,
            question_text: userQuestion
        }

        try{
            await dispatch(updateQuestionThunk(id, payload))
            onUpdate()
            closeModal()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div key={id} className="update_user_question_container">
            <form onSubmit={handleUpdate}>
                <div className="update_user_question_content_container">
                    <h2>Update Question</h2>
                            {errors.title && <p className="error">{errors.title}</p>}
                            {errors.question && <p className="error">{errors.question}</p>}
                        <div className="update_user_question_title_container">
                            <label>Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="update_user_question_question_container">
                            <label>Question</label>
                            <ReactQuill
                                theme="snow"
                                value={userQuestion}
                                onChange={setUserQuestion}
                            />
                        </div>
                </div>
                <div className="update_user_question_buttons_container">
                    <button type="submit" id="update_user_question_submit">Submit</button>
                    <button id="update_user_question_cancel" type="button" onClick={closeModal}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateUserQuestionModal