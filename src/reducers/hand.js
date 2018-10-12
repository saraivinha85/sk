import {PLAY_CARD} from '../actions/round'

const INITIAL_STATE = {
    cards: []
}

const hand = (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case "DEAL_CARDS":
            return {...state, cards: action.payload}
        case PLAY_CARD:
            return {...state, cards: state.cards.filter( c => c !== action.payload.id )}
        default:
            return state
    }
}

export default hand
