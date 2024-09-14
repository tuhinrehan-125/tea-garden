import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listPowders, deletePowder, createPowder } from '../actions/powderActions';
import { POWDER_CREATE_RESET } from '../constants/powderConstants';

const PowderScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const powderList = useSelector(state => state.powderList);
    const { loading, error, powders = [] } = powderList;

    const powderDelete = useSelector(state => state.powderDelete);
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = powderDelete;

    const powderCreate = useSelector(state => state.powderCreate);
    const { loading: loadingCreate, error: errorCreate, success: successCreate, powder: createdPowder } = powderCreate;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;


    useEffect(() => {
        dispatch({ type: POWDER_CREATE_RESET });

        // Check if user is logged in
        if (!userInfo || !userInfo.data) {
            navigate('/login');
        } else if (!userInfo.data.isAdmin) {
            navigate('/login');
        }

        if (successCreate) {
            navigate(`/admin/powders/${createdPowder.id}`);
        } else {
            dispatch(listPowders());
        }

    }, [dispatch, navigate, userInfo, successDelete, successCreate, createdPowder]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this Powder?')) {
            dispatch(deletePowder(id));
        }
    };

    return (
        <div className="container-fluid">
            <Row className='align-items-center'>
                <Col>
                    <h1>Powders</h1>
                </Col>
                <Col className='text-right'>
                    <LinkContainer to={`/admin/powder/create`}>
                        <Button className='my-3'>
                            <i className='fas fa-plus'></i> Create Powder
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
                            <th>POWDER NAME</th>
                            <th>POWDER NUMBER</th>
                            <th>WEIGHT</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {powders.map(powder => (
                            <tr key={powder.id}>
                                <td>{powder.id}</td>
                                <td>{powder.powder_name}</td>
                                <td>{powder.powder_number}</td>
                                <td>{powder.total_weight}</td>
                                <td>
                                    <LinkContainer to={`/admin/powder/${powder.id}/edit`}>
                                        <Button variant='light' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(powder.id)}>
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

export default PowderScreen;
