import React, { useState, useEffect, useRef } from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import SendIcon from '@material-ui/icons/Send';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import styled from "styled-components";
import io from "socket.io-client";
import "./Chat.css"

const Form = styled.form``;

const Chat = () => {
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [state, setState] = useState(false);

  const socketRef = useRef();

  function handleClick() {
    setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  useEffect(() => { //łączymy się z serwerem gniazd na montowaniu komponentów za pomocą useEffect, następnie zapisujemy każdą nową wiadomość przychodzącą w stanie komponentu.
    socketRef.current = io.connect('/');

    socketRef.current.on("your id", id => {
      setYourID(id);
    })

    socketRef.current.on("message", (message) => {
      receivedMessage(message);
    })
  }, []);

  function receivedMessage(message) {
    setMessages(oldMsgs => [...oldMsgs, message]);
  }

  function sendMessage(e) {
    e.preventDefault();
    if(message !== ""){
      const messageObject = {
        body: message,
        id: yourID,
      };
      setMessage("");
      socketRef.current.emit("send message", messageObject);  
    }
  }

  function handleChange(e) {
      setMessage(e.target.value);
  }

  return (
    <div className="chatBox">
    {state.isToggleOn ?
    <Grid component={Paper} xs={12} style={{  boxShadow: 'inset 0 0 5px rgb(224, 224, 224)'}}>
      <AppBar style={{background:'#14286e'}} position="static">
        <Toolbar>
          <Typography variant="h6" >
            Czat
          </Typography>
        </Toolbar>
      </AppBar>
      <div className="contentBody">
        {messages.map((message, index) => {
          if (message.id === yourID) {
            return (
              <div className="chatMy" key={index}>
                <div className="chatItemContentMy">
                    {message.body}
                  <div className="chatDate">
                    <span>16 min temu</span>
                </div>
                </div>
              </div>
            )
          }
          return (
            <div className="chatGuest" key={index}>
                <div className="chatItemContentGuest">
                  {message.body}
                  <div className="chatDate">
                    <span>16 min temu</span>
                </div>
              </div>
            </div>
          )
        })}
        </div>
      <Grid container>
      <div className='writeText'>
          <Grid item xs={11}>
            <Form onSubmit={sendMessage}>
              <TextField
                value={message} 
                onChange={handleChange} 
                label="Napisz nową wiadomość..." 
                fullWidth
              />
              <div className="clickSend">
                <button><SendIcon/></button>
              </div>
            </Form>
          </Grid>
        </div>
      </Grid> 
      </Grid>
      :null}
      <div className="clickChat">
        <button onClick={handleClick}>
          {state.isToggleOn ? <ArrowDropDownIcon/> : <ChatBubbleOutlineIcon/>}
        </button>
      </div>
    </div>
  );
};

export default Chat;