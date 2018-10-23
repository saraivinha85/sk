export const START_GAME = "server/START_GAME"
export const startGame = () => {
    return {
        type: START_GAME,
    }
}

export const JOIN_QUEUE = "server/JOIN_QUEUE"
export const joinQueue = (id) => {
    return {
        type: JOIN_QUEUE,
        payload: id
    }
}

export const SUBMIT_COMMENT = "server/SUBMIT_COMMENT"
export const submitComment = (comment) => {
    return {
        type: SUBMIT_COMMENT,
        payload: comment
    }
}

export const TOGGLE_CHAT_WINDOW = "TOGGLE_CHAT_WINDOW"
export const toggleChatWindow = () => {
    return {
        type: TOGGLE_CHAT_WINDOW
    }
}

export const TOGGLE_SCORE_WINDOW = "TOGGLE_SCORE_WINDOW"
export const toggleScoreWindow = () => {
    return {
        type: TOGGLE_SCORE_WINDOW
    }
}

