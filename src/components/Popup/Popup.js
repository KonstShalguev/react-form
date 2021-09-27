import './Popup.css';

import React from 'react';

const Popup = ({active, setActive, children, title}) => {
  return (
    <div className={active ? 'popup active' : 'popup'}>
      <div className={'popup__content'}
           onClick={e => e.stopPropagation()}>
        <img className={'popup__close'}
             src={'/images/close.svg'}
             alt={'close-button'}
             onClick={() => setActive(false)}
        />
        <h3 className={'popup__title'}>
          {title}
        </h3>
        {children}
      </div>
    </div>
  )
}

export default Popup;
