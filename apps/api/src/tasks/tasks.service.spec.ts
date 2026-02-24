import { TasksService } from './tasks.service';

describe('TasksService', () => {
  it('должен вызывать prisma.task.create', async () => {
    const prisma: any = { task: { create: jest.fn().mockResolvedValue({ id: 't1' }) } };
    const service = new TasksService(prisma);
    const result = await service.create({ title: 'X', stageId: 's1' });
    expect(result.id).toBe('t1');
  });
});
