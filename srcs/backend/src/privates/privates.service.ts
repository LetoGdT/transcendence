import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { PrivateMessage } from '../typeorm/private-message.entity';
import { PageDto } from "../dto/page.dto";
import { PageMetaDto } from "../dto/page-meta.dto";
import { PageOptionsDto } from "../dto/page-options.dto";

@Injectable()
export class PrivatesService
{
	constructor(@InjectRepository(PrivateMessage) private readonly privatesRepository: Repository<PrivateMessage>) {}

	async getMessages(pageOptionsDto: PageOptionsDto): Promise<PageDto<PrivateMessage>>
	{
		const queryBuilder = this.privatesRepository.createQueryBuilder("private");

		queryBuilder
			.leftJoinAndSelect('private.recipient', 'recipient')
			.orderBy('private.id', pageOptionsDto.order)
			.skip(pageOptionsDto.skip)
			.take(pageOptionsDto.take);

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

		return new PageDto(entities, pageMetaDto);
	}
}
