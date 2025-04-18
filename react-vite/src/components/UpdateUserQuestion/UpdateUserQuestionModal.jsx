import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateQuestionThunk } from "../../redux/question"
import { thunkLoadTags, thunkLoadQuestionTags } from "../../redux/tag"
import { useModal } from "../../context/Modal"
import ReactQuill from "react-quill"
import Select from "react-select"
import 'react-quill/dist/quill.snow.css';
import "./UpdateUserQuestion.css"

function UpdateUserQuestionModal ({onUpdate, id}) {
    // We want to render the original title and question, and be able to update these inputs.
    const dispatch = useDispatch()
    const questions = useSelector(state => state?.questions?.userQuestions)
    const question = questions.find(question => question.id === id)
    
    const tagsById = useSelector(state => state?.tags?.tagsByQuestionId)
    const tags = useSelector(state => Object.values(state.tags.tags))
    const tagOptions = tags.map(tag => ({ value: tag.id, label: tag.tag_name }));
    const [userQuestionTags, setUserQuestionTags] = useState(() =>{
        if (!tagsById || !tagsById?.[question.id]) return []

        return tagsById[question.id].map(tag => ({
            value: tag.id,
            label: tag.tag_name
        }))
    });
    
    
    const [title, setTitle] = useState(question.title)
    const [userQuestion , setUserQuestion] = useState(question.question_text)
    const [errors, setErrors] = useState({})
    const {closeModal} = useModal()

    // // Hook for dispatching all tags
    useEffect(() => {
        dispatch(thunkLoadTags())
    }, [dispatch])

    // The useEffect for dispatching the thunkByQuestionId variable
    useEffect(() => {
        if (question?.length > 0) {
                dispatch(thunkLoadQuestionTags(Number(question.id)))
        }
    }, [question, dispatch])

    // WE NEED TO CREATE LOGIC IN THE UPDATE A QUESTION HANDLER
    // WE NEED TO REFACTOR THE HANDLEUPDATE FUNCTION
    // WE NEED TO MAKE SURE THE LIST IS SHOWING!

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
            question_text: userQuestion,
            tags: userQuestionTags?.map(tag => tag.value)
        }

        try{
            await dispatch(updateQuestionThunk(id, payload))
            onUpdate()
            closeModal()
        } catch (error) {
            console.error(error)
        }
    }

    // Styles for the Select dropdown menu
    const customStyles = {
        menuList: (provided) => ({
          ...provided,
          maxHeight: '200px',
          overflowY: 'auto',
        }),
      };

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
                        <div className="create_question_select_tags">
                        <h3>Select Tags</h3>
                        <Select
                            isMulti
                            options={tagOptions}
                            value={userQuestionTags}
                            onChange={setUserQuestionTags}
                            menuPlacement="bottom"
                            styles={customStyles}
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