// Code taken from: https://stackoverflow.com/a/75920683/6246960

import {unstable_useBlocker} from "react-router-dom";

const Prompt = ({ when, message }) => {
  unstable_useBlocker(() => {
    if (when) {
      return !window.confirm(message);
    }
    return false;
  })

  return <div key={when} />;
}

export default Prompt;