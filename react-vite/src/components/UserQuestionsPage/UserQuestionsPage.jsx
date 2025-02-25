import { useState, useEffect } from "react"
import { thunkLoadUserQuestions } from "../../redux/question"
import { useDispatch, useSelector } from "react-redux"
import DeleteQuestionModal from "../DeleteQuestionModal"
import UpdateUserQuestionModal from "../UpdateUserQuestion/UpdateUserQuestionModal"
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem"

function UserQuestionsPage () {
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user)
    const userQuestions = useSelector(state =>state.questions.questions)
    const allUserQuestions = useSelector(state => state.questions.allUserQuestions)
    const [page, setPage] = useState(1)
    const [disabled, setDisabled] = useState(false)

    useEffect(()=> {
        dispatch(thunkLoadUserQuestions(page))
    }, [dispatch, page])

   useEffect(() => {
        if (userQuestions?.length < 3) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
   }, [userQuestions])

//    Helper function for re-rendering upon deletion
   const onDelete = (page) => {
        dispatch(thunkLoadUserQuestions(page))
   }

// Helper function for re-rendering on update
   const onUpdate = (page) => {
        dispatch(thunkLoadUserQuestions(page))
   }

    const handleNextPage = () => {
        setPage(prevPage => prevPage + 1);
    };
    
    const handlePrevPage = () => {
        setPage(prevPage => Math.max(prevPage - 1, 1));
    };

    return (
        <div>
            <h2>{user?.username}'s Questions</h2>
            <li>{allUserQuestions ?
                <p>{allUserQuestions} questions</p>    
                :
                <p>0 questions</p>
        }
        </li>
            {userQuestions?.length > 0 ?
            userQuestions?.map(question => 
                <div>
                    <div key={question.id}>
                        <h4>{question.title}</h4>
                        <p>{question.question_text}</p>
                    </div>
                    <div>
                        <button>
                            <OpenModalMenuItem
                                itemText={"Delete"}
                                modalComponent={<DeleteQuestionModal onDelete={()=> onDelete(page)} id={question.id}/>}
                            />
                        </button>
                        <button>
                            <OpenModalMenuItem
                                itemText={"Update"}
                                modalComponent={<UpdateUserQuestionModal onUpdate={() => onUpdate(page)} id={question.id}/>}
                            />
                        </button>
                    </div>
                </div>
             ):
                <div>
                    <p>There are currently no questions here!</p>
                </div>
             }
            <div className="pagination_controls">
                <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
                <button onClick={handleNextPage} disabled={disabled} >Next</button>
            </div>
        </div>
    )
}

export default UserQuestionsPage