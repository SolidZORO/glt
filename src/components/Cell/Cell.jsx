import React from 'react';

import './styles.css';

import { cellWidth, cellHeight } from '../../utils/consts';

export default function Cell(props) {
  return (
    <div className="cell" style={{
      ...props.style,
      width: `${cellWidth}px`,
      height: `${cellHeight}px`,
      transform: `translate(${props.x}px, ${props.y}px)`,
    }}>
      {props.text}
    </div>
  );
}
