import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';
import {
  PublicKnowledgeCitation,
  PublicKnowledgeContext,
} from './knowledge.types';

type KnowledgeSearchRow = {
  chunk_id: string;
  document_id: string;
  title: string;
  citation: string | null;
  source_url: string | null;
  publisher: string | null;
  content: string;
  score: number;
};

const MAX_CONTEXT_CHARS = 12_000;

@Injectable()
export class KnowledgeService {
  constructor(private readonly prisma: DatabaseService) {}

  async retrievePublic(
    query: string,
    limit = 5,
  ): Promise<PublicKnowledgeCitation[]> {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return [];

    const safeLimit = Math.min(Math.max(Math.floor(limit), 1), 8);
    const rows = await this.prisma.$queryRaw<KnowledgeSearchRow[]>(Prisma.sql`
      SELECT
        c."id" AS chunk_id,
        d."id" AS document_id,
        d."title" AS title,
        d."citation" AS citation,
        d."sourceUrl" AS source_url,
        d."publisher" AS publisher,
        c."content" AS content,
        ts_rank(
          to_tsvector(
            'simple',
            concat_ws(' ', d."title", d."description", c."content")
          ),
          plainto_tsquery('simple', ${normalizedQuery})
        ) AS score
      FROM "KnowledgeChunk" c
      INNER JOIN "KnowledgeDocument" d ON d."id" = c."documentId"
      WHERE d."visibility" = 'PUBLIC'
        AND d."status" = 'PUBLISHED'
        AND to_tsvector(
          'simple',
          concat_ws(' ', d."title", d."description", c."content")
        ) @@ plainto_tsquery('simple', ${normalizedQuery})
      ORDER BY score DESC, d."publishedAt" DESC NULLS LAST, c."ordinal" ASC
      LIMIT ${safeLimit}
    `);

    return rows.map((row) => ({
      chunkId: row.chunk_id,
      documentId: row.document_id,
      title: row.title,
      citation: row.citation ?? undefined,
      sourceUrl: row.source_url ?? undefined,
      publisher: row.publisher ?? undefined,
      excerpt: row.content,
      score: Number(row.score),
    }));
  }

  async buildPublicContext(query: string): Promise<PublicKnowledgeContext> {
    const citations = await this.retrievePublic(query);
    if (citations.length === 0) {
      return { text: '', citations: [], hasEvidence: false };
    }

    let usedChars = 0;
    const sections: string[] = [];
    const included: PublicKnowledgeCitation[] = [];

    for (const [index, citation] of citations.entries()) {
      const source =
        citation.citation ?? citation.sourceUrl ?? citation.publisher;
      const header = `[${index + 1}] ${citation.title}${source ? ` — ${source}` : ''}`;
      const remaining = MAX_CONTEXT_CHARS - usedChars;
      if (remaining <= header.length + 20) break;

      const excerpt = citation.excerpt.slice(0, remaining - header.length - 8);
      sections.push(`${header}\n${excerpt}`);
      included.push(citation);
      usedChars += header.length + excerpt.length + 2;
    }

    return {
      text: sections.join('\n\n'),
      citations: included,
      hasEvidence: included.length > 0,
    };
  }
}
