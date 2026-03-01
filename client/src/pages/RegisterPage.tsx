import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RegisterForm } from '../types';
import RobotLogo from '../components/RobotLogo';
import { C } from '../design';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const { register: registerUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) { toast.error('Passwords do not match'); return; }
    setIsLoading(true);
    try { await registerUser(data); toast.success('Account created!'); navigate('/dashboard'); }
    catch (error: any) { toast.error(error.message || 'Failed to create account'); }
    finally { setIsLoading(false); }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try { await loginWithGoogle(); toast.success('Account created!'); navigate('/dashboard'); }
    catch (error: any) { toast.error(error.message || 'Failed to sign up with Google'); }
    finally { setIsGoogleLoading(false); }
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "12px 16px", background: C.pureWhite,
    border: `1.5px solid ${C.gray200}`, borderRadius: 10,
    fontSize: 15, fontFamily: "inherit", fontWeight: 400, color: C.black, outline: "none", transition: "border 0.3s",
  };

  const labelStyle: React.CSSProperties = { display: "block", fontSize: 14, fontWeight: 500, color: C.black, marginBottom: 8 };
  const errorStyle: React.CSSProperties = { fontSize: 13, color: "#ef4444", marginTop: 4 };

  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", background: C.white }}>
      {/* Header */}
      <header style={{ padding: "0 48px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.gray100}` }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <RobotLogo size={20} />
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.black }}>DroidBRB</span>
        </Link>
        <Link to="/" style={{ fontSize: 14, fontWeight: 500, color: C.gray500, textDecoration: "none" }}>Back to Home</Link>
      </header>

      {/* Form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ maxWidth: 420, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 8 }}>Create your account</h1>
            <p style={{ fontSize: 15, color: C.gray500 }}>Join the DroidBRB community</p>
          </div>

          <div style={{ background: C.pureWhite, border: `1px solid ${C.gray100}`, borderRadius: 12, padding: 28 }}>
            {/* Google */}
            <button type="button" onClick={handleGoogleSignUp} disabled={isGoogleLoading}
              style={{
                width: "100%", padding: "12px 0", borderRadius: 100, fontSize: 14, fontWeight: 500,
                background: "transparent", color: C.gray700, border: `1.5px solid ${C.gray200}`,
                cursor: isGoogleLoading ? "not-allowed" : "pointer",
                fontFamily: "inherit", transition: "all 0.25s", marginBottom: 20,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isGoogleLoading ? 'Creating account...' : 'Sign up with Google'}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: C.gray200 }} />
              <span style={{ fontSize: 13, color: C.gray400 }}>Or create with email</span>
              <div style={{ flex: 1, height: 1, background: C.gray200 }} />
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Username</label>
                <input {...register('username', { required: 'Username is required' })} placeholder="Choose a username" style={inp}
                  onFocus={e => (e.target.style.borderColor = C.black)} onBlur={e => (e.target.style.borderColor = C.gray200)} />
                {errors.username && <p style={errorStyle}>{errors.username.message}</p>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input {...register('firstName', { required: 'Required' })} placeholder="First name" style={inp}
                    onFocus={e => (e.target.style.borderColor = C.black)} onBlur={e => (e.target.style.borderColor = C.gray200)} />
                  {errors.firstName && <p style={errorStyle}>{errors.firstName.message}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input {...register('lastName', { required: 'Required' })} placeholder="Last name" style={inp}
                    onFocus={e => (e.target.style.borderColor = C.black)} onBlur={e => (e.target.style.borderColor = C.gray200)} />
                  {errors.lastName && <p style={errorStyle}>{errors.lastName.message}</p>}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Email Address</label>
                <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } })}
                  placeholder="Enter your email" style={inp}
                  onFocus={e => (e.target.style.borderColor = C.black)} onBlur={e => (e.target.style.borderColor = C.gray200)} />
                {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                    placeholder="Create a password" style={{ ...inp, paddingRight: 44 }}
                    onFocus={e => (e.target.style.borderColor = C.black)} onBlur={e => (e.target.style.borderColor = C.gray200)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.gray400 }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p style={errorStyle}>{errors.password.message}</p>}
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', { required: 'Confirm password', validate: v => v === password || 'Passwords do not match' })}
                    placeholder="Confirm your password" style={{ ...inp, paddingRight: 44 }}
                    onFocus={e => (e.target.style.borderColor = C.black)} onBlur={e => (e.target.style.borderColor = C.gray200)} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.gray400 }}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" disabled={isLoading}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 100, fontSize: 14, fontWeight: 500,
                  background: isLoading ? C.gray300 : C.blue, color: C.pureWhite,
                  border: "none", cursor: isLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit", transition: "all 0.25s",
                }}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <p style={{ fontSize: 14, color: C.gray500 }}>
                Already have an account? <Link to="/login" style={{ fontWeight: 500, color: C.blue, textDecoration: "none" }}>Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
