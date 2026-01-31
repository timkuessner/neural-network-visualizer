'use client';

import React, { useState } from 'react';

interface LayerConfig {
  id: string;
  size: number;
}

interface NNVisualizerProps {
  initialLayers?: LayerConfig[];
}

export default function NNVisualizer({ initialLayers = [] }: NNVisualizerProps) {
  const [layers, setLayers] = useState<LayerConfig[]>(
    initialLayers.length > 0 
      ? initialLayers 
      : [
          { id: 'input', size: 2 },
          { id: 'h1', size: 3 },
          { id: 'h2', size: 3 },
          { id: 'h3', size: 3 },
          { id: 'output', size: 1 },
        ]
  );

  const addLayer = (index: number) => {
    if (layers.length >= 9) return;
    const newLayer: LayerConfig = {
      id: `layer-${Date.now()}`,
      size: 3,
    };
    const newLayers = [...layers];
    newLayers.splice(index, 0, newLayer);
    setLayers(newLayers);
  };

  const removeLayer = (index: number) => {
    if (layers.length <= 2) return;
    const newLayers = layers.filter((_, i) => i !== index);
    setLayers(newLayers);
  };

  const updateLayerSize = (index: number, newSize: number) => {
    const clampedSize = Math.max(1, Math.min(8, newSize));
    const newLayers = layers.map((layer, i) =>
      i === index ? { ...layer, size: clampedSize } : layer
    );
    setLayers(newLayers);
  };

  const maxNeurons = Math.max(...layers.map(l => l.size));
  const neuronSize = 40;
  const layerSpacing = 100;
  const verticalSpacing = 50;

  const drawingWidth = (layers.length - 1) * layerSpacing + neuronSize;
  const drawingHeight = maxNeurons * verticalSpacing;

  const halfW = drawingWidth / 2;
  const halfH = drawingHeight / 2;

  return (
    <div className="w-full min-h-screen bg-neutral-900 p-8">
      <h1 className="text-2xl font-light text-white mb-12 text-center">
        Neural Network
      </h1>

      <div className="flex flex-wrap gap-6 justify-center mb-8">
        {layers.map((layer, index) => (
          <div key={layer.id} className="flex flex-col items-center gap-3">
            <span className="text-neutral-500 text-sm font-light">
              {index === 0 ? 'Input' : index === layers.length - 1 ? 'Output' : `Hidden ${index}`}
            </span>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateLayerSize(index, layer.size - 1)}
                disabled={index === 0 || index === layers.length - 1 || layer.size <= 1}
                className="w-7 h-7 rounded bg-neutral-800 text-neutral-500 disabled:opacity-20 hover:bg-neutral-700 transition-colors text-sm"
              >
                −
              </button>
              <span className="text-neutral-500 w-8 text-center font-light">{layer.size}</span>
              <button
                onClick={() => updateLayerSize(index, layer.size + 1)}
                disabled={index === 0 || index === layers.length - 1 || layer.size >= 8}
                className="w-7 h-7 rounded bg-neutral-800 text-neutral-500 disabled:opacity-20 hover:bg-neutral-700 transition-colors text-sm"
              >
                +
              </button>
            </div>

            <div className="flex gap-1">
              {index > 0 && index < layers.length - 1 && (
                <button
                  onClick={() => removeLayer(index)}
                  className="px-3 py-1 text-xs bg-neutral-800 text-neutral-500 rounded hover:bg-neutral-700 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-3 mb-12">
        {layers.slice(0, -1).map((_, index) => (
          <button
            key={`add-${index}`}
            onClick={() => addLayer(index + 1)}
            disabled={layers.length >= 9}
            className="px-4 py-2 bg-neutral-800 text-neutral-500 rounded disabled:opacity-20 hover:bg-neutral-700 transition-colors text-sm font-light"
          >
            + Layer after {index === 0 ? 'Input' : `H${index}`}
          </button>
        ))}
      </div>

      <div className="flex justify-center overflow-x-auto">
        <svg
          width={drawingWidth + 100}
          height={drawingHeight + 100}
          viewBox={`${-halfW - 50} ${-halfH - 50} ${drawingWidth + 100} ${drawingHeight + 100}`}
          className="bg-neutral-800 rounded-lg"
        >
          {layers.map((layer, layerIndex) => {
            if (layerIndex === layers.length - 1) return null;
            const nextLayer = layers[layerIndex + 1];
            
            const currentX = -halfW + layerIndex * layerSpacing;
            const nextX = -halfW + (layerIndex + 1) * layerSpacing;

            const currentYBase = -halfH + (maxNeurons - layer.size) * verticalSpacing / 2;
            const nextYBase = -halfH + (maxNeurons - nextLayer.size) * verticalSpacing / 2;

            return (
              <g key={`connections-${layerIndex}`}>
                {Array.from({ length: layer.size }).map((_, i) => (
                  Array.from({ length: nextLayer.size }).map((_, j) => (
                    <line
                      key={`${layerIndex}-${i}-${j}`}
                      x1={currentX + neuronSize / 2}
                      y1={currentYBase + i * verticalSpacing + neuronSize / 2}
                      x2={nextX + neuronSize / 2}
                      y2={nextYBase + j * verticalSpacing + neuronSize / 2}
                      stroke="#737373"
                      strokeWidth="1"
                      opacity="0.6"
                    />
                  ))
                ))}
              </g>
            );
          })}

          {layers.map((layer, layerIndex) => {
            const x = -halfW + layerIndex * layerSpacing;
            const yBase = -halfH + (maxNeurons - layer.size) * verticalSpacing / 2;
            
            return (
              <g key={`layer-${layer.id}`}>
                {Array.from({ length: layer.size }).map((_, i) => (
                  <g key={`neuron-${layerIndex}-${i}`}>
                    <rect
                      x={x}
                      y={yBase + i * verticalSpacing}
                      width={neuronSize}
                      height={neuronSize}
                      rx={8}
                      fill="#262626"
                      stroke="#737373"
                      strokeWidth="1.5"
                    />
                    <text
                      x={x + neuronSize / 2}
                      y={yBase + i * verticalSpacing + neuronSize / 2 + 5}
                      textAnchor="middle"
                      fill="#737373"
                      fontSize="12"
                      fontWeight="normal"
                    >
                      {layerIndex === 0 ? 'I' : layerIndex === layers.length - 1 ? 'O' : 'H'}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}

          {layers.map((layer, index) => (
            <text
              key={`label-${layer.id}`}
              x={-halfW + index * layerSpacing + neuronSize / 2}
              y={-halfH - 20}
              textAnchor="middle"
              fill="#737373"
              fontSize="14"
              fontWeight="normal"
            >
              {index === 0
                ? 'Input'
                : index === layers.length - 1
                ? 'Output'
                : `${layer.size} neurons`}
            </text>
          ))}
        </svg>
      </div>

      <div className="mt-12 text-center text-neutral-500 text-sm font-light">
        <p>Total parameters: {
          layers.slice(0, -1).reduce((sum, layer, i) => {
            const nextSize = layers[i + 1].size;
            return sum + (layer.size * nextSize) + nextSize;
          }, 0)
        }</p>
      </div>
    </div>
  );
}