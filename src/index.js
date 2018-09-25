import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'

import io from 'socket.io-client'
import createSocketIOMiddleware from 'redux-socket.io'

import logger from 'redux-logger'

import GameOptions from './components/GameOptions'
import Players from './components/Players'
import Deck from './components/Deck'
import Table from './components/Table'
import reducers from './reducers'
import registerServiceWorker from './registerServiceWorker'


const socket = io("http://localhost:3001") 
socket.on('connect', (reason) => {
    console.log(reason)
})
socket.on('disconnect', (reason) => {
    console.log(reason)
})
socket.on('error', (reason) => {
    console.log(reason)
})
socket.on('connect_error', (reason) => {
    console.log(reason)
})
socket.on('connect_timeout', (reason) => {
    console.log(reason)
})

const socketIOMiddleware = createSocketIOMiddleware(socket, "server/")
const store = applyMiddleware(logger, socketIOMiddleware)(createStore)(reducers)

ReactDOM.render(
    <Provider store={store}>
        <div>
			<Players/>
            <GameOptions/>
            <Deck/>
            <Table/>
        </div>
    </Provider>,
    document.querySelector('#root')
)

//registerServiceWorker()
