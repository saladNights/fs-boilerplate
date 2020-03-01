import {Resolver, Query, Mutation, Arg, ObjectType, Field} from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import {User} from './entity/User';

@ObjectType()
class LoginResponse {
	@Field()
	accessToken: string
}

@Resolver()
export class UserResolver {
	@Query(() => [User])
	users() {
		return User.find();
	}

	@Mutation(() => Boolean)
	async register(
		@Arg('email') email: string,
		@Arg('password') password: string,
	): Promise<boolean> {
		const hashedPassword = await hash(password, 12);

		try {
			await User.insert({
				email,
				password: hashedPassword,
			});

			return true;
		} catch (err) {
			console.error(err);

			return false;
		}
	}

	@Mutation(() => LoginResponse)
	async login(
		@Arg('email') email: string,
		@Arg('password') password: string,
	): Promise<LoginResponse> {
		const user = await User.findOne({ where: { email } });

		if (!user) {
			throw new Error ('Login Error');
		}

		const valid = await compare(password, user.password);

		if (!valid) {
			throw new Error ('Login Error');
		}

		// success

		return {
			accessToken: sign(
				{ userId: user.id },
				'RaKx8jUKcV9nJkrRezM2',
				{ expiresIn: '15m'}
				)
		}
	}
}
