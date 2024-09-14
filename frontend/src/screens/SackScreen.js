import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listSacks, deleteSack, createSack } from '../actions/sackActions';
import { SACK_CREATE_RESET } from '../constants/sackConstants';

const SackScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const sackList = useSelector(state => state.sackList);
    const { loading, error, sacks = [] } = sackList;

    const sackDelete = useSelector(state => state.sackDelete);
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = sackDelete;

    const sackCreate = useSelector(state => state.sackCreate);
    const { loading: loadingCreate, error: errorCreate, success: successCreate, sack: createdSack } = sackCreate;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;


    useEffect(() => {
        dispatch({ type: SACK_CREATE_RESET });

        // Check if user is logged in
        if (!userInfo || !userInfo.data) {
            navigate('/login');
        } else if (!userInfo.data.isAdmin) {
            navigate('/login');
        }

        if (successCreate) {
            navigate(`/admin/sacks/${createdSack.id}`);
        } else {
            dispatch(listSacks());
        }

    }, [dispatch, navigate, userInfo, successDelete, successCreate, createdSack]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this Sack?')) {
            dispatch(deleteSack(id));
        }
    };

    return (
        <div className="container-fluid">
            <Row className='align-items-center'>
                <Col>
                    <h1>Sacks</h1>
                </Col>
                <Col className='text-right'>
                    <LinkContainer to={`/admin/sack/create`}>
                        <Button className='my-3'>
                            <i className='fas fa-plus'></i> Create Sack
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
                            <th>SACK NAME</th>
                            <th>SACK NUMBER</th>
                            <th>WEIGHT</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sacks.map(sack => (
                            <tr key={sack.id}>
                                <td>{sack.id}</td>
                                <td>{sack.sack_name}</td>
                                <td>{sack.sack_number}</td>
                                <td>{sack.weight}</td>
                                <td>
                                    <LinkContainer to={`/admin/sack/${sack.id}/edit`}>
                                        <Button variant='light' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(sack.id)}>
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

export default SackScreen;
