import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Row, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import SearchBox from './SearchBox'
import { logout } from '../actions/userActions'

function Header() {

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        dispatch(logout())
        navigate('/login');
    }

    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>TeaGarden</Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* <SearchBox /> */}
                        <Nav className="ml-auto">

                            <LinkContainer to='/cart'>
                                <Nav.Link ><i className="fas fa-shopping-cart"></i>Cart</Nav.Link>
                            </LinkContainer>

                            {userInfo ? (
                                <NavDropdown title={userInfo.data.name} id='username'>
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>

                                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>

                                </NavDropdown>
                            ) : (
                                    <LinkContainer to='/login'>
                                        <Nav.Link><i className="fas fa-user"></i>Login</Nav.Link>
                                    </LinkContainer>
                                )}


                            {/* {userInfo && userInfo.is_admin && (
                                <NavDropdown title='Admin' id='adminmenue'>
                                    <LinkContainer to='/admin/userlist'>
                                        <NavDropdown.Item>Users</NavDropdown.Item>
                                    </LinkContainer>

                                    <LinkContainer to='/admin/productlist'>
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </LinkContainer>

                                    <LinkContainer to='/admin/orderlist'>
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>

                                </NavDropdown>
                            )} */}


                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header