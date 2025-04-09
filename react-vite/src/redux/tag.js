import { csrfFetch } from "./csrf"


/************Action **************/

const LOAD_TAGS = "tags/loadTags"

const LOAD_QUESTION_TAGS = "tags/loadQuestionTags"

const CREATE_TAG = "tags/createTag"

/**********Action Creator **********/
const loadTags = (tag) => ({
    type: LOAD_TAGS,
    payload: tag
})

const loadQuestionTags = (tag) => ({
    type: LOAD_QUESTION_TAGS,
    payload: tag
})

const createTag = (tag) => ({
    type: CREATE_TAG,
    payload: tag
})

/*************Thunk Action **********/
export const thunkLoadTags = () => async dispatch => {
    const response = await csrfFetch("/api/tags/", {
            method: "GET"
        })

    if (response.ok) {
        const data = await response.json()
        dispatch(loadTags(data))
        return data
    }
}

export const thunkLoadQuestionTags = (id) => async dispatch => {
    const response = await csrfFetch(`/api/questions/${id}/tags`)
    if (response.ok) {
        const data = await response.json()
        dispatch(loadQuestionTags({questionId: id, tags: data.tags}))
        return data
    }
}

export const thunkCreateTag = (tag) => async dispatch => {
    const response = await csrfFetch(`/api/tags/`, {
        method: "POST",
        body: JSON.stringify(tag)
    })
    if (response.ok) {
        const data = await response.json()
        dispatch(createTag(data))
        return data
    }
}

/************** Reducer Function ***************/
function tagReducer(state = {tags:{}, tagsByQuestionId:{}}, action) {
    switch(action.type){
        case LOAD_TAGS:
            // const newState = {};
            // action.payload.allTags.forEach(tag => {
            //     newState[tag.id] = tag;
            // });
            // return {
            //     ...state,
            //     tags: newState
            // }
            const allTagsObj = {};
            if (!Array.isArray(action.payload.allTags)) return state;
            action.payload.allTags.forEach(tag => {
                allTagsObj[tag.id] = tag;
            });
            return {
                ...state,
                tags: allTagsObj
            };
        case LOAD_QUESTION_TAGS:
            const { questionId, tags } = action.payload;
            return {
                ...state,
                tagsByQuestionId: {
                    ...state.tagsByQuestionId,
                    [questionId]: tags
                }
            }
        case CREATE_TAG:
            const newTag = action.payload
            return {
                ...state,
                tags: {
                    ...state.tags,
                    [newTag.id]: newTag
                }
            }
        default:
            return state
    }
}

export default tagReducer;