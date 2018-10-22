import {PLAY_CARD} from '../actions/round'

const INITIAL_STATE = {
    cards: []
}

const hand = (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case "DEAL_CARDS":
            return {...state, cards: action.payload}
        case PLAY_CARD:
            const card = action.payload.id === 66? 6 : action.payload.id
            return {...state, cards: state.cards.filter( c => c !== card )}
        default:
            return state
    }
}

export default hand
