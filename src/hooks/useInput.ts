import { useState } from 'react';

function useInput<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const onChangeValue = (e: React.ChangeEvent<any>) => {
    setValue(e.target.value);
  };
  const onClearValue = () => setValue(initialValue);
  return {
    value,
    setValue: (newValue: T) => setValue(newValue),
    onChangeValue,
    onClearValue,
  };
}

export default useInput;
