import { useState, useEffect } from "react"
import { thunkLoadUserQuestions } from "../../redux/question"
import { useDispatch, useSelector } from "react-redux"
import DeleteQuestionModal from "../DeleteQuestionModal"
import UpdateUserQuestionModal from "../UpdateUserQuestion/UpdateUserQuestionModal"
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem"
import parse from 'html-react-parser'
import { csrfFetch } from "../../redux/csrf"
import "./UserQuestions.css"

function UserQuestionsPage () {
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user)
    const userQuestions = useSelector(state =>state.questions.userQuestions)
    const allUserQuestions = useSelector(state => state.questions.allUserQuestions)
    const [page, setPage] = useState(1)
    const [disabled, setDisabled] = useState(false)

    useEffect(()=> {
        dispatch(thunkLoadUserQuestions(page))
    }, [dispatch, page])


    // Make a useEffect hook to disable the next button
    useEffect(() => {
        const questionData = async () => {
            try{
                const res = await csrfFetch(`/api/questions/users/${page+1}`)
                // console.log("RERERE", res)
                if (res.status === 200) {
                    await dispatch(thunkLoadUserQuestions(page))
                } else {
                    setDisabled(true)
                }
            } catch(error) {
                console.error(error)
                setDisabled(true)
            }
        }
        questionData()
    }, [dispatch, page])

//    Helper function for re-rendering upon deletion
   const onDelete = (page) => {
        dispatch(thunkLoadUserQuestions(page))
   }

// Helper function for re-rendering on update
   const onUpdate = (page) => {
        dispatch(thunkLoadUserQuestions(page))
   }

   // Helper functions for handling navigating pages
    const handleNextPage = () => {
        setPage(prevPage => prevPage + 1);
    };
    
    const handlePrevPage = () => {
        setPage(prevPage => Math.max(prevPage - 1, 1));
    };

    return (
        <div className="user_questions_container">
            <h2>{user?.username}'s Questions</h2>
            <div className="user_questions_header">
                <div>{!allUserQuestions ?
                    <div>0 questions</div> 
                    :
                    allUserQuestions === 1 ?
                    <div>{allUserQuestions} question</div>    
                    :
                    <div>{allUserQuestions} questions</div>
                    }
                </div>
            </div>
            {userQuestions ? (
            userQuestions?.length > 0 ?
            userQuestions?.map(question => 
                <div className="user_questions_content_container">
                    <div key={question.id}>
                        <h4>{question.title}</h4>
                        <div>{parse(question.question_text)}</div>
                    </div>
                    <div className="user_question_button_containers">
                        <button id="user_question_update_button">
                            <OpenModalMenuItem
                                itemText={"Update"}
                                modalComponent={<UpdateUserQuestionModal onUpdate={() => onUpdate(page)} id={question.id}/>}
                            />
                        </button>
                        <button id="user_question_delete_button">
                            <OpenModalMenuItem
                                itemText={"Delete"}
                                modalComponent={<DeleteQuestionModal onDelete={()=> onDelete(page)} id={question.id}/>}
                            />
                        </button>
                    </div>
                </div>
             ): (
                <div>
                    <p>There are currently no questions here!</p>
                </div>
             )
            ): (
                <h4>There are currently no questions here!</h4>
            )
             }
            <div className="pagination_controls">
                <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
                <button onClick={handleNextPage} disabled={disabled} >Next</button>
            </div>
        </div>
    )
}

export default UserQuestionsPage