import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import ListSubheader from '@material-ui/core/ListSubheader'
import InputAdornment from '@material-ui/core/InputAdornment'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

import { submitComment } from '../actions/game'

class Chat extends Component {
    state = {
        multiline: ''
    }

    handleChange = (e) => {
        this.setState({
            multiline: e.target.value
        })
    }

    submitComment = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            this.props.submitComment(e.target.value)
            e.target.value = ''
        }
    }

    renderComments = () => {
        return this.props.comments.map(row => {
            return (
                <TableRow key={row.ts}>
                    <TableCell component="th" scope="row">
                        {row.from}
                    </TableCell>
                    <TableCell>{row.text}</TableCell>
                </TableRow>
            )
        })
    }

    render() {
        const { classes } = this.props

        return (
            <div>
                <ListSubheader component="div">Chat</ListSubheader>
                <Table className={classes.table}>
                    <TableBody>
                        {this.renderComments()}
                    </TableBody>
                </Table>
                <TextField
                    id="standard-full-width"
                    label="Comment"
                    fullWidth
                    //style={{ margin: 8 }}
                    //margin="normal"
                    variant='filled'
                    // InputProps={{
                    //     startAdornment: <InputAdornment variant='filled' position="start">></InputAdornment>
                    // }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onKeyPress={this.submitComment}
                />
            </div>
        )
    }
}

const styles = {

}

const mapStateToProps = (state) => {
    return {
        comments: state.game.comments
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        submitComment: (c) => { dispatch(submitComment(c)) }
    }
}

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat))