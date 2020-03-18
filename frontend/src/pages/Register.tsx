import React, { useState } from 'react'
import {useRegisterMutation} from '../generated/graphql';
import {RouteComponentProps} from 'react-router-dom';

const Register: React.FC<RouteComponentProps> = ({ history }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [register] = useRegisterMutation();

  return (
    <div>
			<form
				onSubmit={async (e) => {
					e.preventDefault();

					await register({
						variables: {
							email,
							password
						}
					});

					history.push('/');
				}}
			>
				<div>
					<input
						value={email}
						type='email'
						placeholder='e-mail'
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div>
					<input
						value={password}
						type='password'
						placeholder='password'
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button type='submit'>Register</button>
			</form>
    </div>
  )
};

export default Register;
