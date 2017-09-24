import React from 'react'
import {Button, Col, ControlLabel, Form, FormControl, FormGroup, Checkbox} from 'react-bootstrap'
import {connect} from 'react-redux'
import {set} from '../../state/auth'
import firebase from 'firebase'

const providerForGoogle = new firebase.auth.GoogleAuthProvider();
const providerForFacebook = new firebase.auth.FacebookAuthProvider();

providerForFacebook.addScope('user_birthday');

class SignIn extends React.Component {

    state = {
        login: '',
        password: ''
    };

    handleLoginChange = (event) => {
        this.setState({
            login: event.currentTarget.value
        })
    };

    handlePasswordChange = (event) => {
        this.setState({
            password: event.currentTarget.value
        })
    };

    handleSubmit = (event) => {
        event.preventDefault();

        firebase.auth().signInWithEmailAndPassword(this.state.login, this.state.password).then(
            user => {
                this.props.setUser(user);
                firebase.database().ref('favorites/' + user.uid).on('value', snapshot => {
                    console.log(snapshot.val())
                });
                firebase.database().ref('favorites/' + user.uid).set({email: 1})
            }
        ).catch(
            err => console.log(err)
        )
    };

    handlerGoogleLogIn = (event) => {
        event.preventDefault();
        firebase.auth().signInWithPopup(providerForGoogle).then(user => {
                // this.props.setUser(user)
                firebase.database().ref('favorites/' + user.uid).on('value', snapshot => {
                    console.log(snapshot.val())
                });
                firebase.database().ref('favorites/' + user.uid).set({})
            }
        ).catch(
            err => console.log(err)
        )
    };

    handlerFacebookLogIn = (event) => {
        event.preventDefault();
        firebase.auth().signInWithPopup(providerForFacebook).then(user => {
               // const token = result.credential.accessToken;
               //  const user = result.user;
                firebase.database().ref('favorites/' + user.uid).on('value', snapshot => {
                    console.log(snapshot.val())
                });
                firebase.database().ref('favorites/' + user.uid).set({})
            }
        ).catch(
            err => console.log(err)
        )
    };


    render() {
        return (
            <div>
                <Form horizontal onSubmit={this.handleSubmit}>
                    <FormGroup controlId="formHorizontalEmail">
                        <Col componentClass={ControlLabel} sm={2}>
                        </Col>
                        <Col smOffset={3} sm={2}>
                            <FormControl onChange={this.handleLoginChange} type="text" placeholder="login"/>
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalPassword">
                        <Col componentClass={ControlLabel} sm={2}>

                        </Col>
                        <Col smOffset={3} sm={2}>
                            <FormControl onChange={this.handlePasswordChange} type="password" placeholder="hasło"/>
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col smOffset={6} sm={10}>
                            <Checkbox>Zapamiętaj mnie</Checkbox>
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col smOffset={6} sm={10}>
                            <Button bsStyle="primary" type="submit">
                                Zaloguj
                            </Button>
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col smOffset={4} sm={10}>
                            <Button onClick={this.handlerGoogleLogIn} bsStyle="primary" type="submit">
                                google
                            </Button>
                        </Col>
                        <Col smOffset={4} sm={10}>
                            <Button onClick={this.handlerFacebookLogIn} bsStyle="primary" type="submit">
                                FB
                            </Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setUser: user => dispatch(set(user))
});

export default connect(null, mapDispatchToProps)(SignIn)