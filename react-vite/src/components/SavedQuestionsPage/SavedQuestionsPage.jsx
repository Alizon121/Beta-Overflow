import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { thunkLoadSavedQuestions } from "../../redux/savedQuestion";
import { thunkLoadQuestionsWithContent } from "../../redux/question";

function SavedQuestionsPage() {
    const user = useSelector(state => state?.session?.user)
    const savedQuestions = useSelector(state => state?.savedQuestions?.savedQuestions)
    const question = useSelector(state => state?.questions?.question)
    const [page, setPage] = useState(1)
    const [disabled, setDisabled] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(thunkLoadSavedQuestions(page))
        dispatch(thunkLoadQuestionsWithContent())
    }, [dispatch, page])

    useEffect(() => {
        const fetchData = async () => {        
            const response = await fetch(`/api/questions/${page+1}`)        
            if (response.status !== 404) {
                await dispatch(thunkLoadSavedQuestions(page));
            } else {
                setDisabled(true);
            }
        };
        fetchData();
    }, [dispatch, page]);

    const handleNextPage = () => {
        setPage(prevPage => prevPage + 1);
    };
    
    const handlePrevPage = () => {
        setPage(prevPage => Math.max(prevPage - 1, 1));
        setDisabled(false)
    };

    return (
        <div>
            <h2>{user.first_name}'s Saved Questions</h2>
            <div className="saved_questions_container">
                {/* We need to use the question ids to render the questions */}
                {/* We may need to create a new state variable to render all questions */}
                {savedQuestions?.map(savedQuestion => (
                    question?.filter(q => q.id === savedQuestion.question_id).map(filteredQuestion => (
                        <div key={filteredQuestion.id}>
                            {/* Add the save button icon here */}
                            <h3>{filteredQuestion.title}</h3>
                            <p>{filteredQuestion.question_text}</p>
                        </div>
                    ))
                ))}
            </div>
            <div className="pagination_controls">
                    <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
                    <button onClick={handleNextPage} disabled={disabled}>Next</button>
            </div>
        </div>
    )
}

export default SavedQuestionsPage;