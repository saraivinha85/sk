const INITIAL_STATE = {
    players: [],
    queue: [],
    comments: [],
    started: false,
    isChatOpen: false,
    isScoreOpen: false,
    chatBadge: 0
}

const game = (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case 'USER_JOIN':
        case 'USER_LEFT':
            return {...state, users: action.payload}
        case 'USER_WELCOME':
            return {...state, id: action.payload}
        case 'PLAYER_JOIN':
            return {...state, players: action.payload}
        case 'ROUND_STARTED':
            return {...state, started: true}
        case 'FINISH':
            return {...state, started: false, isScoreOpen: true}
        case 'NEW_COMMENT':
            return {...state, comments: [...state.comments, action.payload ], chatBadge: state.isChatOpen? 0 : state.chatBadge + 1 }
        case 'TOGGLE_CHAT_WINDOW':
            return {...state, isChatOpen: !state.isChatOpen, chatBadge: 0 }
        case 'TOGGLE_SCORE_WINDOW':
            return {...state, isScoreOpen: !state.isScoreOpen}
        case 'ERROR':
            return {...state, error: action.payload}
        default:
            return state
    }
}

export default game 
