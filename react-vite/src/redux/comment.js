import { csrfFetch } from "./csrf"

/************** Actions ***************/ 
const LOAD_USER_COMMENTS = "comments/loadUserComments"

const DELETE_COMMENT = "comments/deleteComment"

const UPDATE_COMMENT = "comments/updateComment"

/*************** Action Creators ******************/

const loadUserQuestions = (comment) => ({
    type: LOAD_USER_COMMENTS,
    payload: comment
})

const deleteComment = (comment) => ({
    type: DELETE_COMMENT,
    payload: comment
})

const updateComment = (comment) => ({
    type: UPDATE_COMMENT,
    payload: comment
})

/******************* Thunk Actions ****************/

export const thunkLoadUserComments= (page) => async dispatch => {
    const response = await csrfFetch(`/api/comments/${page}`)

    if (response.ok) {
        const data = await response.json()
        dispatch(loadUserQuestions(data))
        return data
    }
}

export const thunkDeleteComment = (id) => async dispatch => {
    const response = await csrfFetch(`/api/comments/${id}`, {
        method: "DELETE"
    })

    if (response.ok) {
        dispatch(deleteComment(id))
    }
}

export const thunkUpdateComment = (id, updatedComment) => async dispatch => {
    const response = await csrfFetch(`/api/comments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedComment)
    })

    if (response.ok) {
        dispatch(updateComment(id))
    }
}

/******************* Reducer *************************/

function commentReducer(state = {}, action) {
    switch(action.type) {
        case LOAD_USER_COMMENTS:
            return {
                ...state,
                ...action.payload
            }
        case DELETE_COMMENT:
            return {
                ...state,
                comments: state?.comments?.filter(comment => comment.id !== action.payload)
            }
        case UPDATE_COMMENT:
            return {
                ...state,
                comments: [...state.comments]
            }

                default:
            return state
    }
}

export default commentReducer