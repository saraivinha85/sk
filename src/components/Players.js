import React from 'react'
import {connect} from 'react-redux'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import ImageIcon from '@material-ui/icons/Image'
import { withStyles } from '@material-ui/core/styles'

class Players extends React.Component {
	render() {
		const { classes, players } = this.props;
		return (
			<div className={classes.root}>
				<List>
					{renderPlayers(players)}					
				</List>
			</div>
		)
	}
}

const renderPlayers = (players) => {
	return players.map((player) =>	{
		return <ListItem>
			<Avatar>
				<ImageIcon />
			</Avatar>
			<ListItemText primary={player} secondary="" />
		</ListItem>
	})
}

const styles = theme => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
	},
})

const mapStateToProps = (state) => {
	return {
		players: state.game.players
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch
	}
}


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Players))
