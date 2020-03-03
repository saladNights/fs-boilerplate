import {Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx, UseMiddleware} from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import {User} from './entity/User';
import {Context} from './Context';
import {createAccessToken, createRefreshToken} from './auth';
import {isAuth} from './isAuth';

@ObjectType()
class LoginResponse {
	@Field()
	accessToken: string
}

@Resolver()
export class UserResolver {
	@Query(() => String)
	@UseMiddleware(isAuth)
	bye(
		@Ctx() { payload }: Context
	) {
		console.log(payload);
		return ` user id is ${payload!.userId}`;
	}

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
		@Ctx() { res }: Context,
	): Promise<LoginResponse> {
		const user = await User.findOne({ where: { email } });

		if (!user) {
			throw new Error ('Login Error');
		}

		const valid = await compare(password, user.password);

		if (!valid) {
			throw new Error ('Login Error');
		}

		res.cookie(
			'jid',
			createRefreshToken(user),
			{
				httpOnly: true,
			}
		);

		return {
			accessToken: createAccessToken(user)
		}
	}
}
