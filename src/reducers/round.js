import { PLACE_BET, PLAY_CARD } from '../actions/round'

const INITIAL_STATE = {
    cards: [],
    bets: [],
    index: null,
    set: null,
    token: null,
    bet: null,
    score: [],
    tricks: []
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
            return { ...state, index: action.payload, cards: [], bets: [], tricks: [], bet: null, token: null, canPlay: false, score: action.payload === 0? [] : state.score }
        case 'SET_STARTED':
            return { ...state, set: action.payload }
        case 'SET_ENDED':
            return { ...state, cards: [], tricks: action.payload.tricks }
        case 'PLAY':
            return { ...state, canPlay: true, token: action.payload, currentPlayer: null }
        case 'WAIT_PLAY':
            return { ...state, canPlay: false, token: null, currentPlayer: action.payload }
        case 'CARD_PLAYED':
            return { ...state, cards: action.payload }
        case 'ROUND_ENDED':
            return { ...state, score: [...state.score, action.payload.score], currentPlayer: action.payload.currentPlayer }
        case 'FINISH':
            return { ...state }
        default:
            return state
    }
}

export default round 
