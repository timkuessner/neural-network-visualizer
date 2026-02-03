export interface LayerConfig {
  id: string;
  size: number;
}

export interface NeuralNetworkConfig {
  layers: LayerConfig[];
}

export interface TrainingState {
  isTraining: boolean;
  epoch: number;
}
