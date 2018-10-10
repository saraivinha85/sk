export const START = "server/START_ROUND"
export const start = () => {
    return {
        type: START,
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

