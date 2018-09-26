import React, { Component } from 'react'
import { connect } from 'react-redux'

import {start} from '../actions/game'

class GameOptions extends Component {
    handleStart = () => {
        this.props.start()
    }

    render() {
        const {leader, round} = this.props
        return (
            <div>
                { leader && <button onClick={this.handleStart}>Start</button> }
                { round > 0 && <h3>Round {round}</h3> }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        round: state.deck.cards.length,
        leader: state.game.leader === state.game.id 
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        start: () => {dispatch(start())},       
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameOptions)
