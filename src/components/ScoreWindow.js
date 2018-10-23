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

import { toggleScoreWindow } from '../actions/game'

class ScoreWindow extends React.Component {
    handleClose = () => {
        const { toggleScoreWindow } = this.props
        toggleScoreWindow()
    }

    renderPlayersName = () => {
        const { classes, players } = this.props
        return players.map((p) => {
            return <TableCell key={`name_${p.id}`}>
                <div className={classes.player}>
                    <Avatar className={classes.avatar} src={p.photo} />
                    {p.name}
                </div>
            </TableCell>
        })
    }

    renderRows = () => {
        const { classes, score } = this.props

        return score.map((s, idx) => {
            return <TableRow className={classes.row} key={idx}>
                <StyledTableCell numeric component="th" scope="row">
                    {idx + 1}
                </StyledTableCell>
                {this.renderScoreForRound(idx)}
            </TableRow>
        })
    }

    renderTotalScore = () => {
        const { classes, score } = this.props
        const totals = score.reduce((r, a) => a.map((b, i) => (r[i] || 0) + b), [])
        return totals.map((s, i) => {
            return <StyledTableCell key={`totalscore_${i}`} numeric>
                {s}
            </StyledTableCell>
        })
    }

    renderScoreForRound = (idx) => {
        const { score } = this.props
        const roundScore = score[idx]

        return roundScore.map((s, i) => {
            return <StyledTableCell key={`score_${idx}_${i}`} numeric>
                {s}
            </StyledTableCell>
        })
    }

    render() {
        const { classes, isOpen, children, ...other } = this.props

        return (
            <Dialog PaperProps={{ className: classes.paper }} open={isOpen} onClose={this.handleClose} aria-labelledby="score-dialog">
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Round</TableCell>
                            {this.renderPlayersName()}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.renderRows()}
                        <StyledTableCell component="th" scope="row">
                            Total
                </StyledTableCell>
                        {this.renderTotalScore()}
                    </TableBody>
                </Table>
            </Dialog>
        )
    }
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

    },
    paper: {
        padding: '20px'
    },
    table: {
    },
    row: {
        alignText: 'center',
        '&:nth-of-type(odd)': {
            backgroundColor: '#f3f3f3'
        },
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        }
    },
    avatar: {
        height: '22px',
        width: '22px',
        marginRight: '10px'
    },
    player: {
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
    }
})

const mapStateToProps = (state) => {
    return {
        isOpen: state.game.isScoreOpen,
        players: state.game.players,
        round: state.round.index,
        score: state.round.score,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleScoreWindow: () => { dispatch(toggleScoreWindow()) },
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ScoreWindow))
