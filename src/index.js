import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import { withRouter } from 'react-router-dom'

import io from 'socket.io-client'
import createSocketIOMiddleware from 'redux-socket.io'

import logger from 'redux-logger'

import GameOptions from './components/GameOptions'
import GameQueue from './components/Queue'
import Players from './components/Players'
import Deck from './components/Deck'
import Table from './components/Table'
import reducers from './reducers'
import registerServiceWorker from './registerServiceWorker'


const socket = io("http://localhost:3001") 

socket.on('error', (reason) => {
	//if (reason === '404') {
		//this.props.history
	//}
})


const socketIOMiddleware = createSocketIOMiddleware(socket, "server/")
const store = applyMiddleware(logger, socketIOMiddleware)(createStore)(reducers)

ReactDOM.render(
    <Provider store={store}>
        <div>
            <div style={{display: 'flex'}}>
                <Players/>
                <GameQueue/>
            </div>
            <GameOptions/>
            <Deck/>
            <Table/>
        </div>
    </Provider>,
    document.querySelector('#root')
)

//registerServiceWorker()
