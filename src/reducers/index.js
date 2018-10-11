import {combineReducers} from 'redux'

import hand from './hand'
import round from './round'
import game from './game'

export default combineReducers({
    game,
    hand,
    round
})
