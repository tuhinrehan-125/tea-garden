import axios from 'axios';
import {
    POWDER_LIST_REQUEST, POWDER_LIST_SUCCESS, POWDER_LIST_FAIL,
    POWDER_CREATE_REQUEST, POWDER_CREATE_SUCCESS, POWDER_CREATE_FAIL,
    POWDER_DETAILS_REQUEST, POWDER_DETAILS_SUCCESS, POWDER_DETAILS_FAIL,
    POWDER_UPDATE_REQUEST, POWDER_UPDATE_SUCCESS, POWDER_UPDATE_FAIL,
    POWDER_DELETE_REQUEST, POWDER_DELETE_SUCCESS, POWDER_DELETE_FAIL,
} from '../constants/powderConstants';


export const listPowders = (keyword = '') => async (dispatch, getState) => {
    try {
        dispatch({ type: POWDER_LIST_REQUEST })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.meta.token}`,
            },
        }

        const { data } = await axios.get(`http://localhost:8000/api/powders${keyword}`, config)

        dispatch({
            type: POWDER_LIST_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: POWDER_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const deletePowder = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: POWDER_DELETE_REQUEST
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
            `http://localhost:8000/api/powders/${id}/`,
            config
        )

        dispatch({
            type: POWDER_DELETE_SUCCESS,
        })


    } catch (error) {
        dispatch({
            type: POWDER_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


// Action to create a powder with multiple sacks and weight
export const createPowder = (powder) => async (dispatch, getState) => {
    try {
        dispatch({
            type: POWDER_CREATE_REQUEST
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.meta.token}`
            }
        };

        // Adjust powder data to match the backend requirements
        const powderData = {
            powder_name: powder.powder_name,
            sacks: powder.sacks.map(sack => ({
                sack_id: sack.sack_id,
                weight_used: sack.weight_used
            }))
        };

        // console.log(powderData);

        const { data } = await axios.post(
            `http://localhost:8000/api/powders/`,
            powderData,
            config
        );

        dispatch({
            type: POWDER_CREATE_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: POWDER_CREATE_FAIL,
            payload: error.response && error.response.data
                ? {
                    message: error.response.data.message, // Custom error message
                    remaining_weight: error.response.data.remaining_weight // Remaining weight
                }
                : { message: error.message }
        });
    }
};

export const getPowderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: POWDER_DETAILS_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.meta.token}`
            }
        };

        const { data } = await axios.get(`http://localhost:8000/api/powders/${id}`, config);

        console.log(data);

        dispatch({
            type: POWDER_DETAILS_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: POWDER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        });
    }
};



export const updatePowder = (powder) => async (dispatch, getState) => {
    try {
        dispatch({ type: POWDER_UPDATE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.meta.token}`
            }
        };

        const { data } = await axios.put(
            `http://localhost:8000/api/powders/${powder.id}`,
            powder,
            config
        );

        dispatch({
            type: POWDER_UPDATE_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: POWDER_UPDATE_FAIL,
            payload: error.response && error.response.data
                ? {
                    message: error.response.data.message, 
                    remaining_weight: error.response.data.remaining_weight
                }
                : { message: error.message }
        });
    }
};
