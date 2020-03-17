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
        const { classes, player, chatBadge, isGameStarted } = this.props
        const { name, photo } = player || {}

        return (
            <div className={classes.root}>
                <Badge style={{visibility: isGameStarted? 'show': 'hidden' }} color="secondary" badgeContent={chatBadge} className={classes.chatBadge}>
                    <StyledButton style={{visibility: isGameStarted? 'show': 'hidden' }} variant="outlined" size="small" className={classes.button} onClick={this.handleToggleChatWindow}>
                        Chat
                    </StyledButton>
                </Badge>
                <StyledButton style={{visibility: isGameStarted? 'show': 'hidden' }} variant="outlined" size="small" className={classes.button} onClick={this.handleToggleScoreWindow}>
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
        )
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
    },
    chatBadge: {
        margin: {
            margin: theme.spacing(2),
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
    outlined: {
        border: '1px solid #ffd7008c',
        '&:hover': {
            border: '1px solid gold'
        }
    },
    label: {
        color: '#ffffff9c'
    }
}))(Button)

const mapStateToProps = (state) => {
    return {
        player: state.game.players.find((p) => p.id === state.game.id),
        chatBadge: state.game.chatBadge,
        isGameStarted: state.game.isGameStarted
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
