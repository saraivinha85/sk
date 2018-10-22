const INITIAL_STATE = {
    players: [],
    queue: [],
    comments: [],
    started: false,
    isChatOpen: false
}

const game = (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case 'USER_JOIN':
        case 'USER_LEFT':
            return {...state, players: action.payload.players, leader: action.payload.leader}
        case 'USER_WELCOME':
            return {...state, id: action.payload}
        case 'PLAYER_JOIN':
            return {...state, queue: action.payload}
        case 'ROUND_STARTED':
            return {...state, started: true}
        case 'GAME_ENDED':
            return {...state, started: false}
        case 'NEW_COMMENT':
            return {...state, comments: [action.payload, ...state.comments]}
        case 'OPEN_CHAT':
            return {...state, isChatOpen: !state.isChatOpen}
        default:
            return state
    }
}

export default game 
