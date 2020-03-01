import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { hash } from 'bcryptjs';
import {User} from './entity/User';

@Resolver()
export class UserResolver {
	@Query(() => String)
	hello() {
		return 'hello!';
	}

	@Mutation(() => Boolean)
	async register(
		@Arg('email') email: string,
		@Arg('password') password: string,
	) {
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
}
