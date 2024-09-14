import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { getInvoiceDetails, updateInvoice } from '../actions/invoiceActions';
import { INVOICE_UPDATE_RESET } from '../constants/invoiceConstants';

const InvoiceEditScreen = () => {
    const { id } = useParams(); // Get the invoice ID from the URL
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [placeName, setPlaceName] = useState('');
    const [price, setPrice] = useState(0);
    const [weight, setWeight] = useState(0);

    const invoiceDetails = useSelector((state) => state.invoiceDetails || { invoice: {}, loading: true });
    const { loading, error, invoice } = invoiceDetails;

    const invoiceUpdate = useSelector((state) => state.invoiceUpdate);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = invoiceUpdate;

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: INVOICE_UPDATE_RESET });
            navigate('/admin/invoices');
        } else {
            if (!invoice.place_name || invoice.id !== Number(id)) {
                dispatch(getInvoiceDetails(id)); // Fetch invoice details
            } else {
                setPlaceName(invoice.place_name);
                setPrice(invoice.price);
                setWeight(invoice.weight);
            }
        }
    }, [dispatch, id, invoice, successUpdate, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateInvoice({
            id,
            placeName,
            price,
            weight
        }));
    };

    return (
        <>
            <Link to='/admin/invoices'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Invoice</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='placeName'>
                            <Form.Label>Place Name</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter place name'
                                value={placeName}
                                onChange={(e) => setPlaceName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId='price'>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter price'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId='weight'>
                            <Form.Label>Weight</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter weight'
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                            />
                        </Form.Group>

                        <Button type='submit' variant='primary'>
                            Update Invoice
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    );
};

export default InvoiceEditScreen;
