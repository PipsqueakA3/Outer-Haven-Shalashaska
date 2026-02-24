import { KnowledgeController } from './knowledge.controller';

describe('KnowledgeController', () => {
  it('возвращает список ссылок', async () => {
    const prisma: any = { knowledgeItem: { findMany: jest.fn().mockResolvedValue([{ id: 'k1' }]) } };
    const c = new KnowledgeController(prisma);
    const rows = await c.list();
    expect(rows).toHaveLength(1);
  });
});
