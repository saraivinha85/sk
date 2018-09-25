import React, { Component } from 'react'
import { connect } from 'react-redux'

class GameOptions extends Component {
    handleStart = () => {
        this.props.start()
    }

    render() {
        return (
            <div>
                <button onClick={this.handleStart}>Start</button> 
            </div>
        )
    }
}

const mapStateToProps = (state) => {
}

const mapDispatchToProps = (dispatch) => {
    return {
        start: () => {dispatch()},
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameOptions)
