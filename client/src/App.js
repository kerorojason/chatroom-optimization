import React, { useState, useEffect, useRef } from 'react';
import webSocket from 'socket.io-client';

import ChatRoom from './ChatRoom';
import styles from './App.module.css';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function App() {
  const [ws, setWs] = useState(null);
  const [speed, setSpeed] = useState(20);
  const [usingMemo, setUsingMemo] = useState(false);
  const [messages, setMessages] = useState([]);
  const [maxLength, setMaxLength] = useState(250);
  const batchIntervalRef = useRef(1000);
  const newMessagesRef = useRef([]);
  const initWebSocket = () => {
    ws.emit('change speed', speed);
    ws.on('message', message => {
      if (batchIntervalRef.current) {
        newMessagesRef.current = [...newMessagesRef.current, message];
      } else {
        setMessages(messages =>
          messages.length > maxLength ? [...messages.slice(1), message] : [...messages, message]
        );
      }
    });
  };

  const tick = () =>
    setMessages(messages => {
      messages = [...messages, ...newMessagesRef.current];
      newMessagesRef.current = [];
      return messages.length > maxLength ? messages.slice(messages.length - maxLength) : messages;
    });
  useInterval(tick, batchIntervalRef.current);

  useEffect(() => {
    if (!ws) {
      setWs(webSocket('http://localhost:5000'));
    }
    if (ws) {
      console.log('Successfully connected!');
      initWebSocket();
    }
  }, [ws]);

  const handleChangeSpeed = e => {
    setSpeed(e.target.value);
    ws.emit('change speed', e.target.value);
  };

  return (
    <div className={styles.app}>
      <ChatRoom messages={messages} usingMemo={usingMemo} />

      <div className={styles.dashboard}>
        <div className={styles.group}>
          <label>Max length:</label>
          <input
            className={styles.input}
            value={maxLength}
            onChange={e => setMaxLength(e.target.value)}
          />
        </div>

        <div className={styles.group}>
          <label>Current Speed:</label>
          <input className={styles.input} value={speed} onChange={handleChangeSpeed} />
        </div>

        <div className={styles.group}>
          <input
            className={styles.checkbox}
            type='checkbox'
            onChange={() => setUsingMemo(usingMemo => !usingMemo)}
            checked={usingMemo}
          />
          <label>React.memo()</label>
        </div>

        <div className={styles.group}>
          <label>Batch interval</label>
          <input
            className={styles.input}
            type='text'
            onChange={e => {
              batchIntervalRef.current = e.target.value;
            }}
            value={batchIntervalRef.current}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
