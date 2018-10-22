import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'

class Toolbar extends Component {
    render() {
        const { classes, player } = this.props
        const { name, photo } = player || {}

        return (
            <div className={classes.root}>
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
        display: 'flex'
    },
    user: {
        display: 'inline-flex',
        alignItems: 'center'
    },
    avatar: {
        marginRight: '15px',
        width: '26px',
        height: '26px'
    },
	name: {
		color: '#ffffff9c'
	}
}

const mapStateToProps = (state) => {
    return {
        player: state.game.players.find((p)=>p.id===state.game.id),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Toolbar))
