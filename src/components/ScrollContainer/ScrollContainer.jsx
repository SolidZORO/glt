import React, { useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import { cellHeight, columns, cellWidth, rows } from '../../utils/consts';
import { scrollSubject$, resizeSubject$ } from '../../utils/subjects';

import './styles.css';

export default function ScrollContainer(props) {
  // const { text } = props;
  // const [n, setN] = useState(0);
  //
  // const add = () => setN(n + 1);

  const scrollContainerRef = useRef(null);
  const scrollWrapperRef = useRef(null);

  const handleScroll = () => {
    if (!scrollContainerRef || !scrollWrapperRef) return;

    const scrollWrapper = scrollWrapperRef.current;
    const scrollContainer = scrollContainerRef.current;

    /**
     * Handle scroll
     */
    // const scrollContainer = document.querySelector('.scroll-container');
    // const scrollWrapper = document.querySelector('.scroll-wrapper');
    // scrollWrapper.style.left = cellWidth + "px";
    scrollWrapper.style.top = cellHeight + 'px';
    scrollContainer.style.width = columns * cellWidth + 'px';
    scrollContainer.style.height = rows * cellHeight + 'px';

    scrollWrapper.addEventListener('scroll', (e) => {
      const { scrollLeft, scrollTop } = e.target;
      scrollSubject$.next({ scrollLeft, scrollTop });
    });
  };

  useEffect(() => {
    handleScroll();
  }, []);

  return (
    <div ref={scrollWrapperRef} className="scroll-wrapper">
      <div ref={scrollContainerRef} className="scroll-container"></div>
    </div>
  );
}
