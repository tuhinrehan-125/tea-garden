import { createStore, combineReducers, applyMiddleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk'; // Use named import
import { composeWithDevTools } from 'redux-devtools-extension';
import { userLoginReducer } from './reducers/userReducers'
import { 
    invoiceListReducer, 
    invoiceDeleteReducer, 
    invoiceCreateReducer, 
    invoiceDetailsReducer,
    invoiceUpdateReducer 
} from './reducers/invoiceReducers'
import { 
    sackListReducer, 
    sackDeleteReducer, 
    sackCreateReducer, 
    sackDetailsReducer,
    sackUpdateReducer 
} from './reducers/sackReducers'

import { 
    powderListReducer, 
    powderDeleteReducer, 
    powderCreateReducer, 
    powderDetailsReducer,
    powderUpdateReducer 
} from './reducers/powderReducers'

import { 
    packetListReducer, 
    packetDeleteReducer, 
    packetCreateReducer, 
    packetDetailsReducer,
    packetUpdateReducer,

    packetSearchReducer 
} from './reducers/packetReducers'

const reducer = combineReducers({
    userLogin: userLoginReducer,
    invoiceList: invoiceListReducer,
    invoiceDelete: invoiceDeleteReducer,
    invoiceCreate: invoiceCreateReducer,
    invoiceDetails: invoiceDetailsReducer,
    invoiceUpdate: invoiceUpdateReducer,

    sackList: sackListReducer, 
    sackDelete: sackDeleteReducer,
    sackCreate: sackCreateReducer,
    sackDetails: sackDetailsReducer,
    sackUpdate: sackUpdateReducer,

    powderList: powderListReducer, 
    powderDelete: powderDeleteReducer,
    powderCreate: powderCreateReducer,
    powderDetails: powderDetailsReducer,
    powderUpdate: powderUpdateReducer,

    packetList: packetListReducer, 
    packetDelete: packetDeleteReducer,
    packetCreate: packetCreateReducer,
    packetDetails: packetDetailsReducer,
    packetUpdate: packetUpdateReducer,

    packetSearch: packetSearchReducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) : null;

const initialState = {
    userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

// console.log(store.getState());

export default store;


// import {
//     productListReducer,
//     productDetailsReducer,
//     productDeleteReducer,
//     productCreateReducer,
//     productUpdateReducer,
//     productReviewCreateReducer,
//     productTopRatedReducer,
// } from './reducers/productReducers'


// const reducer = combineReducers({
//     productList: productListReducer,
//     productDetails: productDetailsReducer,
//     productDelete: productDeleteReducer,
//     productCreate: productCreateReducer,
//     productUpdate: productUpdateReducer,
//     productReviewCreate: productReviewCreateReducer,
//     productTopRated: productTopRatedReducer,

//     cart: cartReducer,
//     userLogin: userLoginReducer,
//     userRegister: userRegisterReducer,
//     userDetails: userDetailsReducer,
//     userUpdateProfile: userUpdateProfileReducer,
//     userList: userListReducer,
//     userDelete: userDeleteReducer,
//     userUpdate: userUpdateReducer,

//     orderCreate: orderCreateReducer,
//     orderDetails: orderDetailsReducer,
//     orderPay: orderPayReducer,
//     orderListMy: orderListMyReducer,
//     orderList: orderListReducer,
//     orderDeliver: orderDeliverReducer,
// })


// const cartItemsFromStorage = localStorage.getItem('cartItems') ?
//     JSON.parse(localStorage.getItem('cartItems')) : []

// const userInfoFromStorage = localStorage.getItem('userInfo') ?
//     JSON.parse(localStorage.getItem('userInfo')) : null


// const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ?
//     JSON.parse(localStorage.getItem('shippingAddress')) : {}


// const initialState = {
//     cart: {
//         cartItems: cartItemsFromStorage,
//         shippingAddress: shippingAddressFromStorage,
//     },
//     userLogin: { userInfo: userInfoFromStorage },
// }

// const middleware = [thunk]

// const store = createStore(reducer, initialState,
//     composeWithDevTools(applyMiddleware(...middleware)))

// export default store