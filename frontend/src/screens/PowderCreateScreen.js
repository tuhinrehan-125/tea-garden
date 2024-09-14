import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { createPowder } from '../actions/powderActions'
import { POWDER_CREATE_RESET } from '../constants/powderConstants'

const PowderCreateScreen = () => {
    const [powderName, setPowderName] = useState('')
    const [sacks, setSacks] = useState([{ sack_id: '', weight_used: '' }]) // Default empty sack array
    const [availableSacks, setAvailableSacks] = useState([]) // List of available sacks from API

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const powderCreate = useSelector(state => state.powderCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, powder: createdPowder } = powderCreate

    // Fetch available sacks for dropdown
    useEffect(() => {
        const fetchSacks = async () => {
            const { data } = await axios.get('http://localhost:8000/api/sacks');
            setAvailableSacks(data);
        }

        fetchSacks();

        if (successCreate) {
            dispatch({ type: POWDER_CREATE_RESET })
            navigate('/admin/powders')
        }
    }, [dispatch, successCreate, navigate])

    // Handle form submission
    const submitHandler = (e) => {
        e.preventDefault()
        const powderData = {
            powder_name: powderName,
            sacks
        }
        dispatch(createPowder(powderData))
    }

    // Handle input changes for powder name
    const handlePowderNameChange = (e) => {
        setPowderName(e.target.value)
    }

    // Handle changes in the sack_id and weight_used for dynamic sacks input
    const handleSackChange = (index, field, value) => {
        const updatedSacks = sacks.map((sack, i) => 
            i === index ? { ...sack, [field]: value } : sack
        )
        setSacks(updatedSacks)
    }

    // Add a new empty sack input
    const addSackField = () => {
        setSacks([...sacks, { sack_id: '', weight_used: '' }])
    }

    // Remove a sack input
    const removeSackField = (index) => {
        setSacks(sacks.filter((_, i) => i !== index))
    }

    return (
        <div>
            <Link to='/admin/powders'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Create Powder</h1>
                {loadingCreate && <Loader />}
                {errorCreate && (
                    <div>
                        <Message variant="danger">{errorCreate.message}</Message>
                        {errorCreate.remaining_weight && (
                            <Message variant="info">
                                Remaining Weight in Sack: {errorCreate.remaining_weight} kg
                            </Message>
                        )}
                    </div>
                )}

                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='powderName'>
                        <Form.Label>Powder Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter powder name'
                            value={powderName}
                            onChange={handlePowderNameChange}
                        />
                    </Form.Group>

                    <h4>Sacks Used</h4>

                    {sacks.map((sack, index) => (
                        <Row key={index} className='mb-3'>
                            <Col md={6}>
                                <Form.Group controlId={`sack_${index}`}>
                                    <Form.Label>Select Sack</Form.Label>
                                    <Form.Control
                                        as='select'
                                        value={sack.sack_id}
                                        onChange={(e) => handleSackChange(index, 'sack_id', e.target.value)}
                                    >
                                        <option value=''>Select...</option>
                                        {availableSacks.map((availableSack) => (
                                            <option key={availableSack.id} value={availableSack.id}>
                                                {availableSack.sack_number} 
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group controlId={`weight_${index}`}>
                                    <Form.Label>Weight Used</Form.Label>
                                    <Form.Control
                                        type='number'
                                        placeholder='Enter weight used'
                                        value={sack.weight_used}
                                        onChange={(e) => handleSackChange(index, 'weight_used', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={2}>
                                <Button
                                    variant='danger'
                                    onClick={() => removeSackField(index)}
                                    className='mt-4'
                                >
                                    Remove
                                </Button>
                            </Col>
                        </Row>
                    ))}

                    <Row>
                        <Col>
                            <Button variant='success' onClick={addSackField} className='mb-3'>
                                Add Sack
                            </Button>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Button type='submit' variant='primary' className='mt-3'>
                                Create Powder
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </FormContainer>
        </div>
    )
}

export default PowderCreateScreen
