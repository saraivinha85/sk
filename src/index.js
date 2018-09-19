import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'

import io from 'socket.io-client'
import createSocketIOMiddleware from 'redux-socket.io'

import logger from 'redux-logger'

import Players from './components/Players'
import Deck from './components/Deck'
import Table from './components/Table'
import reducers from './reducers'
import registerServiceWorker from './registerServiceWorker'


const socket = io("http://localhost:3001") 
const socketIOMiddleware = createSocketIOMiddleware(socket, "server/")
const store = applyMiddleware(logger, socketIOMiddleware)(createStore)(reducers)

ReactDOM.render(
    <Provider store={store}>
        <div>
			<Players/>
            <Deck/>
            <Table/>
        </div>
    </Provider>,
    document.querySelector('#root')
)

registerServiceWorker()
