import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { createSack } from '../actions/sackActions'
import { SACK_CREATE_RESET } from '../constants/sackConstants'

const SackCreateScreen = () => {
    const [sackName, setSackName] = useState('')
    const [weight, setWeight] = useState(0)
    const [invoice_id, setInvoiceId] = useState(0)
    const [invoices, setInvoices] = useState([])

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const sackCreate = useSelector(state => state.sackCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, sack: createdSack } = sackCreate

    useEffect(() => {
        const fetchInvoices = async () => {
            const { data } = await axios.get('http://localhost:8000/api/invoices');  // Adjust the API endpoint if necessary
            setInvoices(data);
        }

        fetchInvoices();

        if (successCreate) {
            dispatch({ type: SACK_CREATE_RESET })
            navigate('/admin/sacks')
        }
    }, [dispatch, successCreate, navigate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createSack({
            sackName,
            weight,
            invoice_id
        }))
    }

    return (
        <div>
            <Link to='/admin/sacks'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Create Sacks</h1>
                {loadingCreate && <Loader />}
                {errorCreate && (
                    <div>
                        <Message variant="danger">{errorCreate.message}</Message>
                        {errorCreate.remaining_weight && (
                            <Message variant="info">
                                Remaining Weight in Invoice: {errorCreate.remaining_weight} kg
                            </Message>
                        )}
                    </div>
                )}

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
                    <Form.Group controlId='sackName'>
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
                        Create Sack
                    </Button>
                </Form>
            </FormContainer>
        </div>
    )
}

export default SackCreateScreen
