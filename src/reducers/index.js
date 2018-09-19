import {combineReducers} from 'redux'

import deck from './deck'
import round from './round'
import game from './game'

export default combineReducers({
    game,
    deck,
    round
})
