import { Logger, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService
{
	private readonly logger = new Logger(AppService.name);

	async getHashedPassword(password: string)
	{
		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(password, salt);
		return hash;
	}

	async checkPassword(password: string, hash: string)
	{
		const isMatch = await bcrypt.compare(password, hash);
		return isMatch;
	}
}
