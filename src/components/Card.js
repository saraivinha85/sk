import React from 'react'
import {connect} from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

import {playCard} from '../actions/round'

class Card extends React.Component {
    state = {
        elevation: 5
    }

    handleOnHover = () => {
        this.setState({
            elevation: 10
        })
    }

    handleOnLeave = () => {
        this.setState({
            elevation: 5 
        })
    }

    handleCardSelection = () => {
        const {playCard, id, disabled, canPlayCard, token} = this.props
        if (!disabled && canPlayCard) {
            playCard(id, token)
        }
    }

    render() {
        return (
            <Paper
                className={this.props.classes.paper}
                onMouseEnter={this.handleOnHover}
                onMouseLeave={this.handleOnLeave}
                onMouseUp={this.handleCardSelection}
                elevation={this.state.elevation}
            >
                {this.props.id}
            </Paper>
        )
    }
}

const styles = theme => ({
    paper: {
        height: 70,
        width: 50,
        color: 'black'
    }
})

const mapStateToProps = (state) => {
    return {
        canPlayCard: state.round.canPlay,
        token: state.round.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        playCard: (card, token) => {dispatch(playCard(card, token))},
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Card))
