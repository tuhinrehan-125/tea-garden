import {
    SACK_LIST_REQUEST, SACK_LIST_SUCCESS, SACK_LIST_FAIL,
    SACK_CREATE_REQUEST, SACK_CREATE_SUCCESS, SACK_CREATE_FAIL, SACK_CREATE_RESET,
    SACK_DETAILS_REQUEST, SACK_DETAILS_SUCCESS, SACK_DETAILS_FAIL,
    SACK_UPDATE_REQUEST, SACK_UPDATE_SUCCESS, SACK_UPDATE_FAIL, SACK_UPDATE_RESET,
    SACK_DELETE_REQUEST, SACK_DELETE_SUCCESS, SACK_DELETE_FAIL,
} from '../constants/sackConstants';

export const sackListReducer = (state = { sacks: [] }, action) => {
    switch (action.type) {
        case SACK_LIST_REQUEST:
            return { loading: true, sacks: [] };

        case SACK_LIST_SUCCESS:
            return { 
                loading: false, 
                sacks: action.payload.sacks || action.payload,
                page: action.payload.page || 1,
                pages: action.payload.pages || 1,
            };
        case SACK_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const sackDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case SACK_DELETE_REQUEST:
            return { loading: true }

        case SACK_DELETE_SUCCESS:
            return { loading: false, success: true }

        case SACK_DELETE_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const sackCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case SACK_CREATE_REQUEST:
            return { loading: true }

        case SACK_CREATE_SUCCESS:
            return { loading: false, success: true, sack: action.payload }

        case SACK_CREATE_FAIL:
            return { loading: false, error: action.payload }

        case SACK_CREATE_RESET:
            return {}

        default:
            return state
    }
}

export const sackDetailsReducer = (state = { sack: { } }, action) => {
    switch (action.type) {
        case SACK_DETAILS_REQUEST:
            return { loading: true, ...state }

        case SACK_DETAILS_SUCCESS:
            return { loading: false, sack: action.payload }

        case SACK_DETAILS_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const sackUpdateReducer = (state = { sack: {} }, action) => {
    switch (action.type) {
        case SACK_UPDATE_REQUEST:
            return { loading: true }

        case SACK_UPDATE_SUCCESS:
            return { loading: false, success: true, sack: action.payload }

        case SACK_UPDATE_FAIL:
            return { loading: false, error: action.payload }

        case SACK_UPDATE_RESET:
            return { sack: {} }

        default:
            return state
    }
}