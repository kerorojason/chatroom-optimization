import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './ChatRoom.module.css';

import Message, { MessageWithMemo } from './Message';

const ChatRoom = ({ messages, usingMemo }) => {
  const contentEl = useRef(null);
  let shouldScrollBottom = useRef(true);
  const scrollToBottom = () => {
    const node = contentEl.current;
    node.scrollTop = node.scrollHeight - node.offsetHeight;
  };
  if (contentEl.current) {
    const node = contentEl.current;
    shouldScrollBottom.current = node.scrollTop + node.offsetHeight === node.scrollHeight;
  }
  useEffect(() => {
    const node = contentEl.current;
    if (shouldScrollBottom.current) scrollToBottom();
  });

  const content = messages.map(message =>
    usingMemo ? (
      <MessageWithMemo key={message._id} {...message} />
    ) : (
      <Message key={message._id} {...message} />
    )
  );

  return (
    <div className={styles.chatroom}>
      <header className={styles.header}>Chat</header>
      <div className={styles.content} ref={contentEl}>
        {content}
      </div>
      <footer className={styles.footer}>
        <input className={styles.input}></input>
      </footer>
    </div>
  );
};

export default ChatRoom;
