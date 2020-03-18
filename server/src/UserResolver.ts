import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx } from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { User } from './entity/User';
import { Context } from './Context';
import { createAccessToken, createRefreshToken } from './auth';
import { sendRefreshToken } from './sendRefreshToken';
import {verify} from 'jsonwebtoken';

@ObjectType()
class LoginResponse {
	@Field()
	accessToken: string;
	@Field(() => User)
	user: User;
}

@Resolver()
export class UserResolver {
	@Mutation(() => Boolean)
	async logout(
		@Ctx() { res }: Context
	) {
		sendRefreshToken(res, '');

		return true;
	}

	@Query(() => [User])
	users() {
		return User.find();
	}

	@Query(() => User, {nullable: true})
	user(
		@Ctx() context: Context
	) {
		const authorization = context.req.headers.authorization;

		if (!authorization) {
			return null;
		}

		try {
			const token = authorization.split(' ')[1];
			const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);

			return User.findOne(payload.userId);
		} catch(err) {
			console.error(err);
			return null;
		}
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

		sendRefreshToken(res, createRefreshToken(user));

		return {
			accessToken: createAccessToken(user),
			user
		}
	}
}
