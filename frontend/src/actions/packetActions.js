import axios from 'axios';
import {
    PACKET_LIST_REQUEST, PACKET_LIST_SUCCESS, PACKET_LIST_FAIL,
    PACKET_CREATE_REQUEST, PACKET_CREATE_SUCCESS, PACKET_CREATE_FAIL,
    PACKET_DETAILS_REQUEST, PACKET_DETAILS_SUCCESS, PACKET_DETAILS_FAIL,
    PACKET_UPDATE_REQUEST, PACKET_UPDATE_SUCCESS, PACKET_UPDATE_FAIL,
    PACKET_DELETE_REQUEST, PACKET_DELETE_SUCCESS, PACKET_DELETE_FAIL,
    PACKET_SEARCH_REQUEST,PACKET_SEARCH_SUCCESS, PACKET_SEARCH_FAIL,
} from '../constants/packetConstants';


export const listPackets = (keyword = '') => async (dispatch, getState) => {
    try {
        dispatch({ type: PACKET_LIST_REQUEST })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.meta.token}`,
            },
        }

        const { data } = await axios.get(`http://localhost:8000/api/packets${keyword}`, config)

        dispatch({
            type: PACKET_LIST_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: PACKET_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const deletePacket = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PACKET_DELETE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.meta.token}`
            }
        }

        const { data } = await axios.delete(
            `http://localhost:8000/api/packets/${id}/`,
            config
        )

        dispatch({
            type: PACKET_DELETE_SUCCESS,
        })


    } catch (error) {
        dispatch({
            type: PACKET_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const createPacket = (packet) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PACKET_CREATE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.meta.token}`
            }
        }

        // Adjust the keys to match Laravel's expectations
        const packetData = {
            packet_name: packet.packetName,
            weight: packet.weight,
            price: packet.price,
            powder_id: packet.powder_id
        }

        const { data } = await axios.post(
            `http://localhost:8000/api/packets/`,
            packetData,
            config
        )

        dispatch({
            type: PACKET_CREATE_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: PACKET_CREATE_FAIL,
            payload: error.response && error.response.data
                ? {
                    message: error.response.data.message, 
                    remaining_weight: error.response.data.remaining_weight
                }
                : { message: error.message }
        });
    }
}


export const getPacketDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: PACKET_DETAILS_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.meta.token}`,
            },
        };

        const { data } = await axios.get(`http://localhost:8000/api/packets/${id}`, config);

        // console.log(data);
        dispatch({
            type: PACKET_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: PACKET_DETAILS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

export const updatePacket = (packet) => async (dispatch, getState) => {
    try {
        dispatch({ type: PACKET_UPDATE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.meta.token}`
            }
        };

        const { data } = await axios.put(`http://localhost:8000/api/packets/${packet.id}/`, {
            packet_name: packet.packetName,
            weight: packet.weight,
            price: packet.price,
            powder_id: packet.powder_id
        }, config);

        dispatch({
            type: PACKET_UPDATE_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: PACKET_UPDATE_FAIL,
            payload: error.response && error.response.data
                ? {
                    message: error.response.data.message, 
                    remaining_weight: error.response.data.remaining_weight
                }
                : { message: error.message }
        });
    }
};

export const searchPacket = (packetNumber) => async (dispatch) => {
    try {
        dispatch({ type: PACKET_SEARCH_REQUEST });

        const { data } = await axios.get(`http://localhost:8000/api/packets/search/${packetNumber}`);

        dispatch({ type: PACKET_SEARCH_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PACKET_SEARCH_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};
