import {PLAY_CARD} from '../actions/card'

const INITIAL_STATE = {
    cards: [],
    id: 1
}

const round = (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case PLAY_CARD:
            return {...state, cards: [...state.cards, action.payload]}
        default:
            return state
    }
}

export default round 
