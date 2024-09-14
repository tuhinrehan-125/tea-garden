import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; 
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { getPowderDetails, updatePowder } from '../actions/powderActions';
import { POWDER_UPDATE_RESET } from '../constants/powderConstants';

const PowderEditScreen = () => {
    const { id: powderId } = useParams();

    const [powderName, setPowderName] = useState('');
    const [sacks, setSacks] = useState([]);
    const [selectedSacks, setSelectedSacks] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const powderDetails = useSelector(state => state.powderDetails);
    const { loading, error, powder } = powderDetails;

    const powderUpdate = useSelector(state => state.powderUpdate);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = powderUpdate;

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: POWDER_UPDATE_RESET });
            navigate('/admin/powders');
        } else {
            if (!powder.powder_name || powder.id !== Number(powderId)) {
                dispatch(getPowderDetails(powderId));
            } else {
                setPowderName(powder.powder_name);
                if (powder.sacks && powder.sacks.length > 0) {
                    // Initialize selectedSacks with sack_id, sack_number, and weight_used
                    setSelectedSacks(powder.sacks.map(s => ({
                        sack_id: s.pivot.sack_id,  // Use pivot.sack_id
                        sack_number: s.sack_number,
                        weight_used: s.pivot.weight_used || 0  // Use pivot.weight_used if available
                    })));
                } else {
                    setSelectedSacks([]);  // Ensure empty state handling
                }
            }
        }
    }, [dispatch, powderId, powder, successUpdate, navigate]);

    useEffect(() => {
        const fetchSacks = async () => {
            const { data } = await axios.get('http://localhost:8000/api/sacks');
            console.log('Sacks fetched from API:', data);
            setSacks(data);
        };
        fetchSacks();
    }, []);

    const handleSackChange = (index, field, value) => {
        const updatedSacks = [...selectedSacks];
        
        if (field === 'weight_used') {
            // Convert value to number
            updatedSacks[index].weight_used = parseFloat(value) || 0;
        } else if (field === 'sack_id') {
            updatedSacks[index].sack_id = value;
        }
        
        setSelectedSacks(updatedSacks);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updatePowder({
            id: powderId,
            powder_name: powderName,
            sacks: selectedSacks
        }));
    };

    return (
        <div>
            <Link to='/admin/powders'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Edit Powder</h1>
                {loadingUpdate && <Loader />}
                {/* {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>} */}
                {errorUpdate && (
                    <div>
                        <Message variant="danger">{errorUpdate.message}</Message>
                        {errorUpdate.remaining_weight && (
                            <Message variant="info">
                                Remaining Weight in Sack: {errorUpdate.remaining_weight} kg
                            </Message>
                        )}
                    </div>
                )}
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='powderName'>
                            <Form.Label>Powder Name</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter powder name'
                                value={powderName}
                                onChange={(e) => setPowderName(e.target.value)}
                            />
                        </Form.Group>

                        {selectedSacks.map((sack, index) => (
                            <div key={index}>
                                <Form.Group controlId={`sack_${index}`}>
                                    <Form.Label>Sack</Form.Label>
                                    <Form.Control
                                        as='select'
                                        value={sack.sack_id || ''} 
                                        onChange={(e) => handleSackChange(index, 'sack_id', e.target.value)}
                                    >
                                        <option value=''>Select Sack...</option>
                                        {sacks.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.sack_number}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId={`weight_used_${index}`}>
                                    <Form.Label>Weight Used</Form.Label>
                                    <Form.Control
                                        type='number'
                                        placeholder='Enter weight used'
                                        value={sack.weight_used || ''}  // Ensure weight_used is properly displayed
                                        onChange={(e) => handleSackChange(index, 'weight_used', e.target.value)}
                                    />
                                </Form.Group>
                            </div>
                        ))}

                        <Button type='submit' variant='primary'>
                            Update Powder
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </div>
    );
};

export default PowderEditScreen;
