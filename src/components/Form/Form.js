import './Form.css';

import React, {useState, useEffect} from 'react';

const useValidation = (value, validations) => {
  const [isEmpty, setEmpty] = useState(true);
  const [emailError, setEmailError] = useState(true);
  const [selectError, setSelectError] = useState(true);
  const [inputValid, setInputValid] = useState(false);

  useEffect(() => {
    for (const validation in validations) {
      switch (validation) {
        case 'isEmpty':
          value ? setEmpty(false) : setEmpty(true);
          break;
        case 'isEmail':
          const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          re.test(String(value).toLowerCase()) ? setEmailError(false) :  setEmailError(true)
          break;
        case 'isSelect':
          value !== '' ? setSelectError(false) : setSelectError(true);
          break;
      }
    }
  }, [value]);

  useEffect(() => {
    if (isEmpty || emailError || selectError) {
      setInputValid(false);
    } else {
      setInputValid(true);
    }
  }, [isEmpty, emailError, selectError]);

  return {
    isEmpty,
    emailError,
    selectError,
    inputValid
  }
}

const useInput = (initialValue, validations) => {
  const [value, setValue] = useState(initialValue);
  const [isDirty, setDirty] = useState(false);
  const valid = useValidation(value, validations);

  const onChange = (e) => {
    setValue(e.target.value);
  }

  const onBlur = (e) => {
    setDirty(true);
  }

  return {
    value,
    onChange,
    onBlur,
    isDirty,
    ...valid
  }
}

const Form = ({closePopup}) => {
  const [textarea, setTextarea] = useState('');
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [switchPrice2, setSwitch2Price] = useState(0);
  const [switchPrice1, setSwitch1Price] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const firstName = useInput('', {isEmpty: true});
  const surName = useInput('', {isEmpty: true});
  const email = useInput('', {isEmail: true, isEmpty: true});
  const select = useInput('', {isSelect: true});

  useEffect(() => {
    priceUpdate();
  });

  const priceUpdate = () => {
    if (checked1) {
      setSwitch1Price(100);
    }
    if (!checked1) {
      setSwitch1Price(0);
    }
    if (checked2) {
      setSwitch2Price(200);
    }
    if (!checked2) {
      setSwitch2Price(0);
    }
    setTotalPrice(+select.value + switchPrice1 + switchPrice2);
  }

  const checkValidity = () => {
    return (firstName.isEmpty || surName.isEmpty || email.emailError || select.selectError );
  }

  const onSubmit  = async () => {
    if (!checkValidity()) {
      const formData = new FormData();

      formData.append('firstName', firstName.value);
      formData.append('surName', surName.value);
      formData.append('email', email.value);
      formData.append('product', select.value);
      if (checked1) {
        formData.append('checked1', 'true');
      }
      if (checked2) {
        formData.append('checked2', 'true');
      }
      if (textarea !== '') {
        formData.append('comment', textarea);
      }

      const res = await fetch('http://localhost:4000/', {
        method: 'POST',
        body: formData
      });
      if (res.status === 200) {
        console.log('success');
        closePopup(false);
      }
    }
  }

  return (
    <form className={'form'}
          onSubmit={e => e.preventDefault()}
    >
      <input placeholder={'First Name *'}
             value={firstName.value}
             onChange={e => firstName.onChange(e)}
             onBlur={e => firstName.onBlur(e)}
             className={(firstName.isDirty && firstName.isEmpty) ? 'form__input error' : 'form__input'}
      />
      <span className={ (firstName.isDirty && firstName.isEmpty) ? 'error__text error__text_visible' : 'error__text' }>
        Please fill in First Name
      </span>
      <input placeholder={'Last Name *'}
             value={surName.value}
             onChange={e => surName.onChange(e)}
             onBlur={e => surName.onBlur(e)}
             className={(surName.isDirty && surName.isEmpty) ? 'form__input error' : 'form__input'}
      />
      <span className={(surName.isDirty && surName.isEmpty) ? 'error__text error__text_visible' : 'error__text'}>
        Please fill in Last Name
      </span>
      <input placeholder={'user@gmail.com *'}
             value={email.value}
             onChange={e => email.onChange(e)}
             onBlur={e => email.onBlur(e)}
             className={(email.isDirty && email.emailError) ? 'form__input error' : 'form__input'}
      />
      <span className={(email.isDirty && email.emailError) ? 'error__text error__text_visible' : 'error__text'}>
        Please fill in email
      </span>
      <div className={'form__select-wrap'}>
        <label>Product type *</label>
        <div className={'form__select-content'}>
          <select value={select.value}
                  onChange={e => select.onChange(e)}
                  onBlur={e => select.onBlur(e)}
                  className={(select.selectError && select.isDirty) ? 'form__select error' : 'form__select'}
          >
            <option value={''}>Select product type</option>
            <option value={50}>Product 50$</option>
            <option value={100}>Product 100$</option>
            <option value={300}>Product 300$</option>
          </select>
          <span className={(select.isDirty && select.selectError) ? 'error__text error__text_visible' : 'error__text'}>
            Please fill in product type
          </span>
        </div>
      </div>
      <div className={'form__switch'}>
        <label>Additinal feature for $100</label>
        <input type={'checkbox'}
               checked={checked1}
               onChange={() => setChecked1(!checked1)}
               className={'form__switch-input'}
        />
        <div className={ checked1 ? 'form__switch-label_checked form__switch-label' : 'form__switch-label'}
             onClick={() => setChecked1(!checked1)}
        >
          <div className={ checked1 ? 'form__switch-icon form__switch-icon_checked' : 'form__switch-icon'}>
          </div>
        </div>
      </div>
      <div className={'form__switch'}>
        <label>Additinal feature for $200</label>
        <input type={'checkbox'}
               checked={checked2}
               onChange={(e) => setChecked2(!checked2)}
               className={'form__switch-input'}
        />
        <div className={ checked2 ? "form__switch-label_checked form__switch-label" : "form__switch-label"}
             onClick={() => setChecked2(!checked2)}
        >
          <div className={ checked2 ? 'form__switch-icon form__switch-icon_checked' : 'form__switch-icon'}>
          </div>
        </div>
      </div>
      <textarea placeholder={'Type your comment'} className={'form__textarea'}
                value={textarea}
                onChange={(e) => setTextarea(e.target.value)}
      >
      </textarea>
      <div className={'form__price-wrap'}>
        <p className={'text'}>Total price</p>
        <p className={'text'}>{`${totalPrice}$`}</p>
      </div>
      <button className={`form__button ${checkValidity() ? 'form__button_disabled' : ''}`}
              disabled={checkValidity()}
              onClick={() => onSubmit()}
      >
        Send form
      </button>
    </form>
  );
}

export default Form;
