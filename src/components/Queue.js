import React, { Component } from 'react'
import {connect} from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import ListSubheader from '@material-ui/core/ListSubheader'
import Button from '@material-ui/core/Button'

import PersonAdd from '@material-ui/icons/PersonAdd'

import {joinQueue} from '../actions/game'

class Queue extends Component {

    handleDelete = (e) => {
        console.log(e)
    }

    createChips = () => {
        const {players, classes} = this.props

        return players.map((p) => {
            return <Chip
                key={p.id}
                avatar={<Avatar src={p.photo} />}
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

    render() {
        const {classes, isJoined} = this.props

        const players = this.createChips()

        return (
            <div>
                {/* <Paper elevation={1}> */}
                    <ListSubheader component="div">Queue</ListSubheader>
                    <div className={classes.root}>
                        {players}
                    </div>
                    <Button variant="contained" color="primary" disabled={isJoined} className={classes.button} onClick={this.handleJoinQueue}>
                        Join queue
                        <PersonAdd className={classes.leftIcon} />
                    </Button>
                {/* </Paper> */}
            </div>
        )
    }
}

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
    },
})

const mapStateToProps = (state) => {
    return {
        id: state.game.id,
        isJoined: state.game.queue.find((p) => {return p.id === state.game.id}) !== undefined,
        players: state.game.queue
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        joinQueue: (id) => {dispatch(joinQueue(id))},
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Queue))
