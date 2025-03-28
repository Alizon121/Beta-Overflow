import { HiDotsVertical } from "react-icons/hi";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { thunkDeleteSavedQuestion } from "../../redux/savedQuestion";
import "./SavedQuestionMenu.css"
// import { useSelector } from "react-redux";


function SavedQuestionMenu({id, onDelete}) {
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const dispatch = useDispatch()

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu)
    }

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        }

        document.addEventListener("click", closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, [setShowMenu]);

    // const closeMenu = () => setShowMenu(false);

    // Make a function for removing the savedQuestion
    const removedSavedQuestion = async () => {
        await dispatch(thunkDeleteSavedQuestion(id))
        onDelete()
    }

    return (
        <div className="saved_question_menu_container">
            <button id="saved_question_dropdown_button" onClick={toggleMenu}>
                <HiDotsVertical/>
            </button>
            {showMenu && (
                <ul className={"saved_question_dropdown"} ref={ulRef}>
                    <li>
                        <button onClick={removedSavedQuestion}>Unsave</button>
                    </li>
                </ul>
            )}
        </div>
    )
}

export default SavedQuestionMenu