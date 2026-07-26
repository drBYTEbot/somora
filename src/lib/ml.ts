"use client";

import * as tf from "@tensorflow/tfjs";

export interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
}

export interface MLPredictions {
  predictions: number[];
  accuracy: number;
  loss: number;
}

/**
 * Build a configurable neural network for binary/multi-class classification.
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

/** Generate two overlapping clusters of 2D points for binary classification. */
export function generateDataset(
  numSamples: number,
  noise: number,
  bias: number,
): { xs: tf.Tensor2D; ys: tf.Tensor2D } {
  const half = Math.floor(numSamples / 2);
  const points: number[][] = [];
  const labels: number[][] = [];

  // Class 0 cluster center
  const c0 = [2 + bias * 0.1, 2 + bias * 0.1];
  // Class 1 cluster center
  const c1 = [-2 - bias * 0.1, -2 - bias * 0.1];

  for (let i = 0; i < half; i++) {
    points.push([
      c0[0] + (Math.random() - 0.5) * noise,
      c0[1] + (Math.random() - 0.5) * noise,
    ]);
    labels.push([0]);
  }
  for (let i = 0; i < half; i++) {
    points.push([
      c1[0] + (Math.random() - 0.5) * noise,
      c1[1] + (Math.random() - 0.5) * noise,
    ]);
    labels.push([1]);
  }

  // Shuffle
  for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
    [labels[i], labels[j]] = [labels[j], labels[i]];
  }

  return {
    xs: tf.tensor2d(points),
    ys: tf.tensor2d(labels),
  };
}

/** Train the model and report metrics per epoch via callback. */
export async function trainModel(
  model: tf.Sequential,
  xs: tf.Tensor2D,
  ys: tf.Tensor2D,
  epochs: number,
  onEpoch: (metrics: TrainingMetrics) => void,
): Promise<void> {
  await model.fit(xs, ys, {
    epochs,
    batchSize: 16,
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        onEpoch({
          epoch: epoch + 1,
          loss: logs?.loss ?? 0,
          accuracy: logs?.acc ?? logs?.accuracy ?? 0,
        });
      },
    },
  });
}

/** Get predictions on a grid of points for visualization. */
export function predictGrid(
  model: tf.Sequential,
  resolution: number,
): { x: number; y: number; pred: number }[] {
  const results: { x: number; y: number; pred: number }[] = [];
  const range = 6;

  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const x = (i / (resolution - 1) - 0.5) * range * 2;
      const y = (j / (resolution - 1) - 0.5) * range * 2;
      const input = tf.tensor2d([[x, y]]);
      const pred = model.predict(input) as tf.Tensor;
      const val = pred.dataSync()[0];
      results.push({ x, y, pred: val });
      input.dispose();
      pred.dispose();
    }
  }

  return results;
}

export function disposeModel(model: tf.Sequential): void {
  model.dispose();
}

export function cleanupTensors(): void {
  tf.tidy(() => {});
}
