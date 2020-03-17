import React, { Component } from 'react'
import {connect} from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import ListSubheader from '@material-ui/core/ListSubheader'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import PersonAdd from '@material-ui/icons/PersonAdd'

import {joinQueue, startGame} from '../actions/game'

class Queue extends Component {

    handleDelete = (e) => {
        console.log(e)
    }

    createChips = () => {
        const {players, classes} = this.props

        return players.map((p) => {
            return <StyledChip
                key={p.id}
                avatar={<Avatar className={classes.bigAvatar} src={p.photo.replace('sz=50','sz=100')} />}
                label={p.name}
                onDelete={this.handleDelete}
                className={classes.chip}
            />
        })
    }

    handleJoinQueue = (e) => {
        const {joinQueue, id} = this.props
        joinQueue(id)
    }

    handleStartGame = (e) => {
        const {startGame} = this.props
        startGame()
    }

    render() {
        const {classes, isJoined, players, id} = this.props
        const playerChips = this.createChips()
        const isFirst =  players.length != 0? players[0].id === id : false

        return (
            <StyledPaper>
                <ListSubheader className={classes.subheader} component="div">Queue</ListSubheader>
                <div className={classes.root}>
                    {playerChips}
                </div>
                <Button variant="outlined" color="primary" disabled={isJoined} className={classes.button} onClick={this.handleJoinQueue}>
                    <PersonAdd />
                </Button>
                { isFirst && <Button color="primary" variant='contained' disabled={!isJoined} className={classes.button} onClick={this.handleStartGame}>
                    Start
                </Button>}
            </StyledPaper>
        )
    }
}

const StyledPaper = withStyles({
    root: {
        backgroundColor: '#2f2f2fbd',
        color: '#ffffff9c',
        overflow: 'hidden'
    }
})(Paper)

const StyledChip = withStyles({
    root: {
        backgroundColor: '#00000042',
        color: 'unset',
    },
    deleteIcon: {
        color: 'unset'
    }
})(Chip)

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    subheader: {
        backgroundColor: 'transparent'
    },
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginLeft: theme.spacing(1),
    },
    chip: {
        margin: theme.spacing(1),
    },
    bigAvatar: {
    },
})

const mapStateToProps = (state) => {
    return {
        id: state.game.id,
        isJoined: state.game.players.find((p) => {return p.id === state.game.id}) !== undefined,
        players: state.game.players
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        joinQueue: (id) => {dispatch(joinQueue(id))},
        startGame: () => {dispatch(startGame())},
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Queue))
