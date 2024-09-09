import React, { useState } from 'react';
import { Range } from 'react-range';

const MultiRangeSlider = ({ data, onChange }) => {
  const [values, setValues] = useState([0, data.length - 1]);
  const [validStartDate, setValidStartDate] = useState(data[0].date);
  const [validEndDate, setValidEndDate] = useState(data[data.length - 1].date);

  const handleRangeChange = (values) => {
    setValues(values);
    
    let startDate = data[values[0]] ? data[values[0]].date : validStartDate;
    let endDate = data[values[1]] ? data[values[1]].date : validEndDate;

    // Ensure the selected dates are valid; otherwise, revert to the last valid date
    if (isNaN(new Date(startDate))) {
      startDate = validStartDate;
    } else {
      setValidStartDate(startDate);  // Update the valid start date
    }

    if (isNaN(new Date(endDate))) {
      endDate = validEndDate;
    } else {
      setValidEndDate(endDate);  // Update the valid end date
    }

    onChange(new Date(startDate), new Date(endDate));
  };

  const formatMonthYear = (date) => {
    if (!date || isNaN(new Date(date))) {
      return "Invalid Date";  // This should never be shown because of the above logic
    }
    return new Date(date).toLocaleString('default', { month: 'short', year: 'numeric' });
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
        <span>{formatMonthYear(validStartDate)}</span>
        <span>{formatMonthYear(validEndDate)}</span>
      </div>
    </div>
  );
};

export default MultiRangeSlider;


