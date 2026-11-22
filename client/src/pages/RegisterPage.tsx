import React from 'react'
import { useMe } from '../hooks/useMe';
import { useRegister } from '../hooks/useRegister';
import { Link, useNavigate } from 'react-router';
import { useEffect} from 'react';


export default function RegisterPage() {



    const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        registerMutation.mutate(
          { firstName, lastName, email, password },
          { onSuccess: () => navigate('/login') },
        );
    };

    const registerMutation = useRegister();
    const { user } = useMe();
    const navigate = useNavigate();
    const { isPending } = registerMutation;

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

  return (
    <>
    
    <div className="login-form">
      
        <h2>Register</h2>
        
        <form onSubmit={onSubmit} className="form-field">
          <div className="form-group">
            <label htmlFor="firstName" >First Name</label>
            <input type="text" name="firstName" id="firstName" required className="firstName-input" />
          </div>
          <div className="form-group">
            <label htmlFor="lastName" className="">Last Name</label>
            <input type="text" name="lastName" id="lastName" required className="lastName-input" />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="">Email</label>
            <input type="email" name="email" id="email" required className="email-input" />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="">Password</label>
            <input type="password" name="password" id="password" autoComplete="new-password" required className="pass-input" />
          </div>
          <p className="form-info">Already have an account? <Link to="/login">Login</Link></p>  
          <button type="submit" disabled={isPending} className="register-button" >
            {isPending ? 'Registering...' : 'Register'}
            {}
          </button>
        </form>
        {registerMutation.isError && (
          <p className="form-error">{(registerMutation.error).message}</p>
        )}
      
    </div>


    </>
    
  )

}
