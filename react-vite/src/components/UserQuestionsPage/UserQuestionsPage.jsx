import { useEffect } from "react"
import { thunkLoadUserQuestions } from "../../redux/question"
import { useDispatch, useSelector } from "react-redux"

function UserQuestionsPage () {
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user)
    const userQuestions = useSelector(state =>state.questions.questions)

    useEffect(()=> {
        dispatch(thunkLoadUserQuestions(user.id))
    }, [dispatch])


    console.log(userQuestions)

    return (
        <div>
            {userQuestions?.map(question => 
                <div key={question.id}>
                    <h4>{question.title}</h4>
                    <p>{question.question_text}</p>
                </div>

            )}
        </div>
    )
}

export default UserQuestionsPage