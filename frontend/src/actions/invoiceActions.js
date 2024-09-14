import axios from 'axios'
import {
    INVOICE_LIST_REQUEST,
    INVOICE_LIST_SUCCESS,
    INVOICE_LIST_FAIL,

    INVOICE_DETAILS_REQUEST,
    INVOICE_DETAILS_SUCCESS,
    INVOICE_DETAILS_FAIL,

    INVOICE_DELETE_REQUEST,
    INVOICE_DELETE_SUCCESS,
    INVOICE_DELETE_FAIL,

    INVOICE_CREATE_REQUEST,
    INVOICE_CREATE_SUCCESS,
    INVOICE_CREATE_FAIL,

    INVOICE_UPDATE_REQUEST,
    INVOICE_UPDATE_SUCCESS,
    INVOICE_UPDATE_FAIL,

} from '../constants/invoiceConstants'

export const listInvoices = (keyword = '') => async (dispatch, getState) => {
    try {
        dispatch({ type: INVOICE_LIST_REQUEST })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.meta.token}`,
            },
        }

        const { data } = await axios.get(`http://localhost:8000/api/invoices${keyword}`, config)

        dispatch({
            type: INVOICE_LIST_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: INVOICE_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const deleteInvoice = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: INVOICE_DELETE_REQUEST
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
            `http://localhost:8000/api/invoices/${id}/`,
            config
        )

        dispatch({
            type: INVOICE_DELETE_SUCCESS,
        })


    } catch (error) {
        dispatch({
            type: INVOICE_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const createInvoice = (invoice) => async (dispatch, getState) => {
    try {
        dispatch({
            type: INVOICE_CREATE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.meta.token}` // Ensure that the token is correct
            }
        }

        // Adjust the keys to match Laravel's expectations
        const invoiceData = {
            place_name: invoice.placeName,
            price: invoice.price,
            weight: invoice.weight
        }

        const { data } = await axios.post(
            `http://localhost:8000/api/invoices/`,
            invoiceData,
            config
        )

        dispatch({
            type: INVOICE_CREATE_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: INVOICE_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const getInvoiceDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: INVOICE_DETAILS_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.meta.token}`,
            },
        };

        const { data } = await axios.get(`http://localhost:8000/api/invoices/${id}`, config);

        console.log(data);
        dispatch({
            type: INVOICE_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: INVOICE_DETAILS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

export const updateInvoice = (invoice) => async (dispatch, getState) => {
    try {
        dispatch({ type: INVOICE_UPDATE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.meta.token}`
            }
        };

        const { data } = await axios.put(`http://localhost:8000/api/invoices/${invoice.id}/`, {
            place_name: invoice.placeName,
            price: invoice.price,
            weight: invoice.weight
        }, config);

        dispatch({
            type: INVOICE_UPDATE_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: INVOICE_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
};