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

export default connect(mapStateToProps, mapDispatchToProps)(GameOptions)
