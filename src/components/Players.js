import React from 'react'
import {connect} from 'react-redux'

import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import ImageIcon from '@material-ui/icons/Image'
import ListSubheader from '@material-ui/core/ListSubheader'
import { withStyles } from '@material-ui/core/styles'

class Players extends React.Component {
	render() {
		const { classes, players, leader } = this.props;
        return (
            <div className={classes.root}>
                <Paper elevation={1}>
                    <List
                        subheader={<ListSubheader component="div">Online</ListSubheader>}     
                    >
                        {renderPlayers(players, leader)}					
                    </List>
                </Paper>
            </div>
        )
    }
}

const renderPlayers = (players, leader) => {
    return players.map((player, index) =>	{
        return <ListItem key={player.id}>
            <Avatar
                src={player.photo}
            />
            <ListItemText primary={player.name} secondary={leader === player.id? 'Leader': ''} />
        </ListItem>
    })
}

const styles = theme => ({
    root: {
        //width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
})

const mapStateToProps = (state) => {
    return {
        players: state.game.players,
        leader: state.game.leader
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
}


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Players))
