import {
    POWDER_LIST_REQUEST, POWDER_LIST_SUCCESS, POWDER_LIST_FAIL,
    POWDER_CREATE_REQUEST, POWDER_CREATE_SUCCESS, POWDER_CREATE_FAIL, POWDER_CREATE_RESET,
    POWDER_DETAILS_REQUEST, POWDER_DETAILS_SUCCESS, POWDER_DETAILS_FAIL,
    POWDER_UPDATE_REQUEST, POWDER_UPDATE_SUCCESS, POWDER_UPDATE_FAIL, POWDER_UPDATE_RESET,
    POWDER_DELETE_REQUEST, POWDER_DELETE_SUCCESS, POWDER_DELETE_FAIL,
} from '../constants/powderConstants';

export const powderListReducer = (state = { powders: [] }, action) => {
    switch (action.type) {
        case POWDER_LIST_REQUEST:
            return { loading: true, powders: [] };

        case POWDER_LIST_SUCCESS:
            return { 
                loading: false, 
                powders: action.payload.powders || action.payload,
                page: action.payload.page || 1,
                pages: action.payload.pages || 1,
            };
        case POWDER_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const powderDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case POWDER_DELETE_REQUEST:
            return { loading: true }

        case POWDER_DELETE_SUCCESS:
            return { loading: false, success: true }

        case POWDER_DELETE_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const powderCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case POWDER_CREATE_REQUEST:
            return { loading: true }

        case POWDER_CREATE_SUCCESS:
            return { loading: false, success: true, powder: action.payload }

        case POWDER_CREATE_FAIL:
            return { loading: false, error: action.payload }

        case POWDER_CREATE_RESET:
            return {}

        default:
            return state
    }
}

export const powderDetailsReducer = (state = { powder: { } }, action) => {
    switch (action.type) {
        case POWDER_DETAILS_REQUEST:
            return { loading: true, ...state }

        case POWDER_DETAILS_SUCCESS:
            return { loading: false, powder: action.payload }

        case POWDER_DETAILS_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const powderUpdateReducer = (state = { powder: {} }, action) => {
    switch (action.type) {
        case POWDER_UPDATE_REQUEST:
            return { loading: true }

        case POWDER_UPDATE_SUCCESS:
            return { loading: false, success: true, powder: action.payload }

        case POWDER_UPDATE_FAIL:
            return { loading: false, error: action.payload }

        case POWDER_UPDATE_RESET:
            return { powder: {} }

        default:
            return state
    }
}