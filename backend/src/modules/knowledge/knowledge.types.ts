export type PublicKnowledgeCitation = {
  chunkId: string;
  documentId: string;
  title: string;
  citation?: string;
  sourceUrl?: string;
  publisher?: string;
  excerpt: string;
  score: number;
};

export type PublicKnowledgeContext = {
  text: string;
  citations: PublicKnowledgeCitation[];
  hasEvidence: boolean;
};
