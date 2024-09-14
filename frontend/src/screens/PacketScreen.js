import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listPackets, deletePacket, createPacket } from '../actions/packetActions';
import { PACKET_CREATE_RESET } from '../constants/packetConstants';

const PacketScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const packetList = useSelector(state => state.packetList);
    const { loading, error, packets = [] } = packetList;

    const packetDelete = useSelector(state => state.packetDelete);
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = packetDelete;

    const packetCreate = useSelector(state => state.packetCreate);
    const { loading: loadingCreate, error: errorCreate, success: successCreate, packet: createdPacket } = packetCreate;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;


    useEffect(() => {
        dispatch({ type: PACKET_CREATE_RESET });

        // Check if user is logged in
        if (!userInfo || !userInfo.data) {
            navigate('/login');
        } else if (!userInfo.data.isAdmin) {
            navigate('/login');
        }

        if (successCreate) {
            navigate(`/admin/packets/${createdPacket.id}`);
        } else {
            dispatch(listPackets());
        }

    }, [dispatch, navigate, userInfo, successDelete, successCreate, createdPacket]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this Packet?')) {
            dispatch(deletePacket(id));
        }
    };

    return (
        <div className="container-fluid">
            <Row className='align-items-center'>
                <Col>
                    <h1>Packets</h1>
                </Col>
                <Col className='text-right'>
                    <LinkContainer to={`/admin/packet/create`}>
                        <Button className='my-3'>
                            <i className='fas fa-plus'></i> Create Packet
                        </Button>
                    </LinkContainer>
                </Col>
            </Row>

            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>PACKET NAME</th>
                            <th>PACKET NUMBER</th>
                            <th>WEIGHT</th>
                            <th>PRICE</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packets.map(packet => (
                            <tr key={packet.id}>
                                <td>{packet.id}</td>
                                <td>{packet.packet_name}</td>
                                <td>{packet.packet_number}</td>
                                <td>{packet.weight}</td>
                                <td>{packet.price}</td>
                                <td>
                                    <LinkContainer to={`/admin/packet/${packet.id}/edit`}>
                                        <Button variant='light' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(packet.id)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
        
    );
};

export default PacketScreen;
