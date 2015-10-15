import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import linkState from 'boost/linkState'
import { login } from 'boost/api'

export default class LoginPage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      user: {},
      isSending: false,
      error: null
    }
    this.linkState = linkState
  }

  handleSubmit (e) {
    e.preventDefault()
    this.setState({
      isSending: true,
      error: null
    }, function () {
      login(this.state.user)
        .then(function (res) {
          localStorage.setItem('token', res.body.token)
          localStorage.setItem('currentUser', JSON.stringify(res.body.user))

          try {
            this.props.history.pushState('home')
          } catch (e) {
            console.error(e)
          }
        }.bind(this))
        .catch(function (err) {
          console.error(err)
          if (err.response == null) {
            return this.setState({
              error: {name: 'CunnectionRefused', message: 'Can\'t connect to API server.'},
              isSending: false
            })
          }

          // Connection Failed or Whatever
          this.setState({
            error: err.response.body,
            isSending: false
          })
        }.bind(this))
    })
  }

  render () {
    return (
      <div className='LoginContainer'>
        <img className='logo' src='resources/favicon-230x230.png'/>

        <nav className='authNavigator text-center'><Link to='/login' activeClassName='active'>Log In</Link> / <Link to='/signup' activeClassName='active'>Sign Up</Link></nav>

        <form onSubmit={e => this.handleSubmit(e)}>
          <div className='formField'>
            <input valueLink={this.linkState('user.email')} type='text' placeholder='E-mail'/>
          </div>
          <div className='formField'>
            <input valueLink={this.linkState('user.password')} onChange={this.handleChange} type='password' placeholder='Password'/>
          </div>

          {this.state.isSending ? (
            <p className='alertInfo'>Logging in...</p>
          ) : null}

          {this.state.error != null ? <p className='alertError'>{this.state.error.message}</p> : null}

          <div className='formField'>
            <button className='logInButton' type='submit'>Log In</button>
          </div>
        </form>
      </div>
    )
  }
}

LoginPage.propTypes = {
  history: PropTypes.shape({
    pushState: PropTypes.func
  })
}