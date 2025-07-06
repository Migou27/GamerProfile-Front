import { useState } from 'react';
import axios from 'axios';
import Joi from 'joi';
import { successToast, errorToast, infoToast } from '../../Services/alertHandler/alertHandler';
import { useTranslation } from 'react-i18next';

const schema = Joi.object({
  pseudo: Joi.string().min(3).max(30).required(),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/, 'majuscule')
    .pattern(/[0-9]/, 'chiffre')
    .required(),
});

const Register = () => {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      errorToast(t('Register-PasswordsNotMatch'));
      return;
    }

    const { error } = schema.validate({ pseudo, password }, { abortEarly: false });
    if (error) {
      let hasPasswordError = false;
      error.details.forEach((err) => {
        errorToast(err.message);
        if (err.path.includes('password')) {
          hasPasswordError = true;
        }
      });
      if (hasPasswordError) {
        infoToast(t('Register-PasswordRequirements'));
      }
      return;
    }
    try {
      await axios.post('http://localhost:3001/auth/register', { pseudo, password });
      successToast(t('Register-Success'));
      setPseudo('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      const msg = err.response?.data?.message || t('Register-Error');
      errorToast(msg);
    }
  };

  return (
    <div className="register-container">
      <h2>{t('Registration')}</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>{t('Pseudo')}</label>
          <input
            type="text"
            value={pseudo}
            onChange={e => setPseudo(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label>{t('Password')}</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{ marginLeft: 8 }}
              tabIndex={-1}
            >
              {showPassword ? t('Hide') : t('Seen')}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>{t('Register-ConfirmPassword')}</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              style={{ marginLeft: 8 }}
              tabIndex={-1}
            >
              {showConfirm ? t('Hide') : t('Seen')}
            </button>
          </div>
        </div>
        <button type="submit" className="register-btn">{t('Register')}</button>
      </form>
    </div>
  );
};

export default Register;