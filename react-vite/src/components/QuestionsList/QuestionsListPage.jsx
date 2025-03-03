import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import { thunkLoadAllQuestionTitles, thunkLoadQuestionsWithContent } from "../../redux/question"
import parse from 'html-react-parser'
import "./QuestionsList.css"

function QuestionsListPage() {
    const question = useSelector(state => state.questions.question)
    const query = useSelector(state => state.query)
    const dispatch = useDispatch()
    const queryString = Object.values(query).join('').toLowerCase()


    useEffect(() => {
        dispatch(thunkLoadQuestionsWithContent())
    }, [dispatch])
    
    useEffect(() => {
        const loadTitles = async () => {
            await dispatch(thunkLoadAllQuestionTitles())
        }
        loadTitles()
    }, [dispatch])

    const filteredQuestion = question?.filter(question => 
        question.title.toLowerCase().includes(queryString)
    )


    
    return (
        <div className="questions_list_container">
            <h2>Search Results</h2>
            {filteredQuestion?.length > 0 ?
            filteredQuestion?.map(question => (
                <div className="questions_list_content_container" key={question.id}>
                    <h4><NavLink to={`/question/${question.id}`}>
                            {question.title}
                        </NavLink>
                    </h4>
                    <p>{parse(question.question_text)}</p>
                </div>
            ))
        :
            <p>No results found</p>
        }
        </div>
    )
}

export default QuestionsListPage