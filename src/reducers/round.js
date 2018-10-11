import { PLAY_CARD } from '../actions/card'
import { PLACE_BET } from '../actions/round'

const INITIAL_STATE = {
    cards: [],
    bets: [],
    index: null,
    token: null
}

const round = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PLACE_BET:
            return { ...state, bets: [...state.bets, action.payload] }
        case 'BETS_IN_PLACE':
            return { ...state, bets: action.payload }
        case 'ROUND_STARTED':
            return { ...state, index: action.payload }
        case 'PLAY':
            return { ...state, canPlay: true, token: action.payload }
        case 'WAIT_PLAY':
            return { ...state, canPlay: false, token: null }
        case 'CARD_PLAYED':
            return { ...state, cards: action.payload }
        default:
            return state
    }
}

export default round 
