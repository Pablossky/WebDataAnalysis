import { useState } from 'react';

export function useSliderValue(initialValue) {
    const [sliderValue, setSliderValue] = useState(initialValue);
    return { sliderValue, setSliderValue };
  }
  
  // Add other custom hooks here as well
  export function useSampleCount(initialValue) {
    const [sampleCount, setSampleCount] = useState(initialValue);
    return { sampleCount, setSampleCount };
  }
  
  // Add other custom hooks here as well
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

export function useShowSelectedArea(initialValue) {
    const [showSelectedArea, setShowSelectedArea] = useState(initialValue);
    return { showSelectedArea, setShowSelectedArea };
}

export function useActiveBookmark(initialValue) {
    const [activeBookmark, setActiveBookmark] = useState(initialValue);
    return { activeBookmark, setActiveBookmark };
}

export function useHighestDerivativeLine(initialValue) {
    const [highestDerivativeLine, setHighestDerivativeLine] = useState(initialValue);
    return { highestDerivativeLine, setHighestDerivativeLine };
}

export function useNextPoint(initialValue) {
    const [nextPoint, setNextPoint] = useState(initialValue);
    return { nextPoint, setNextPoint };
}

export function useShowMenu(initialValue) {
    const [showMenu, setShowMenu] = useState(initialValue);
    return { showMenu, setShowMenu };
}

export function useSelectedInterpolation(initialValue) {
    const [selectedInterpolation, setSelectedInterpolation] = useState(initialValue);
    return { selectedInterpolation, setSelectedInterpolation };
}

export function useSelectedArea(initialValue) {
    const [selectedArea, setSelectedArea] = useState(initialValue);
    return { selectedArea, setSelectedArea };
}

