import React, { Component } from 'react'
import {connect} from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import ListSubheader from '@material-ui/core/ListSubheader'
import Button from '@material-ui/core/Button'

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
        const {classes, isJoined} = this.props

        const players = this.createChips()

        return (
            <div>
                <ListSubheader component="div">Queue</ListSubheader>
                <div className={classes.root}>
                    {players}
                </div>
                <Button variant="fab" color="primary" disabled={isJoined} className={classes.button} onClick={this.handleJoinQueue}>
                    <PersonAdd />
                </Button>
                <Button color="primary" variant='contained' disabled={!isJoined} className={classes.button} onClick={this.handleStartGame}>
                    Start
                </Button>
            </div>
        )
    }
}

const StyledChip = withStyles({
    root: {
        marginTop: 0,
        marginBottom: 0,
        backgroundColor: '#00000042',
        color: 'unset',
    },
    deleteIcon: {
        margin: '0px',
        color: 'unset'
    }
})(Chip)

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    button: {
        margin: theme.spacing.unit,
    },
    leftIcon: {
        marginLeft: theme.spacing.unit,
    },
    chip: {
        margin: theme.spacing.unit,
        display: 'inline-table',
    },
    bigAvatar: {
        width: 70,
        height: 70,
        display: 'inline-flex',
        marginRight: '0px',
        marginTop: '7px'
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
