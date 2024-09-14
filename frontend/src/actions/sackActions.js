import axios from 'axios';
import {
    SACK_LIST_REQUEST, SACK_LIST_SUCCESS, SACK_LIST_FAIL,
    SACK_CREATE_REQUEST, SACK_CREATE_SUCCESS, SACK_CREATE_FAIL,
    SACK_DETAILS_REQUEST, SACK_DETAILS_SUCCESS, SACK_DETAILS_FAIL,
    SACK_UPDATE_REQUEST, SACK_UPDATE_SUCCESS, SACK_UPDATE_FAIL,
    SACK_DELETE_REQUEST, SACK_DELETE_SUCCESS, SACK_DELETE_FAIL,
} from '../constants/sackConstants';


export const listSacks = (keyword = '') => async (dispatch, getState) => {
    try {
        dispatch({ type: SACK_LIST_REQUEST })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.meta.token}`,
            },
        }

        const { data } = await axios.get(`http://localhost:8000/api/sacks${keyword}`, config)

        dispatch({
            type: SACK_LIST_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: SACK_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const deleteSack = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: SACK_DELETE_REQUEST
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
            `http://localhost:8000/api/sacks/${id}/`,
            config
        )

        dispatch({
            type: SACK_DELETE_SUCCESS,
        })


    } catch (error) {
        dispatch({
            type: SACK_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const createSack = (sack) => async (dispatch, getState) => {
    try {
        dispatch({
            type: SACK_CREATE_REQUEST
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
        const sackData = {
            sack_name: sack.sackName,
            weight: sack.weight,
            invoice_id: sack.invoice_id
        }

        const { data } = await axios.post(
            `http://localhost:8000/api/sacks/`,
            sackData,
            config
        )

        dispatch({
            type: SACK_CREATE_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: SACK_CREATE_FAIL,
            payload: error.response && error.response.data
                ? {
                    message: error.response.data.message, 
                    remaining_weight: error.response.data.remaining_weight
                }
                : { message: error.message }
        });
    }
}


export const getSackDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: SACK_DETAILS_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.meta.token}`,
            },
        };

        const { data } = await axios.get(`http://localhost:8000/api/sacks/${id}`, config);

        // console.log(data);
        dispatch({
            type: SACK_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: SACK_DETAILS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

export const updateSack = (sack) => async (dispatch, getState) => {
    try {
        dispatch({ type: SACK_UPDATE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.meta.token}`
            }
        };

        const { data } = await axios.put(`http://localhost:8000/api/sacks/${sack.id}/`, {
            sack_name: sack.sackName,
            weight: sack.weight,
            invoice_id: sack.invoice_id
        }, config);

        dispatch({
            type: SACK_UPDATE_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: SACK_UPDATE_FAIL,
            payload: error.response && error.response.data
                ? {
                    message: error.response.data.message, 
                    remaining_weight: error.response.data.remaining_weight
                }
                : { message: error.message }
        });
    }
};