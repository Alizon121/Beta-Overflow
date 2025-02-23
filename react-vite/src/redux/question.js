import { json } from "react-router-dom"
import { csrfFetch } from "./csrf"

/*Actions */
const LOAD_ALL_QUESTIONS = "questions/loadAllQuestions"

const LOAD_USER_QUESTIONS = "questions/loadUserQuestions"

const LOAD_ALL_QUESTION_TITLES = "questions/loadAllQuestionTitles"

const CREATE_QUESTION = "questions/createQuestion"

const DELETE_QUESTION = "questions/deleteQuestion"

const UPDATE_QUESTION = "questions/updateQuestion"

/***********************Action Creators *********************/

const loadAllQuestions = (question) => ({
    type: LOAD_ALL_QUESTIONS,
    payload: question
})

const loadAllQuestionTitles = (title) => ({
    type: LOAD_ALL_QUESTION_TITLES,
    payload: title
})

const createQuestion = (question) => ({
    type: CREATE_QUESTION,
    payload: question
})

const loadUserQuestions = (question) => ({
    type: LOAD_USER_QUESTIONS,
    payload: question
})

const deleteQuestion = (question) => ({
    type: DELETE_QUESTION,
    payload: question
})

const updateQuestion = (question) => ({
    type: UPDATE_QUESTION,
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
    } else {
        console.log(response)
    }
}

export const thunkLoadAllQuestionTitles = () => async dispatch => {
    const response = await csrfFetch("/api/questions/title")

    if (response.ok) {
        const data = await response.json()
        dispatch(loadAllQuestionTitles(data))
    } else {
        console.error("Error")
    }
}

export const thunkLoadUserQuestions = (page) => async dispatch => {
    const response = await csrfFetch(`/api/questions/users/${page}`)

    if (response.ok) {
        const data = await response.json()
        dispatch(loadUserQuestions(data))
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


export const thunkDeleteQuestion = (id) => async dispatch => {
    const response = await csrfFetch(`/api/questions/${id}`, {
        method:"DELETE"
    })

    if (response.ok) {
        // const data = await response.json()
        dispatch(deleteQuestion(id))
    }
}

export const updateQuestionThunk = (id, updatedQuestion) => async dispatch => {
    const response = await csrfFetch(`/api/questions/${id}`, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updatedQuestion)
    })

    if (response.ok) {
        dispatch(updateQuestion(id))
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
        case LOAD_ALL_QUESTION_TITLES:
            return {
                ...state,
               ...action.payload
            }
        case CREATE_QUESTION:
            return {
                ...state,
                allQuestions: state.allQuestions + 1,
                questions: [...state.questions, action.payload]
            }
        case DELETE_QUESTION:
            return {
                ...state,
                allUserQuestions: state.allUserQuestions -1,
                questions: state?.questions?.filter(question => question.id !== action.payload)
            }
        case UPDATE_QUESTION:
            return {
                ...state,
                questions: [...state.questions]
            }
        default:
            return state
    }
}

export default questionReducer