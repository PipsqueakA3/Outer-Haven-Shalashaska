import { KnowledgeController } from './knowledge.controller';

describe('KnowledgeController', () => {
  it('возвращает список материалов', async () => {
    const service: any = { list: jest.fn().mockResolvedValue({ data: [{ id: 'k1' }], total: 1 }) };
    const c = new KnowledgeController(service);
    const rows = await c.list({});
    expect(rows.total).toBe(1);
  });
});
