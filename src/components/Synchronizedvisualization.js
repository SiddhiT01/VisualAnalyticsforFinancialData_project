import React, { useState } from 'react';
import CircularGlyph from '../components/CircularGlyph';
import Timeserieschart from '../components/Timeserieschart';
import sampleData from '../data/artificialData.json';

const SyncedVisualization = () => {
  const [highlightedPoint, setHighlightedPoint] = useState(null);

  const handlePointHover = (point) => {
    setHighlightedPoint(point);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', height: '100vh' }}>
      <div>
        <h3>Circular Glyph</h3>
        <CircularGlyph data={sampleData} highlightedPoint={highlightedPoint} onPointHover={handlePointHover} />
      </div>
      <div>
        <h3>Timeseries Chart</h3>
        <Timeserieschart data={sampleData} highlightedPoint={highlightedPoint} />
      </div>
    </div>
  );
};

export default SyncedVisualization;
