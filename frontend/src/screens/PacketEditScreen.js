import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { getPacketDetails, updatePacket } from '../actions/packetActions';
import { PACKET_UPDATE_RESET } from '../constants/packetConstants';

const PacketEditScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [packetName, setPacketName] = useState('')
    const [weight, setWeight] = useState(0)
    const [price, setPrice] = useState(0)
    const [powder_id, setPowderId] = useState(0)
    const [powders, setPowders] = useState([])

    const packetDetails = useSelector((state) => state.packetDetails || { packet: {}, loading: true });
    const { loading, error, packet } = packetDetails;

    const packetUpdate = useSelector((state) => state.packetUpdate);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = packetUpdate;

    useEffect(() => {
        const fetchPowders = async () => {
            const { data } = await axios.get('http://localhost:8000/api/powders')  // Adjust API endpoint as necessary
            setPowders(data)
        }
        fetchPowders()

        if (successUpdate) {
            dispatch({ type: PACKET_UPDATE_RESET });
            navigate('/admin/packets');
        } else {
            if (!packet.packet_name || packet.id !== Number(id)) {
                dispatch(getPacketDetails(id)); // Fetch sack details
            } else {
                setPacketName(packet.packet_name);
                setWeight(packet.weight);
                setPrice(packet.price);
                setPowderId(packet.powder_id);
            }
        }
    }, [dispatch, id, packet, successUpdate, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updatePacket({
            id,
            packetName,
            weight,
            price,
            powder_id,
        }));
    };

    return (
        <>
            <Link to='/admin/powders'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Powders</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && (
                    <div>
                        <Message variant="danger">{errorUpdate.message}</Message>
                        {errorUpdate.remaining_weight && (
                            <Message variant="info">
                                Remaining Weight in Tea Leaf Powder: {errorUpdate.remaining_weight} kg
                            </Message>
                        )}
                    </div>
                )}
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='powder'>
                            <Form.Label>Select Powder</Form.Label>
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

                        <Form.Group controlId='placeName'>
                            <Form.Label>Packet Name</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter powder name'
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

                        <Form.Group controlId='price'>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter price'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Form.Group>

                        <Button type='submit' variant='primary'>
                            Update Packet
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    );
};

export default PacketEditScreen;
