import {PLAY_CARD} from '../actions/card'

const INITIAL_STATE = {
    cards: [],
    bets: []
}

const round = (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case PLAY_CARD:
            return {...state, cards: [...state.cards, action.payload]}
        case 'BETS_IN_PLACE':
            return {...state, bets: action.payload}
        default:
            return state
    }
}

export default round 
