import { csrfFetch } from "./csrf"

/************************ Actions ****************************/ 
const LOAD_SAVED_QUESTIONS = "saved-questions/loadSavedQuestions"

const LOAD_ALL_SAVED_QUESTIONS = "saved-questions/loadAllSavedQuestions"

const ADD_SAVED_QUESTION = "saved-questions/addSavedQuestion"

const DELETE_SAVED_QUESTION = "saved-question/deleteSavedQuestion"
/**************************Action Creators ********************/
// Will load saved questions in a paginated format
const loadSavedQuestions = (savedQuestion) => ({
    type: LOAD_SAVED_QUESTIONS,
    payload: savedQuestion
})

// Will load all saved questions
const loadAllSavedQuestions = (savedQuestion) => ({
    type: LOAD_ALL_SAVED_QUESTIONS,
    payload: savedQuestion
})

const addSavedQuestion = (savedQuestion) => ({
    type: ADD_SAVED_QUESTION,
    payload: savedQuestion
})

const deleteSavedQuestion = (savedQuestion) => ({
    type: DELETE_SAVED_QUESTION,
    payload: savedQuestion
})

/**********************Thunk Actions ***************************/
export const thunkLoadSavedQuestions = (page) => async dispatch => {
    const response = await csrfFetch(`/api/saved-questions/${page}`)
    if (response.ok) {
        const data = await response.json()
        dispatch(loadSavedQuestions(data))
        return data
    }
}

// Load all saved questions
export const thunkLoadAllSavedQuestions = () => async dispatch => {
    const response = await csrfFetch(`/api/saved-questions/all`)

    if (response.ok) {
        const data = await response.json()
        dispatch(loadAllSavedQuestions(data))
        return data
    }
}

export const thunkAddSavedQuestion = (id) => async dispatch => {
    const response = await csrfFetch(`/api/saved-questions/${id}`, {
        method: "POST",
        body: JSON.stringify(id)
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(addSavedQuestion(data))
        return data
    }
}


export const thunkDeleteSavedQuestion = (id) => async dispatch => {
    const response = await csrfFetch(`/api/saved-questions/${id}`, {
        method: "DELETE"
    })

    if (response.ok) {
        dispatch(deleteSavedQuestion(id))
    }
}
/*************************** Reducer ****************************/
function savedQuestionReducer(state = {}, action) {
    switch(action.type) {
        case LOAD_SAVED_QUESTIONS:
            return{
                ...state,
                ...action.payload
            }
        case LOAD_ALL_SAVED_QUESTIONS:
            return {
                ...state,
                ...action.payload
            }
        case ADD_SAVED_QUESTION:
            return{
                ...state,
                ...action.payload
            }
        default:
            return state    
    }
}

export default savedQuestionReducer;