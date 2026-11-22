import React from 'react'
import { useLogin } from '../hooks/useLogin';
import { useMe } from '../hooks/useMe';
import { useNavigate } from 'react-router';
import { useEffect} from 'react';


export default function LoginPage() {



    const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        loginMutation.mutate({ email, password });
    };

    const loginMutation = useLogin();
    const { user } = useMe();
    const navigate = useNavigate();
    const { isPending } = loginMutation;

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

   


  return (
    <>
    
    <div className="login-form">
      
        <h2>Login</h2>
        
        <form onSubmit={onSubmit} className="form-field">
          <div className="form-group">
            <label htmlFor="email" className="">Email</label>
            <input type="email" name="email" id="email" required className="email-input" />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="">Password</label>
            <input type="password" name="password" id="password" required className="pass-input" />
          </div>
          <button type="submit" disabled={isPending} className="login-button">
            {isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {loginMutation.isError && (
          <p className="form-error">{(loginMutation.error as Error).message}</p>
        )}
      
    </div>


    </>
    
  )

}
