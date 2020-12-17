import React, { useState } from 'react';
import cx from 'classnames';

import './styles.css';

export default function DemoButton(props) {
  const { text } = props;
  const [n, setN] = useState(0);

  const add = () => setN(n + 1);

  return (
    <div className={cx('comp-wrapper--demo-button', props.className)} style={props.style}>
      <button onClick={add}>
        {text || ''} {n}
      </button>
    </div>
  );
}
