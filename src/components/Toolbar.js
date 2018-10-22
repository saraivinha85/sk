import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'

import { toggleChatWindow } from '../actions/game'

class Toolbar extends Component {

    handleToggleChatWindow = () => {
        const { toggleChatWindow } = this.props
        toggleChatWindow()
    }

    render() {
        const { classes, player } = this.props
        const { name, photo } = player || {}

        return (
            <div className={classes.root}>
                <Button variant="outlined" size="small" color="primary" className={classes.button} onClick={this.handleToggleChatWindow}>
                    Chat
                </Button>
                <div className={classes.user}>
                    <Avatar
                        className={classes.avatar}
                        src={photo}
                    />
                    <Typography className={classes.name} variant="subtitle2">
                        {name}
                    </Typography>
                </div>
            </div>
        );
    }
}

const styles = {
    root: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    user: {
        display: 'inline-flex',
        alignItems: 'center'
    },
    right: {
        alignItems: 'flex-end',
        flexDirection: 'column'
    },
    avatar: {
        marginRight: '15px',
        width: '26px',
        height: '26px'
    },
    name: {
        color: '#ffffff9c'
    },
    button: {
        zIndex: 5000
    }
}

const mapStateToProps = (state) => {
    return {
        player: state.game.players.find((p) => p.id === state.game.id),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleChatWindow: () => { dispatch(toggleChatWindow()) },
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Toolbar))
