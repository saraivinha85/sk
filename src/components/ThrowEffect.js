import React from 'react'
import { Keyframes, config } from 'react-spring'
import { withStyles } from '@material-ui/core/styles'

const Container = Keyframes.Spring({
    glow: [ { from: { boxShadow: 0, translate: 100 }, to: { boxShadow: 360, translate: 0 } }],
})

const styles = {
    glow: {
        backgroundColor: 'transparent',
        display: 'inline-flex',
    }
}

class ThrowEffect extends React.Component {

    state = {
        reset: true
    }

    reset = (styles) => {
        // if (styles.boxShadow === 0) {
        //     this.setState({reset: true})
        // }
    }

    render() {
        const {classes, children, className} = this.props

        return (
            <Container reset={this.state.reset} onRest={this.reset} state="glow">
                { styles => {
                    return <div className={`${className} ${classes.glow}`} style={{transform: `translateY(${styles.translate}%) rotateZ(${styles.boxShadow}deg)`}}>
                        {children}
                    </div>
                }}
            </Container>
        )
    }
}

export default withStyles(styles)(ThrowEffect)
