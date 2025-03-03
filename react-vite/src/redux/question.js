import { json } from "react-router-dom"
import { csrfFetch } from "./csrf"

/*Actions */
const LOAD_ALL_QUESTIONS = "questions/loadAllQuestions"

const LOAD_USER_QUESTIONS = "questions/loadUserQuestions"

const LOAD_ALL_QUESTION_TITLES = "questions/loadAllQuestionTitles"

const LOAD_SELECTED_QUESTION = "questions/loadSelectedQuestions"

const LOAD_ALL_QUESTIONS_WITH_CONTENT = "questions/loadAllQuestionsWithContent"

const CREATE_QUESTION = "questions/createQuestion"

const ADD_ANSWER = "questions/addAnswer"

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

const addAnswer = (answer) => ({
    type: ADD_ANSWER,
    payload: answer
})

const loadUserQuestions = (question) => ({
    type: LOAD_USER_QUESTIONS,
    payload: question
})

const loadSelectedQuestions = (question) => ({
    type: LOAD_SELECTED_QUESTION,
    payload: question
})

const loadAllQuestionsWithContent = (question) => ({
    type: LOAD_ALL_QUESTIONS_WITH_CONTENT,
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
    const response = await fetch(`/api/questions/${page}`)
    if (response.ok) {
        const data = await response.json()
        dispatch(loadAllQuestions(data))
        return data
    } 
}

export const thunkLoadSelectionQuestion = (id) => async dispatch => {
    const response = await csrfFetch(`/api/questions/${id}/comments`, {
        method: "GET"
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(loadSelectedQuestions(data))
        return data
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

export const thunkLoadQuestionsWithContent = () => async dispatch => {
    const response = await csrfFetch('/api/questions/all')

    if (response.ok) {
        const data = await response.json()
        dispatch(loadAllQuestionsWithContent(data))
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

export const thunkAddAnswer = (id, answer) => async dispatch => {
    const response = await csrfFetch(`/api/questions/${id}/comments`, {
        method: "POST",
        body: JSON.stringify(answer)
    })

    if (response.ok) {
        const data = await response.json()
        console.log("DATATATAT", data)
        dispatch(addAnswer(data.comment))
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
        case LOAD_SELECTED_QUESTION: 
            return {
                ...action.payload
            }

        case LOAD_ALL_QUESTIONS_WITH_CONTENT:
            return {
                ...action.payload
            }
        case CREATE_QUESTION:
            return {
                ...state,
                allQuestions: state.allQuestions + 1,
                questions: [...state.questions, action.payload]
            }
            case ADD_ANSWER:
                const initialState = {
                    questions: {
                        comments: [],
                        userQuestion: {},
                        users:[]
                    }
                }
                return {
                    ...initialState.questions,
                    questions:{
                       ...initialState.questions,
                        comments: [...initialState.questions.comments, action.payload],
                        userQuestion: {...initialState.questions.userQuestion},
                        users: [...initialState.questions.users]
                    }
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