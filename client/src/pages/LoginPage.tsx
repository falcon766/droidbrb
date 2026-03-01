import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LoginForm } from '../types';
import RobotLogo from '../components/RobotLogo';
import { C } from '../design';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try { await login(data); toast.success('Welcome back!'); navigate(from, { replace: true }); }
    catch (error: any) { toast.error(error.message || 'Failed to login'); }
    finally { setIsLoading(false); }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try { await loginWithGoogle(); toast.success('Welcome back!'); navigate(from, { replace: true }); }
    catch (error: any) { toast.error(error.message || 'Failed to login with Google'); }
    finally { setIsGoogleLoading(false); }
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "12px 16px", background: C.pureWhite,
    border: `1.5px solid ${C.gray200}`, borderRadius: 10,
    fontSize: 15, fontFamily: "inherit", fontWeight: 400, color: C.black, outline: "none", transition: "border 0.3s",
  };

  return (
    <>
      <Helmet><title>Sign In - DroidBRB</title></Helmet>
      <div style={{ fontFamily: "'Satoshi', sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", background: C.white }}>
        {/* Header */}
        <header style={{ padding: "0 48px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.gray100}` }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <RobotLogo size={20} />
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.black }}>DroidBRB</span>
          </Link>
          <Link to="/" style={{ fontSize: 14, fontWeight: 500, color: C.gray500, textDecoration: "none", transition: "color 0.2s" }}>Back to Home</Link>
        </header>

        {/* Form */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
          <div style={{ maxWidth: 420, width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h1 style={{ fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 8 }}>Welcome back</h1>
              <p style={{ fontSize: 15, color: C.gray500 }}>Sign in to your DroidBRB account</p>
            </div>

            <div style={{ background: C.pureWhite, border: `1px solid ${C.gray100}`, borderRadius: 12, padding: 28 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: C.black, marginBottom: 8 }}>Email address</label>
                  <input type="email" autoComplete="email" placeholder="Enter your email"
                    {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } })}
                    style={{ ...inp, borderColor: errors.email ? "#ef4444" : C.gray200 }}
                    onFocus={e => (e.target.style.borderColor = C.black)} onBlur={e => (e.target.style.borderColor = errors.email ? "#ef4444" : C.gray200)} />
                  {errors.email && <p style={{ fontSize: 13, color: "#ef4444", marginTop: 4 }}>{errors.email.message}</p>}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: C.black, marginBottom: 8 }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password"
                      {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                      style={{ ...inp, paddingRight: 44, borderColor: errors.password ? "#ef4444" : C.gray200 }}
                      onFocus={e => (e.target.style.borderColor = C.black)} onBlur={e => (e.target.style.borderColor = errors.password ? "#ef4444" : C.gray200)} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.gray400 }}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p style={{ fontSize: 13, color: "#ef4444", marginTop: 4 }}>{errors.password.message}</p>}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: C.gray500, cursor: "pointer" }}>
                    <input type="checkbox" name="remember" style={{ width: 16, height: 16 }} /> Remember me
                  </label>
                  <Link to="/forgot-password" style={{ fontSize: 14, fontWeight: 500, color: C.blue, textDecoration: "none" }}>Forgot password?</Link>
                </div>

                <button type="submit" disabled={isLoading}
                  style={{
                    width: "100%", padding: "14px 0", borderRadius: 100, fontSize: 14, fontWeight: 500,
                    background: isLoading ? C.gray300 : C.blue, color: C.pureWhite,
                    border: "none", cursor: isLoading ? "not-allowed" : "pointer",
                    fontFamily: "inherit", transition: "all 0.25s", marginBottom: 20,
                  }}>
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: C.gray200 }} />
                  <span style={{ fontSize: 13, color: C.gray400 }}>Or continue with</span>
                  <div style={{ flex: 1, height: 1, background: C.gray200 }} />
                </div>

                {/* Google */}
                <button type="button" onClick={handleGoogleLogin} disabled={isGoogleLoading}
                  style={{
                    width: "100%", padding: "12px 0", borderRadius: 100, fontSize: 14, fontWeight: 500,
                    background: "transparent", color: C.gray700, border: `1.5px solid ${C.gray200}`,
                    cursor: isGoogleLoading ? "not-allowed" : "pointer",
                    fontFamily: "inherit", transition: "all 0.25s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: 24 }}>
                <p style={{ fontSize: 14, color: C.gray500 }}>
                  Don't have an account? <Link to="/register" style={{ fontWeight: 500, color: C.blue, textDecoration: "none" }}>Sign up</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
