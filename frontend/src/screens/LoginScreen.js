import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';  // Import hooks
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { login } from '../actions/userActions';

function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const location = useLocation();  // Use useLocation to get location object
    const navigate = useNavigate();  // Use useNavigate for navigation

    // Get the redirect value from the URL search params, default to '/'
    const redirect = new URLSearchParams(location.search).get('redirect') || '/';

    const userLogin = useSelector((state) => state.userLogin);
    const { error, loading, userInfo } = userLogin;

    // useEffect(() => {
    //     if (userInfo) {
    //         navigate(redirect);
    //     }
    // }, [navigate, userInfo, redirect]);
    useEffect(() => {
        if (userInfo) {
          navigate('/admin/dashboard');
        }
      }, [navigate, userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    // If the user is logged in, don't show the login form (this prevents auto-redirection on this page)
    if (userInfo) {
        navigate(redirect); // Redirect right away if the user is already logged in
        return null; // Don't render the login form if already logged in
    }

    return (
        <FormContainer>
            <h1>Sign In</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    Sign In
                </Button>
            </Form>

            <Row className='py-3'>
                <Col>
                    New Customer?{' '}
                    <Link
                        to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                        Register
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    );
}

export default LoginScreen;
