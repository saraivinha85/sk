import React from 'react'
import { connect } from 'react-redux'
import ContainerDimensions from 'react-container-dimensions'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'

import { Transition, config } from 'react-spring'

import Hand from './Hand'
import Card from './Card'
import { placeBet } from '../actions/round'
import PlayersHand from './PlayersHand'

class Table extends React.Component {
    renderCenterCards = () => {
        return this.props.table.filter((c) => c !== null).map(c =>
            <Grid key={c} item>
                <Card id={c} disabled />
            </Grid>
        )
    }

    renderBets = () => {
        const { hand, classes } = this.props
        return [...Array(hand.length + 1).keys()].map((t) => {
            return <Avatar className={classes.bet} onClick={() => { this.handleBet(t) }}>{`${t}`}</Avatar>
        })
    }

    handleBet = (bet) => {
        this.props.placeBet(bet)
    }

    render() {
        const { classes, hasBet, table, players, playerId, currentPlayer, bet, tricks } = this.props
        const bets = this.renderBets()
        const playerIdx = players.findIndex(p=>p.id===playerId)
        const trickCount = tricks[playerIdx] || 0
        //const playedCards = this.renderCenterCards()
        const from = currentPlayer === null? { transform: 'translate3d(0,100%,0) rotateZ(360deg)', opacity: 0.5, config: config.slow } : { transform: 'translate3d(0,-100%,0) rotateZ(360deg)', opacity: 0.5, config: config.slow }
        return (
            <div className={classes.root}>
                <ContainerDimensions>
                    <PlayersHand />
                </ContainerDimensions>
                <div className={classes.centerCards}>
                    <Transition
                        items={this.props.table.filter((c) => c !== null)} keys={item => item}
                        from={from}
                        enter={{ transform: 'translate3d(0,0px,0) rotateZ(0deg)', opacity: 1, config: config.default }}
                        leave={{ opacity: 0 }}>
                        {item => props =>
                        <div style={props}><Card id={item} disabled/></div>
                    }
                </Transition>
            </div>
            {bet === null &&
            <div className={classes.betsContainer}>
                <h1>Place your bet</h1>
                <div className={classes.bets}>
                    {bets}
                </div>
            </div>}
            <div className={classes.hand}>
                {bet!== null && <Badge color="primary" badgeContent={`${trickCount}/${bet}`}></Badge>}
                <Hand />
            </div>
        </div>
        )
    }
}

const styles = {
    root: {
        height: '87vh',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
    },
    hand: {
        bottom: '0px',
        position: 'absolute',
        width: '100%'
    },
    betsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        display: 'flex'
    },
    info: {
        bottom: '9em',
        position: 'absolute'
    },
    bets: {
        display: 'inline-flex',
        flexWrap: 'wrap',
        //alignItems: 'center',
        alignSelf: 'center',
        //maxWidth: '50%',
        //justifyContent: 'center'
    },
    centerCards: {
        display: 'inline-flex',
        alignItems: 'center'
    },
    bet: {
        backgroundColor: '#0000002b',
        width: '60px',
        height: '60px',
        margin: '3px',
        border: '1px solid gold'
    }
}

const mapStateToProps = (state) => {
    return {
        playerId: state.game.id,
        hand: state.hand.cards,
        table: state.round.cards,
        players: state.game.players,
        currentPlayer: state.round.currentPlayer,
        bet: state.round.bet,
        tricks: state.round.tricks
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        placeBet: (bet) => { dispatch(placeBet(bet)) },
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Table))
