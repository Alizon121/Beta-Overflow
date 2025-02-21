import { json } from "react-router-dom"
import { csrfFetch } from "./csrf"

/*Actions */
const LOAD_ALL_QUESTIONS = "questions/loadAllQuestions"

const CREATE_QUESTION = "questions/createQuestion"

const LOAD_USER_QUESTIONS = "questions/loadUserQuestions"

/***********************Action Creators *********************/

const loadAllQuestions = (question) => ({
    type: LOAD_ALL_QUESTIONS,
    payload: question
})

const createQuestion = (question) => ({
    type: CREATE_QUESTION,
    payload: question
})

const loadUserQuestions = (question) => ({
    type: LOAD_USER_QUESTIONS,
    payload: question
})

/**************************Thunk Actions *******************/ 

export const thunkLoadAllQuestions = (page) => async dispatch => {
    if (!page) page=1
    const response = await fetch(`/api/questions/${page}`)
    if (response.ok) {
        const data = await response.json()
        dispatch(loadAllQuestions(data))
        return data
    }
}

export const thunkCreateQuestion = (question) => async dispatch => {
    const response = await csrfFetch("/api/questions/", {
        method: 'POST',
        body: JSON.stringify(question)
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(createQuestion(data))
    }
}

export const thunkLoadUserQuestions = (page) => async dispatch => {
    const response = await csrfFetch(`/api/questions/users/${page}`)

    if (response.ok) {
        const data = await response.json()
        dispatch(loadUserQuestions(data))
    }
}


/******************Reducer *********************************/

function questionReducer(state = {}, action) {
    switch(action.type) {
        case LOAD_ALL_QUESTIONS:
            return {
                ...state,
                ...action.payload
            }
        case LOAD_USER_QUESTIONS:
            return {
                ...action.payload
            }
        case CREATE_QUESTION:
            return {
                ...state,
                allQuestions: state.allQuestions + 1,
                questions: [...state.questions, action.payload]
            }
        
        default:
            return state
    }
}

export default questionReducer