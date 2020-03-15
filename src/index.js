import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import { withRouter } from 'react-router-dom'

import io from 'socket.io-client'
import createSocketIOMiddleware from 'redux-socket.io'

import { SnackbarProvider } from 'notistack'

import logger from 'redux-logger'

import './index.css'
import Layout from './components/Layout'
import reducers from './reducers'
import registerServiceWorker from './registerServiceWorker'


const socket = io("/") 

socket.on('error', (reason) => {
	//if (reason === '404') {
		//this.props.history
	//}
})


const socketIOMiddleware = createSocketIOMiddleware(socket, "server/")
const store = applyMiddleware(logger, socketIOMiddleware)(createStore)(reducers)

ReactDOM.render(
    <Provider store={store}>
        <SnackbarProvider>
            <Layout />
        </SnackbarProvider>
    </Provider>,
    document.querySelector('#root')
)

//registerServiceWorker()
