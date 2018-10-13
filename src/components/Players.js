import React from 'react'
import {connect} from 'react-redux'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import ListSubheader from '@material-ui/core/ListSubheader'
import { withStyles } from '@material-ui/core/styles'

class Players extends React.Component {
    renderPlayers = () => {
        const {classes, players} = this.props
        return players.map((player, index) =>	{
            return <ListItem key={player.id}>
                <Avatar
                    src={player.photo}
                />
                <ListItemText primaryTypographyProps={{className: classes.itemText}} primary={player.name} />
            </ListItem>
        })
    }

	render() {
		const { classes, players, leader } = this.props;
        return (
            <div className={classes.root}>
                {/* <Paper elevation={1}> */}
                    <List
                        subheader={<ListSubheader className={classes.header} component="div">Online</ListSubheader>}     
                    >
                        {this.renderPlayers()}					
                    </List>
                {/* </Paper> */}
            </div>
        )
    }
}

const styles = {
    root: {
        //width: '100%',
        // maxWidth: 360,
        //backgroundColor: theme.palette.background.paper,
    },
    header: {
        color: '#ffffff9c'
    },
    itemText: {
        color: '#ffffff9c'
    }
}

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
