import { useModal } from "../../context/Modal";
import { thunkCreateTag } from "../../redux/tag";
import { useDispatch } from "react-redux";
import { useState } from "react";
import "./AddTag.css"

function AddTagModal({onAddTag}) {
    const {closeModal} = useModal()
    const [tag, setTag] = useState()
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()

    // Make handleSubmit function
    const handleSubmit = async (e) => {
    e.preventDefault()

        const newErrors = {}
        // Add Validations
        if (tag.length < 3) newErrors.tag = "Tag must be at least three characters long"
        
        if (Object.values(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }
        // Declare payload
        const payload = {
            name:tag
        }

        try {
            await dispatch(thunkCreateTag(payload))
            setErrors({})
            onAddTag()
            closeModal()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="add_tag_modal_container">
            <form className="add_tag_form_content" onSubmit={handleSubmit}>
                <h3>Add a Tag</h3>
                {errors.tag && <p className="error">{errors.tag}</p>}
                <div>
                    <input
                    type="text"
                    placeholder="Tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    />
                </div>
                <div className="add_tag_modal_buttons_container">
                    <button id="add_tag_modal_submit_button" type="submit">Submit</button>
                    <button id="add_tag_modal_cancel_button" type="button" onClick={closeModal}>Cancel</button>
                </div>
            </form>             
        </div>
    )
}

export default AddTagModal;