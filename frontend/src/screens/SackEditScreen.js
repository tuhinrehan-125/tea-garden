import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { getSackDetails, updateSack } from '../actions/sackActions';
import { SACK_UPDATE_RESET } from '../constants/sackConstants';

const SackEditScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [sackName, setSackName] = useState('')
    const [weight, setWeight] = useState(0)
    const [invoice_id, setInvoiceId] = useState(0)
    const [invoices, setInvoices] = useState([])

    const sackDetails = useSelector((state) => state.sackDetails || { sack: {}, loading: true });
    const { loading, error, sack } = sackDetails;

    const sackUpdate = useSelector((state) => state.sackUpdate);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = sackUpdate;

    useEffect(() => {
        const fetchInvoices = async () => {
            const { data } = await axios.get('http://localhost:8000/api/invoices')  // Adjust API endpoint as necessary
            setInvoices(data)
        }
        fetchInvoices()

        if (successUpdate) {
            dispatch({ type: SACK_UPDATE_RESET });
            navigate('/admin/sacks');
        } else {
            if (!sack.sack_name || sack.id !== Number(id)) {
                dispatch(getSackDetails(id)); // Fetch sack details
            } else {
                setSackName(sack.sack_name);
                setWeight(sack.weight);
                setInvoiceId(sack.invoice_id);
            }
        }
    }, [dispatch, id, sack, successUpdate, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateSack({
            id,
            sackName,
            weight,
            invoice_id,
        }));
    };

    return (
        <>
            <Link to='/admin/sacks'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Sacks</h1>
                {loadingUpdate && <Loader />}
                
                {errorUpdate && (
                    <div>
                        <Message variant="danger">{errorUpdate.message}</Message>
                        {errorUpdate.remaining_weight && (
                            <Message variant="info">
                                Remaining Weight in Invoice: {errorUpdate.remaining_weight} kg
                            </Message>
                        )}
                    </div>
                )}
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='invoice'>
                            <Form.Label>Select Invoice</Form.Label>
                            <Form.Control
                                as='select'
                                value={invoice_id}
                                onChange={(e) => setInvoiceId(e.target.value)}
                            >
                                <option value=''>Select...</option>
                                {invoices.map((invoice) => (
                                    <option key={invoice.id} value={invoice.id}>
                                        {invoice.invoice_number}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='placeName'>
                            <Form.Label>Sack Name</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter sack name'
                                value={sackName}
                                onChange={(e) => setSackName(e.target.value)}
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
                            Update Sack
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    );
};

export default SackEditScreen;
