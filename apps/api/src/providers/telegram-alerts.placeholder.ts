export interface TelegramAlertsGateway {
  sendTaskAlert(taskId: string, text: string): Promise<void>;
}

export class TelegramAlertsStub implements TelegramAlertsGateway {
  async sendTaskAlert(): Promise<void> {
    return;
  }
}
