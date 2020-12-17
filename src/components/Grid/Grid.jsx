import React, { useRef, useEffect } from 'react';
import cx from 'classnames';

// import './styles.css';

export default function Grid(props) {
  const webglAppRef = useRef(null);

  return (
    <div
      ref={webglAppRef}
      className={cx('comp-wrapper--demo-datatable', 'app-container', props.className)}
      style={props.style}
    >
      <div className="canvas-container" />
      <div className="scroll-wrapper">
        <div className="scroll-container"></div>
        <input type="text" className="cell-input" />
      </div>
      <div className="loader">Loading...</div>
    </div>
  );
}
