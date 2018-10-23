import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Badge from '@material-ui/core/Badge'

import { toggleChatWindow, toggleScoreWindow  } from '../actions/game'

class Toolbar extends Component {

    handleToggleChatWindow = () => {
        const { toggleChatWindow } = this.props
        toggleChatWindow()
    }

    handleToggleScoreWindow = () => {
        const { toggleScoreWindow } = this.props
        toggleScoreWindow()
    }

    render() {
        const { classes, player, chatBadge } = this.props
        const { name, photo } = player || {}

        return (
            <div className={classes.root}>
                <Badge color="primary" badgeContent={chatBadge} className={classes.chatBadge}>
                    <StyledButton variant="outlined" size="small" color="primary" className={classes.button} onClick={this.handleToggleChatWindow}>
                        Chat
                    </StyledButton>
                </Badge>
                <StyledButton variant="outlined" size="small" color="primary" className={classes.button} onClick={this.handleToggleScoreWindow}>
                    Score 
                </StyledButton>
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

const styles = theme => ({
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
    },
    chatBadge: {
        margin: {
            margin: theme.spacing.unit * 2,
        },
    },
    badgeVisible: {
        badge: {
            visibility: 'visible'
        }
    },
    badgeHidden: {
        badge: {
            visibility: 'hidden',
            display: 'none'
        }
    }


})

const StyledButton = withStyles(theme => ({
    outlinedPrimary: {
        border: '1px solid #2ecc4078',
    },
    label: {
        color: '#2ECC40'
    }
}))(Button)

const mapStateToProps = (state) => {
    return {
        player: state.game.players.find((p) => p.id === state.game.id),
        chatBadge: state.game.chatBadge
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleChatWindow: () => { dispatch(toggleChatWindow()) },
        toggleScoreWindow: () => { dispatch(toggleScoreWindow()) },
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Toolbar))
