const INITIAL_STATE = {
    players: [],
}

const game = (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case 'PLAYER_JOIN':
        case 'PLAYER_LEFT':
            return {...state, players: action.payload.players, leader: action.payload.leader}
        case 'WELCOME_PLAYER':
            return {...state, id: action.payload}
        default:
            return state
    }
}

export default game 
