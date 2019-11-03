import React from 'react';
import ReactDOM from 'react-dom';

import ProceCalc from './component/proce_calc';

function App() {
  return (
    <>
      <ProceCalc />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
