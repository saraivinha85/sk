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
        const {classes, id} = this.props
        return (
            <Paper
                className={classes.paper}
                onMouseEnter={this.handleOnHover}
                onMouseLeave={this.handleOnLeave}
                onMouseUp={this.handleCardSelection}
                elevation={this.state.elevation}
            >
                <img style={{width: '100%', height: '100%'}} src={`/assets/${id}.png`}/>
            </Paper>
        )
    }
}

const styles = theme => ({
    paper: {
        height: 140,
        width: 90,
        color: 'black',
        backgroundColor: 'transparent'
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
