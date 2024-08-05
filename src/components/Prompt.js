// Code taken from: https://stackoverflow.com/a/75920683/6246960

// src/components/Prompt.js
import useBlocker from './useblocker';

const Prompt = ({ when, message }) => {
  useBlocker(when, message);

  return <div key={when} />;
}

export default Prompt;
