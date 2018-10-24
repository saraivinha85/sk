import React from 'react'
import { Keyframes, config } from 'react-spring'
import { withStyles } from '@material-ui/core/styles'

const Container = Keyframes.Spring({
    glow: [ { from: { boxShadow: 0 }, to: { boxShadow: 25 } }, { from: { boxShadow: 25 }, to: { boxShadow: 0 } }],
    // Functions with side-effects with access to component props
    //glow: async (next, ownProps) => {
        //await next({ from: { boxShadow: 0 }, to: { boxShadow: 25 }, config: config.default })
        ////await delay(100)
        //await next({ from: { boxShadow: 25 }, to: { boxShadow: 0 }, config: config.default })
    //}
})

const styles = {
    glow: {
        backgroundColor: 'transparent',
        borderRadius: '8px',
        display: 'inline-flex'
    }
}

class GlowEffect extends React.Component {

    state = {
        reset: true
    }

    reset = (styles) => {
        if (styles.boxShadow === 0) {
            this.setState({reset: true})
        }
    }

    render() {
        const {classes, children} = this.props

        return (
            <Container reset={this.state.reset} onRest={this.reset} state="glow">
                { styles => {
                    return <div className={classes.glow} style={{boxShadow: `0 0 ${styles.boxShadow}px gold`}}>
                        {children}
                    </div>
                }}
            </Container>
        )
    }
}

export default withStyles(styles)(GlowEffect)
