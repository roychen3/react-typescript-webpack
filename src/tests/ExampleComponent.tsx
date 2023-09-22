import { useState } from 'react';

import { sum } from '@/src/tests/example-ts';

interface ExampleComponentProps {
  defaultA?: number;
  defaultB?: number;
}
export default function ExampleComponent({
  defaultA = 0,
  defaultB = 0,
}: ExampleComponentProps) {
  const [aInput, setAInput] = useState(defaultA);
  const [bInput, setBInput] = useState(defaultB);
  const [result, setResult] = useState(0);

  const validateValue = (value: string): number => {
    if (!value) {
      return 0;
    }

    const newNumber = Number.parseInt(value);
    return newNumber;
  };

  return (
    <div>
      <h1>ExampleComponent</h1>
      <div data-testid="result">result:{result}</div>
      <input
        data-testid="a-input"
        type="number"
        value={aInput}
        onChange={(event) => {
          const newValue = validateValue(event.target.value);
          setAInput(newValue);
        }}
      />
      <input
        data-testid="b-input"
        type="number"
        value={bInput}
        onChange={(event) => {
          const newValue = validateValue(event.target.value);
          setBInput(newValue);
        }}
      />
      <button
        data-testid="calculate-btn"
        onClick={() => {
          const newResult = sum(aInput, bInput);
          setResult(newResult);
        }}>
        Calculate
      </button>
    </div>
  );
}
