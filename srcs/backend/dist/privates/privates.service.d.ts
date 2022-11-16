import { Repository } from 'typeorm';
import { PrivateMessage } from '../typeorm/private-message.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
export declare class PrivatesService {
    private readonly privatesRepository;
    constructor(privatesRepository: Repository<PrivateMessage>);
    getMessages(pageOptionsDto: PageOptionsDto): Promise<PageDto<PrivateMessage>>;
}
