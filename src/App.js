import './App.css';

import React, {useState} from 'react';
import Popup from './components/Popup/Popup';
import Form from './components/Form/Form';

function App() {
  const [popupActive, setPopupActive] = useState(true);

  return (
    <div className="App">
      <Popup active={popupActive}
             setActive={setPopupActive}
             title={'Title form'}
      >
        <Form closePopup={(value) => setPopupActive(value)}
        />
      </Popup>
    </div>
  );
}

export default App;
