import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import { listMyOrders } from '../actions/orderActions'

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading:loadingOrders, error:errorOrders, orders } = orderListMy;

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      if (!user || !user.name || user.email !== userInfo.email || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails('profile'));
        dispatch(listMyOrders())
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, navigate, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
      setMessage('Profile updated');
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}
        {message && <Message variant='success'>{message}</Message>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='name'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='confirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Row className='py-3'>
            <Col>
              <Button type='submit' variant='primary'>
                Update
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
      <Col md={9}>
        <h2>Orders</h2>
{loadingOrders ? (
  <Loader />
) : errorOrders ? (
  <Message variant='danger'>{errorOrders}</Message>
) : (
  <Table striped bordered hover responsive className='table-sm'>
    <thead>
      <tr>
        <th>ID</th>
        <th>DATE</th>
        <th>TOTAL</th>
        <th>PAID</th>
        <th>DELIVERED</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {orders.map(order => (
        <tr key={order._id}>
          <td>{order._id}</td>
          <td>{order.createdAt.substring(0, 10)}</td>
          <td>{order.totalPrice}</td>
          <td>
            {order.isPaid ? (
              order.paidAt.substring(0, 10)
            ) : (
              <i className='fas fa-times' style={{ color: 'red' }}></i>
            )}
          </td>
          <td>
            {order.isDelivered ? (
              order.deliveredAt.substring(0, 10)
            ) : (
              <i className='fas fa-times' style={{ color: 'red' }}></i>
            )}
          </td>
          <td>
            <LinkContainer to={`/order/${order._id}`}>
              <Button className='btn-sm' variant='light'>Details</Button>
            </LinkContainer>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
)}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
