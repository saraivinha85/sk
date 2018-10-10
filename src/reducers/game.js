const INITIAL_STATE = {
    players: [],
    queue: []
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
        default:
            return state
    }
}

export default game 
