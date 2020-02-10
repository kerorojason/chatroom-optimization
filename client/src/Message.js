import React from 'react';

import styles from './Message.module.css';

export default ({ name, color, logo, message }) => {
  return (
    <div className={styles.message}>
      <img className={styles.logo} src={logo} />
      <span style={{ color: color }}>{name}:</span>
      <span> {message} </span>
    </div>
  );
};

export const MessageWithMemo = React.memo(({ name, color, logo, message }) => {
  return (
    <div className={styles.message}>
      <img className={styles.logo} src={logo} />
      <span style={{ color: color }}>{name}:</span>
      <span> {message} </span>
    </div>
  );
});
