import { PLACE_BET } from '../actions/round'

const INITIAL_STATE = {
    cards: [],
    bets: [],
    index: null,
    set: null,
    token: null,
    score: []
}

const round = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PLACE_BET:
            return { ...state, bets: [...state.bets, action.payload] }
        case 'BETS_IN_PLACE':
            return { ...state, bets: action.payload }
        case 'ROUND_STARTED':
            return { ...state, index: action.payload, cards: [], bets: [], token: null, canPlay: false }
        case 'SET_STARTED':
            return { ...state, set: action.payload }
        case 'SET_ENDED':
            return { ...state, cards: [] }
        case 'PLAY':
            return { ...state, canPlay: true, token: action.payload }
        case 'WAIT_PLAY':
            return { ...state, canPlay: false, token: null }
        case 'CARD_PLAYED':
            return { ...state, cards: action.payload }
        case 'SCORE':
            return { ...state, score: [...state.score, action.payload] }
        default:
            return state
    }
}

export default round 
