import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ContentService } from './content.service';

/** HTTP layer for content: reads the request, calls the service, shapes the response. */
export class ContentController {
  constructor(private readonly service: ContentService) {}

  getHome = async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.header('cache-control', 'public, max-age=60, s-maxage=300');
    return this.service.getHomeContent();
  };
}
