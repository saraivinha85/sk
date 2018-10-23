import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Dialog from '@material-ui/core/Dialog'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Avatar from '@material-ui/core/Avatar'

import Players from './Players'
import { toggleScoreWindow } from '../actions/game'

class ScoreWindow extends React.Component {
    handleClose = () => {
        const { toggleScoreWindow } = this.props
        toggleScoreWindow()
    }

    renderPlayersName = () => {
        const { classes, players } = this.props
        return players.map((p)=>{
            return <TableCell key={`name_${p.id}`}>
                <div className={classes.player}>
                    <Avatar className={classes.avatar} src={p.photo} />
                    {p.name}
                </div>
            </TableCell>
        })
    }

    renderRows = () => {
        const {classes} = this.props

        return Array.from(Array(10).keys()).map((r, idx) => {
            return <TableRow className={classes.row} key={idx}>
                <StyledTableCell numeric component="th" scope="row">
                    {idx + 1}
                </StyledTableCell>
                {this.renderScoreForRound(idx)}
            </TableRow>
        })
    }

    renderScoreForRound = (idx) => {
        const {players} = this.props
        return players.map((p) => {
            return <StyledTableCell key={`score_${p.id}`} numeric>
                {0}
            </StyledTableCell>
        })
    }

    render() {
        const { classes, isOpen, children, ...other } = this.props	

        return (
            <Dialog open={isOpen} onClose={this.handleClose} aria-labelledby="score-dialog">
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Round</TableCell>
                            {this.renderPlayersName()}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.renderRows()}
                    </TableBody>
                </Table>
            </Dialog>
        )}
}

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell)

const styles = theme => ({
    root: {
        backgroundColor: '#ffffff00',
    },
    paper: {
        height: '100%',
        textAlign: 'center'
    },
    table: {
    },
    row: {
        alignText: 'center',
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        }
    },
    avatar: {
        height: '22px',
        width: '22px',
    },
    player: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
    }
})

const mapStateToProps = (state) => {
    return {
        isOpen: state.game.isScoreOpen,
        players: state.game.players
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleScoreWindow: () => { dispatch(toggleScoreWindow()) },
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ScoreWindow))
