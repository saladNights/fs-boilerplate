import React, { useState } from 'react'
import {useLoginMutation, UserDocument, UserQuery} from '../generated/graphql';
import {RouteComponentProps} from 'react-router-dom';
import { setAccessToken } from '../accessToken';

const Login: React.FC<RouteComponentProps> = ({ history }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [login] = useLoginMutation();

	return (
		<div>
			<form
				onSubmit={async (e) => {
					e.preventDefault();

					const response = await login({
						variables: {
							email,
							password
						},
						update: (store, { data }) => {
							if(!data) return null;

							store.writeQuery<UserQuery>({
								query: UserDocument,
								data: {
									user: data.login.user,
								}
							});
						}
					});

					if (response && response.data) {
						setAccessToken(response.data.login.accessToken);
					}

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
				<button type='submit'>Login</button>
			</form>
		</div>
	)
};

export default Login;
