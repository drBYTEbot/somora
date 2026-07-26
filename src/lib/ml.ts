"use client";

import * as tf from "@tensorflow/tfjs";

export interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
}

export interface DataPoint {
  x: number;
  y: number;
  label: number;
}

/**
 * Build a configurable neural network for binary classification.
 * Uses a simple 2D point dataset (two clusters) so results are visual.
 */
export function buildModel(config: {
  layers: number[];
  learningRate: number;
}): tf.Sequential {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      inputShape: [2],
      units: config.layers[0] ?? 4,
      activation: "relu",
    }),
  );

  for (let i = 1; i < config.layers.length; i++) {
    model.add(
      tf.layers.dense({
        units: config.layers[i],
        activation: "relu",
      }),
    );
  }

  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

  model.compile({
    optimizer: tf.train.adam(config.learningRate),
    loss: "binaryCrossentropy",
    metrics: ["accuracy"],
  });

  return model;
}

/** Generate two clusters of 2D points for binary classification. */
export function generateDataset(
  numSamples: number,
  noise: number,
  separation: number = 2,
): { xs: tf.Tensor2D; ys: tf.Tensor2D; points: DataPoint[] } {
  const half = Math.floor(numSamples / 2);
  const points: DataPoint[] = [];
  const pointData: number[][] = [];
  const labels: number[][] = [];

  const c0 = [separation, separation];
  const c1 = [-separation, -separation];

  for (let i = 0; i < half; i++) {
    const x = c0[0] + (Math.random() - 0.5) * noise;
    const y = c0[1] + (Math.random() - 0.5) * noise;
    points.push({ x, y, label: 0 });
    pointData.push([x, y]);
    labels.push([0]);
  }
  for (let i = 0; i < half; i++) {
    const x = c1[0] + (Math.random() - 0.5) * noise;
    const y = c1[1] + (Math.random() - 0.5) * noise;
    points.push({ x, y, label: 1 });
    pointData.push([x, y]);
    labels.push([1]);
  }

  for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
    [pointData[i], pointData[j]] = [pointData[j], pointData[i]];
    [labels[i], labels[j]] = [labels[j], labels[i]];
  }

  return {
    xs: tf.tensor2d(pointData),
    ys: tf.tensor2d(labels),
    points,
  };
}

export function pointsToTensors(points: DataPoint[]): {
  xs: tf.Tensor2D;
  ys: tf.Tensor2D;
} {
  return {
    xs: tf.tensor2d(points.map((p) => [p.x, p.y])),
    ys: tf.tensor2d(points.map((p) => [p.label])),
  };
}

export function splitData<T>(array: T[], ratio: number): { train: T[]; test: T[] } {
  const splitIdx = Math.floor(array.length * ratio);
  return {
    train: array.slice(0, splitIdx),
    test: array.slice(splitIdx),
  };
}

export function evaluateAccuracy(
  model: tf.Sequential,
  xs: tf.Tensor2D,
  ys: tf.Tensor2D,
): number {
  const preds = model.predict(xs) as tf.Tensor;
  const predData = preds.dataSync();
  const trueData = ys.dataSync();
  let correct = 0;
  for (let i = 0; i < predData.length; i++) {
    if ((predData[i] > 0.5 ? 1 : 0) === trueData[i]) correct++;
  }
  preds.dispose();
  return correct / predData.length;
}

/** Train a single epoch and return metrics. */
export async function trainOneEpoch(
  model: tf.Sequential,
  xs: tf.Tensor2D,
  ys: tf.Tensor2D,
): Promise<TrainingMetrics> {
  const history = await model.fit(xs, ys, {
    epochs: 1,
    batchSize: 16,
    shuffle: true,
  });
  const epoch = (history.epoch?.[0] ?? 0) + 1;
  const logs = history.history;
  const lossVal = Array.isArray(logs?.loss) ? logs.loss[0] : (logs?.loss as number) ?? 0;
  const accVal = Array.isArray(logs?.acc) ? logs.acc[0] : Array.isArray(logs?.accuracy) ? logs.accuracy[0] : (logs?.acc as number) ?? 0;
  return {
    epoch,
    loss: typeof lossVal === "number" ? lossVal : 0,
    accuracy: typeof accVal === "number" ? accVal : 0,
  };
}

/** Get predictions on a grid of points for visualization (batched for speed). */
export function predictGrid(
  model: tf.Sequential,
  resolution: number,
  range: number = 6,
): { pred: number }[] {
  const inputs: number[][] = [];
  for (let j = 0; j < resolution; j++) {
    for (let i = 0; i < resolution; i++) {
      const x = (i / (resolution - 1) - 0.5) * range * 2;
      const y = (j / (resolution - 1) - 0.5) * range * 2;
      inputs.push([x, y]);
    }
  }
  const inputTensor = tf.tensor2d(inputs);
  const preds = model.predict(inputTensor) as tf.Tensor;
  const data = preds.dataSync();
  inputTensor.dispose();
  preds.dispose();
  return Array.from(data).map((pred) => ({ pred }));
}

export function predictPoint(
  model: tf.Sequential,
  x: number,
  y: number,
): number {
  const input = tf.tensor2d([[x, y]]);
  const pred = model.predict(input) as tf.Tensor;
  const val = pred.dataSync()[0];
  input.dispose();
  pred.dispose();
  return val;
}
