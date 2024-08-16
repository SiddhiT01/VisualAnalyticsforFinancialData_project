// Code taken from: https://stackoverflow.com/a/75920683/6246960

// src/components/Prompt.js

import { unstable_usePrompt as usePrompt } from 'react-router-dom';

const Prompt = ({ when, message }) => {
  usePrompt(message, when);

  return null;
}

export default Prompt;
