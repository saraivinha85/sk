import React, { Component } from 'react'
import { connect } from 'react-redux'

import Queue from './Queue'
import Chat from './Chat'

class Lobby extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Queue />
                <div style={{paddingTop: '15px'}}/>
                <Chat />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
}

export default connect(mapStateToProps)(Lobby)
