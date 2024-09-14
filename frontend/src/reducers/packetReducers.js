import {
    PACKET_LIST_REQUEST, PACKET_LIST_SUCCESS, PACKET_LIST_FAIL,
    PACKET_CREATE_REQUEST, PACKET_CREATE_SUCCESS, PACKET_CREATE_FAIL, PACKET_CREATE_RESET,
    PACKET_DETAILS_REQUEST, PACKET_DETAILS_SUCCESS, PACKET_DETAILS_FAIL,
    PACKET_UPDATE_REQUEST, PACKET_UPDATE_SUCCESS, PACKET_UPDATE_FAIL, PACKET_UPDATE_RESET,
    PACKET_DELETE_REQUEST, PACKET_DELETE_SUCCESS, PACKET_DELETE_FAIL,
    PACKET_SEARCH_REQUEST, PACKET_SEARCH_SUCCESS, PACKET_SEARCH_FAIL,
} from '../constants/packetConstants';

export const packetListReducer = (state = { packets: [] }, action) => {
    switch (action.type) {
        case PACKET_LIST_REQUEST:
            return { loading: true, packets: [] };

        case PACKET_LIST_SUCCESS:
            return { 
                loading: false, 
                packets: action.payload.packets || action.payload,
                page: action.payload.page || 1,
                pages: action.payload.pages || 1,
            };
        case PACKET_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const packetDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case PACKET_DELETE_REQUEST:
            return { loading: true }

        case PACKET_DELETE_SUCCESS:
            return { loading: false, success: true }

        case PACKET_DELETE_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const packetCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case PACKET_CREATE_REQUEST:
            return { loading: true }

        case PACKET_CREATE_SUCCESS:
            return { loading: false, success: true, packet: action.payload }

        case PACKET_CREATE_FAIL:
            return { loading: false, error: action.payload }

        case PACKET_CREATE_RESET:
            return {}

        default:
            return state
    }
}

export const packetDetailsReducer = (state = { packet: { } }, action) => {
    switch (action.type) {
        case PACKET_DETAILS_REQUEST:
            return { loading: true, ...state }

        case PACKET_DETAILS_SUCCESS:
            return { loading: false, packet: action.payload }

        case PACKET_DETAILS_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const packetUpdateReducer = (state = { packet: {} }, action) => {
    switch (action.type) {
        case PACKET_UPDATE_REQUEST:
            return { loading: true }

        case PACKET_UPDATE_SUCCESS:
            return { loading: false, success: true, packet: action.payload }

        case PACKET_UPDATE_FAIL:
            return { loading: false, error: action.payload }

        case PACKET_UPDATE_RESET:
            return { packet: {} }

        default:
            return state
    }
}

export const packetSearchReducer = (state = { packetInfo: {} }, action) => {
    switch (action.type) {
        case PACKET_SEARCH_REQUEST:
            return { loading: true };
        case PACKET_SEARCH_SUCCESS:
            return { loading: false, packetInfo: action.payload };
        case PACKET_SEARCH_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
