import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { createInvoice } from '../actions/invoiceActions'
import { INVOICE_CREATE_RESET } from '../constants/invoiceConstants'

const InvoiceCreateScreen = () => {
    const [placeName, setPlaceName] = useState('')
    const [price, setPrice] = useState(0)
    const [weight, setWeight] = useState(0)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const invoiceCreate = useSelector(state => state.invoiceCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, invoice: createdInvoice } = invoiceCreate

    useEffect(() => {
        if (successCreate) {
            dispatch({ type: INVOICE_CREATE_RESET })
            navigate('/admin/invoices')
        }
    }, [dispatch, successCreate, navigate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createInvoice({
            placeName,
            price,
            weight
        }))
    }

    return (
        <div>
            <Link to='/admin/invoices'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Create Invoice</h1>
                {loadingCreate && <Loader />}
                {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

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
                        Create Invoice
                    </Button>
                </Form>
            </FormContainer>
        </div>
    )
}

export default InvoiceCreateScreen
