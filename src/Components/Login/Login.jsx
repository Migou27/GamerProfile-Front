import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Joi from 'joi';
import { AuthContext } from '../../context/AuthContext';
import { successToast, errorToast } from '../../Services/alertHandler/alertHandler';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ pseudo: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();

  const schema = Joi.object({
    pseudo: Joi.string().min(3).required().messages({
      'string.empty': t('Login-PseudoEmpty'),
      'string.min': t('Login-PseudoMinLength')
    }),
    password: Joi.string().min(8).required().messages({
      'string.empty': t('Login-PasswordEmpty'),
      'string.min': t('Login-PasswordMinLength')
    })
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { error } = schema.validate(form, { abortEarly: false });
    if (error) {
      const errObj = {};
      error.details.forEach(d => { errObj[d.path[0]] = d.message; });
      setErrors(errObj);
      errorToast(error.details[0]?.message || t('Login-Error'));
      setForm({ pseudo: '', password: '' });
      return;
    }
    try {
      const res = await axios.post('http://localhost:3001/auth/login', form);
      login(res.data.token, res.data.user);
      successToast(t('Login-Success') + form.pseudo);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || t('Login-Error');
      setApiError(msg);
      errorToast(msg);
      setForm({ pseudo: '', password: '' });
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} style={{ maxWidth: 350, margin: "40px auto" }}>
      <h2>{t('Connection')}</h2>
      <div>
        <label>{t('Pseudo')}</label>
        <input
          name="pseudo"
          type="text"
          value={form.pseudo}
          onChange={handleChange}
          autoComplete="username"
        />
        {errors.pseudo && <div className="error">{errors.pseudo}</div>}
      </div>
      <div>
        <label>{t('Password')}</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
        />
        {errors.password && <div className="error">{errors.password}</div>}
      </div>
      {apiError && <div className="error">{apiError}</div>}
      <button type="submit">{t('Connect')}</button>
    </form>
  );
};

export default Login;