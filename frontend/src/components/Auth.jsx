import { useState } from 'react'
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [type, setType] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "login") {
      await login(formData.email, formData.password);
      setFormData({name: "", email: "", password: ""});
      navigate("/home");
    } else {
      await register(formData);
      setFormData({name: "", email: "", password: ""});
      navigate("/home");
    }
  }
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='w-96 p-4 border border-gray-300 rounded shadow-lg'>
        <h2 className='text-2xl text-center font-bold mb-4'>{type === "login" ? "Login" : "Register"}</h2>
  <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-6'>
          {type === "register" && (
            <input 
              type="text"
              placeholder='Name'
              className='p-2 border border-gray-300 rounded'
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          )}
          <input
            type="email"
            placeholder='Email'
            className='p-2 border border-gray-300 rounded'
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder='Password'
            className='p-2 border border-gray-300 rounded'
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <div className='flex justify-end'>
            {type === "login" && (
              <button className='text-sm text-blue-500 hover:underline hover:pointer' onClick={() => navigate('/reset-password')}>Forgot Password?</button>
            )}
          </div>
          <button
            type='submit'
            className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition'
          >
            {type === "login" ? "Login" : "Register"}
          </button>
        </form>
        <div>
          {type === "login" ? (
            <p className='mt-4 text-center'>
              Don't have an account?{' '}
              <span className='text-blue-500 cursor-pointer' onClick={() => setType("register")}>Register</span>
            </p>
          ) : (
            <p className='mt-4 text-center'>
              Already have an account?{' '}
              <span className='text-blue-500 cursor-pointer' onClick={() => setType("login")}>Login</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Auth