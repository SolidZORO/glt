import React, { useState, useEffect } from 'react';

export default function Cell(props) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(30);

  useEffect(() => {
    // 订阅RxJS更新流
  }, []);

  return (
    <div style={{ width: `${width}px`, height: `${height}px`, transform: `translate(${x}px, ${y}px)`, padding: '0px 30px', border: '1px solid black' }}>Cell</div>
  );
}
