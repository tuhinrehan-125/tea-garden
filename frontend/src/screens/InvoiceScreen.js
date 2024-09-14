import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listInvoices, deleteInvoice, createInvoice } from '../actions/invoiceActions';
import { INVOICE_CREATE_RESET } from '../constants/invoiceConstants';

const InvoiceScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const invoiceList = useSelector(state => state.invoiceList);
    const { loading, error, invoices = [] } = invoiceList;

    const invoiceDelete = useSelector(state => state.invoiceDelete);
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = invoiceDelete;

    const invoiceCreate = useSelector(state => state.invoiceCreate);
    const { loading: loadingCreate, error: errorCreate, success: successCreate, invoice: createdInvoice } = invoiceCreate;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        // Reset the create invoice state
        dispatch({ type: INVOICE_CREATE_RESET });

        // Check if user is logged in
        if (!userInfo || !userInfo.data) {
            navigate('/login');
        } else if (!userInfo.data.isAdmin) {
            navigate('/login');
        }

        if (successCreate) {
            navigate(`/admin/invoices/${createdInvoice.id}`);
        } else {
            dispatch(listInvoices());
        }

    }, [dispatch, navigate, userInfo, successDelete, successCreate, createdInvoice]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this Invoice?')) {
            dispatch(deleteInvoice(id));
        }
    };

    return (
        <div className="container-fluid">
            <Row className='align-items-center'>
                <Col>
                    <h1>Invoices</h1>
                </Col>
                <Col className='text-right'>
                    <LinkContainer to={`/admin/invoice/create`}>
                        <Button className='my-3'>
                            <i className='fas fa-plus'></i> Create Invoice
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
                            <th>PLACE NAME</th>
                            <th>INVOICE NUMBER</th>
                            <th>PRICE</th>
                            <th>WEIGHT</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(invoice => (
                            <tr key={invoice.id}>
                                <td>{invoice.id}</td>
                                <td>{invoice.place_name}</td>
                                <td>{invoice.invoice_number}</td>
                                <td>${invoice.price}</td>
                                <td>{invoice.weight}</td>
                                <td>
                                    <LinkContainer to={`/admin/invoice/${invoice.id}/edit`}>
                                        <Button variant='light' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(invoice.id)}>
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

export default InvoiceScreen;
