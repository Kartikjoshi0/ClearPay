import { useState } from 'react'
import {Heading} from '../components/Heading'
import {SubHeading} from '../components/SubHeading'
import {InputBox} from '../components/InputBox'
import {Button} from '../components/Button'
import {BottomWarning} from '../components/ButtomWarning'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


function Signup() {
  const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
	const navigate=useNavigate();
  return (
    <div className='bg-slate-300 h-screen flex justify-center'>
		<div className='flex flex-col justify-center'>
			<div className='rounded-lg bg-white w-80 text-center p-2 h-mx px-4'>
				<Heading  label={'Sign up'}/>
				<SubHeading label={"Enter your infromation to create your account"} />
				<InputBox onChange={(e)=>setFirstName(e.target.value)} placeholder="john" label={"Frist Name"} />
				<InputBox onChange={(e)=>setLastName(e.target.value)} placeholder="singh" label={"Last Name"} />
				<InputBox onChange={(e)=>setUsername(e.target.value)} placeholder="kai@gmail.com" label={"Email"} />
        <InputBox onChange={(e)=>setPassword(e.target.value)} placeholder="123456" label={"Password"} />

				<div className='pt-4'>
					<Button label={"Sign in"} onClick={async ()=>{
						const response =await axios.post('http://localhost:3000/api/v1/signup',{
							username,
							firstName,
							lastName,
							password
						});
						localStorage.setItem('token',response.data.token)
						navigate('/dashboard')
					}}/>
				</div>
				<BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
				
			</div>
		</div>
	</div>
  )
}

export default Signup