import { PLACE_BET, PLAY_CARD } from '../actions/round'

const INITIAL_STATE = {
    cards: [],
    bets: [],
    index: null,
    set: null,
    token: null,
    bet: null,
    score: []
}

const round = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PLAY_CARD:
            return { ...state, canPlay: false }
        case PLACE_BET:
            return { ...state, bet: action.payload }
        case 'BETS_IN_PLACE':
            return { ...state, bets: action.payload }
        case 'ROUND_STARTED':
            return { ...state, index: action.payload, cards: [], bets: [], bet: null, token: null, canPlay: false }
        case 'SET_STARTED':
            return { ...state, set: action.payload }
        case 'SET_ENDED':
            return { ...state, cards: [] }
        case 'PLAY':
            return { ...state, canPlay: true, token: action.payload, currentPlayer: null }
        case 'WAIT_PLAY':
            return { ...state, canPlay: false, token: null, currentPlayer: action.payload }
        case 'CARD_PLAYED':
            return { ...state, cards: action.payload }
        case 'SCORE':
            return { ...state, score: [...state.score, action.payload] }
        default:
            return state
    }
}

export default round 
