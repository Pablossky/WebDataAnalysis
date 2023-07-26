import { useState } from 'react';

export function useSliderValue(initialValue) {
    const [sliderValue, setSliderValue] = useState(initialValue);
    return { sliderValue, setSliderValue };
  }
  
  export function useSampleCount(initialValue) {
    const [sampleCount, setSampleCount] = useState(initialValue);
    return { sampleCount, setSampleCount };
  }
  
  export function useSelectedSource(initialValue) {
    const [selectedSource, setSelectedSource] = useState(initialValue);
    return { selectedSource, setSelectedSource };
  }
  

export function useOffset(initialValue) {
    const [offset, setOffset] = useState(initialValue);
    return { offset, setOffset };
}

export function useInterpolationOffset(initialValue) {
    const [interpolationOffset, setInterpolationOffset] = useState(initialValue);
    return { interpolationOffset, setInterpolationOffset };
}

export function useLowpassEnabled(initialValue) {
    const [lowpassFilterEnabled, setLowpassEnabled] = useState(initialValue);
    return { lowpassFilterEnabled, setLowpassEnabled };
}

export function usePrintSelectedArea(initialValue) {
    const [printSelectedArea, setPrintSelectedArea] = useState(initialValue);
    return { printSelectedArea, setPrintSelectedArea };
}

export function useCutoffFrequency(initialValue) {
    const [cutoffFrequency, setCutoffFrequency] = useState(initialValue);
    return { cutoffFrequency, setCutoffFrequency };
}

export function useSampleRate(initialValue) {
    const [sampleRate, setSampleRate] = useState(initialValue);
    return { sampleRate, setSampleRate };
}

export function useOriginalChartData(initialValue) {
    const [originalChartData, setOriginalChartData] = useState(initialValue);
    return { originalChartData, setOriginalChartData };
}

export function useChartData(initialValue) {
    const [chartData, setChartData] = useState(initialValue);
    return { chartData, setChartData };
}

export function useResampledChartData(initialValue) {
    const [resampledChartData, setResampledChartData] = useState(initialValue);
    return { resampledChartData, setResampledChartData };
}

export function useOffsettedChartData(initialValue) {
    const [offsettedChartData, setOffsettedChartData] = useState(initialValue);
    return { offsettedChartData, setOffsettedChartData };
}

export function useInterpolatedChartData(initialValue) {
    const [interpolatedChartData, setInterpolatedChartData] = useState(initialValue);
    return { interpolatedChartData, setInterpolatedChartData };
}

export function useInterpolatedData(initialValue) {
    const [interpolatedData, setInterpolatedData] = useState(initialValue);
    return { interpolatedData, setInterpolatedData };
}

export function useSelectedInterpolation(initialValue) {
    const [selectedInterpolation, setSelectedInterpolation] = useState(initialValue);
    return { selectedInterpolation, setSelectedInterpolation };
}