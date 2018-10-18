import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

import { playCard } from '../actions/round'
import cards from '../cards'

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
        const { playCard, id, disabled, canPlayCard, token } = this.props
        if (!disabled && canPlayCard) {
            playCard(id, token)
        }
    }

    render() {
        const { classes, id } = this.props
        return (
            <Paper
                className={classes.paper}
                onMouseEnter={this.handleOnHover}
                onMouseLeave={this.handleOnLeave}
                onMouseUp={this.handleCardSelection}
                elevation={this.state.elevation}
            >
                <div className={classes.cardContainer}>
                    <img className={classes.background} src={cards[id].assets[0]} />
                    {cards[id].assets.length === 2 &&
                        <div>
                            <img className={classes.topLeftNumber} src={cards[id].assets[1]} />
                            <img className={classes.topRightNumber} src={cards[id].assets[1]} />
                            <img className={classes.bottomLeftNumber} src={cards[id].assets[1]} />
                            <img className={classes.bottomRightNumber} src={cards[id].assets[1]} />
                        </div>
                    }
                    {cards[id].assets.length === 3 &&
                        <div>
                            <img className={classes.badges} src={cards[id].assets[1]} />
                            <img className={classes.badges} src={cards[id].assets[2]} />
                        </div>
                    }
                </div>
            </Paper>
        )
    }
}

const styles = theme => ({
    paper: {
        height: 140,
        width: 90,
        color: 'black',
        backgroundColor: 'transparent',
        borderRadius: '15px',
    },
    cardContainer: {
        position: 'relative',
        height: '140px',
        width: '90px'
    },
    background: {
        borderRadius: '15px',
        width: '100%',
        height: '100%'
    },
    topRightNumber: {
        position: 'absolute',
        right: '-3%',
        top: '-2%',
        width: '36%',
        maxWidth: '40%'
    },
    bottomRightNumber: {
        position: 'absolute',
        right: '-3%',
        bottom: '-2%',
        width: '36%',
        maxWidth: '40%'
    },
    topLeftNumber: {
        position: 'absolute',
        left: '-2%',
        top: '-2%',
        width: '36%',
        maxWidth: '40%'
    },
    bottomLeftNumber: {
        position: 'absolute',
        left: '-2%',
        bottom: '-2%',
        width: '36%',
        maxWidth: '40%'
    },
})

const mapStateToProps = (state) => {
    return {
        canPlayCard: state.round.canPlay,
        token: state.round.token,
        assets: state.game.assets
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        playCard: (card, token) => { dispatch(playCard(card, token)) },
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Card))
