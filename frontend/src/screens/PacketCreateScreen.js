import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { createPacket } from '../actions/packetActions'
import { PACKET_CREATE_RESET } from '../constants/packetConstants'

const PacketCreateScreen = () => {
    const [packetName, setPacketName] = useState('')
    const [weight, setWeight] = useState(0)
    const [price, setPrice] = useState(0)
    const [powder_id, setPowderId] = useState(0)
    const [powders, setPowders] = useState([])

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const packetCreate = useSelector(state => state.packetCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, packet: createdPacket } = packetCreate

    useEffect(() => {
        const fetchPowders = async () => {
            const { data } = await axios.get('http://localhost:8000/api/powders');  // Adjust the API endpoint if necessary
            setPowders(data);
        }

        fetchPowders();

        if (successCreate) {
            dispatch({ type: PACKET_CREATE_RESET })
            navigate('/admin/packets')
        }
    }, [dispatch, successCreate, navigate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createPacket({
            packetName,
            weight,
            price,
            powder_id
        }))
    }

    return (
        <div>
            <Link to='/admin/packets'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Create Packets</h1>
                {loadingCreate && <Loader />}
                
                {errorCreate && (
                    <div>
                        <Message variant="danger">{errorCreate.message}</Message>
                        {errorCreate.remaining_weight && (
                            <Message variant="info">
                                Remaining Weight in Tea Leaf Powder: {errorCreate.remaining_weight} kg
                            </Message>
                        )}
                    </div>
                )}

                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='powder'>
                        <Form.Label>Select Tea Leaf Powder</Form.Label>
                        <Form.Control
                            as='select'
                            value={powder_id}
                            onChange={(e) => setPowderId(e.target.value)}
                        >
                            <option value=''>Select...</option>
                            {powders.map((powder) => (
                                <option key={powder.id} value={powder.id}>
                                    {powder.powder_number} 
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='packetName'>
                        <Form.Label>Packet Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter packet name'
                            value={packetName}
                            onChange={(e) => setPacketName(e.target.value)}
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

                    <Form.Group controlId='weight'>
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder='Enter price'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </Form.Group>

                    <Button type='submit' variant='primary'>
                        Create Packet
                    </Button>
                </Form>
            </FormContainer>
        </div>
    )
}

export default PacketCreateScreen
