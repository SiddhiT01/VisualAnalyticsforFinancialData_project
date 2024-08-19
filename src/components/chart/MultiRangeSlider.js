import React, { useState } from 'react';
import { Range } from 'react-range';

const MultiRangeSlider = ({ data, onChange }) => {
  const [values, setValues] = useState([0, data.length - 1]);

  const handleRangeChange = (values) => {
    setValues(values);
    const selectedStartDate = data[values[0]].date;
    const selectedEndDate = data[values[1]].date;
    onChange(new Date(selectedStartDate), new Date(selectedEndDate));
  };

  return (
    <div style={{ padding: '20px', width: '100%' }}>
      <Range
        step={1}
        min={0}
        max={data.length - 1}
        values={values}
        onChange={handleRangeChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '6px',
              width: '100%',
              backgroundColor: '#ccc',
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '24px',
              width: '24px',
              borderRadius: '50%',
              backgroundColor: '#2E8540',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0px 2px 6px #AAA',
            }}
          />
        )}
      />
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <span>{new Date(data[values[0]].date).toDateString()}</span>
        <span>{new Date(data[values[1]].date).toDateString()}</span>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
