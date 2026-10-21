-- Impacta RAG propio: corpus separado de Sentinel y de datos operativos.
CREATE TABLE "KnowledgeDocument" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sourceUrl" TEXT,
    "publisher" TEXT,
    "citation" TEXT,
    "sourceType" TEXT NOT NULL DEFAULT 'ARTICLE',
    "visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "consultedAt" TIMESTAMP(3),
    "contentHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeDocument_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "KnowledgeChunk" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeChunk_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "KnowledgeDocument_contentHash_key"
    ON "KnowledgeDocument"("contentHash");
CREATE INDEX "KnowledgeDocument_visibility_status_idx"
    ON "KnowledgeDocument"("visibility", "status");
CREATE INDEX "KnowledgeDocument_organizationId_visibility_status_idx"
    ON "KnowledgeDocument"("organizationId", "visibility", "status");
CREATE UNIQUE INDEX "KnowledgeChunk_documentId_ordinal_key"
    ON "KnowledgeChunk"("documentId", "ordinal");
CREATE INDEX "KnowledgeChunk_documentId_idx"
    ON "KnowledgeChunk"("documentId");

ALTER TABLE "KnowledgeDocument"
    ADD CONSTRAINT "KnowledgeDocument_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "KnowledgeChunk"
    ADD CONSTRAINT "KnowledgeChunk_documentId_fkey"
    FOREIGN KEY ("documentId") REFERENCES "KnowledgeDocument"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
