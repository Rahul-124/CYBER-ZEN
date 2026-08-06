import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ResetPasswordConfirm() {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://127.0.0.1:8000/api/password-reset-confirm/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, token, new_password: newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus('Success! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setStatus(data.error || 'Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Set New Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Update Password</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}