import { NeuralNetworkConfig, TrainingState } from "./types";

export class NeuralNetworkEngine {
  private config: NeuralNetworkConfig;
  private trainingState: TrainingState;
  private trainingInterval: NodeJS.Timeout | null = null;
  private testData: number[][][] | null = null;

  constructor(config: NeuralNetworkConfig) {
    this.config = config;
    this.trainingState = {
      isTraining: false,
      epoch: 0,
    };
  }

  public getConfig(): NeuralNetworkConfig {
    return this.config;
  }

  public getTrainingState(): TrainingState {
    return { ...this.trainingState };
  }

  public startTraining(): void {
    if (this.trainingState.isTraining) {
      console.warn("Training is already running");
      return;
    }

    this.trainingState.isTraining = true;
    console.log("Training started");

    this.trainingInterval = setInterval(() => {
      this.trainingStep();
    }, 100);
  }

  public stopTraining(): void {
    if (!this.trainingState.isTraining) {
      console.warn("Training is not running");
      return;
    }

    this.trainingState.isTraining = false;
    console.log("Training stopped");

    if (this.trainingInterval) {
      clearInterval(this.trainingInterval);
      this.trainingInterval = null;
    }
  }

  private trainingStep(): void {
    this.trainingState.epoch += 1;
    this.test()
  }

  public test(): void {
    console.log("Test function called");
    this.testData = this.config.layers.map(layer => {
      return Array.from({ length: layer.size }, () => {
        return Array.from({ length: 8 * 8 }, () => Math.floor(Math.random() * 256));
      });
    });
  }

  public getTest(): number[][][] | null {
    return this.testData;
  }

  public updateConfig(config: NeuralNetworkConfig): void {
    if (this.config == config) {
        return;
    }
    this.testData = null;
    this.config = config;
    console.log("Network configuration updated");
    for (let index = 0; index < config.layers.length; index++) {
      const element = config.layers[index];
      console.log(element.size);
    }
  }
}
