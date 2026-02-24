export interface CalculationEngine {
  estimateBurnRate(input: unknown): Promise<number>;
}

export class CalculationEngineStub implements CalculationEngine {
  async estimateBurnRate(): Promise<number> {
    return 0;
  }
}
