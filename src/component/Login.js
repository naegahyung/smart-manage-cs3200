import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'


function Login({ history }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onChangeUsername = (e) => {
    if (!e.target) return;
    setUsername(e.target.value);
  }

  const onChangePassword = (e) => {
    if (!e.target) return;
    setPassword(e.target.value);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (!username || !username.length) return;
    if (!password || !password.length) return;
    if (!checkCredential()) return; // throw error
    history.push('/home');
  }

  const checkCredential = () => {
    return username === 'admin' && password === 'admin';
  }
  
  return (
    <div className="login-outer">
      <Header />
      <LoginBox 
        username={username}
        password={password}
        setUsername={onChangeUsername}
        setPassword={onChangePassword}
        onSubmit={onSubmit}
      />
    </div>
  )
}

function Header() {
  return (
    <h2 className="login-header">SmartManage System</h2>
  )
}

function LoginBox({
  username,
  password,
  setUsername,
  setPassword,
  onSubmit
}) {
  return (
    <Form className="login-form">
      <Form.Field>
        <label>Username</label>
        <input placeholder="admin" autoFocus value={username} onChange={setUsername} />
      </Form.Field>
      <Form.Field>
        <label>Password</label>
        <input type="password" value={password} onChange={setPassword} />
      </Form.Field>
      <Button
        className="login-button"
        type="submit"
        color="green"
        onClick={onSubmit}
      >Login</Button>
    </Form>
  )
}

export default withRouter(Login);