import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Options = () => {
  const [doneStatusName, setDoneStatusName] = useState<string>('Done');
  const [iterationNumber, setIterationNumber] = useState<number>(0);
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [totalPoint, setTotalPoint] = useState<number>(0);

  useEffect(() => {
    chrome.storage.local.get().then((data) => {
      if (data.doneStatusName) setDoneStatusName(data.doneStatusName);
      if (data.iterationNumber) setIterationNumber(data.iterationNumber);
      if (data.totalPoint) setTotalPoint(data.totalPoint);
      setInProgress(!!data.inProgress);
    });
  }, []);

  const saveOptions = () => {
    chrome.storage.local
      .set({
        doneStatusName,
        iterationNumber,
        inProgress,
        totalPoint,
      })
      .then(() => console.log('Saved!'));
  };

  const clearOptions = () => {
    chrome.storage.local
      .remove(['iterationNumber', 'inProgress', 'totalPoint'])
      .then(() => console.log('Cleared!'));
  };

  return (
    <>
      <h6>Status information</h6>
      <ul style={{ minWidth: '400px' }}>
        <li>
          <label htmlFor="done-status-name">Done Status Name</label>
          <input
            id="done-status-name"
            type="text"
            value={doneStatusName}
            onChange={(event) => setDoneStatusName(event.target.value)}
          />
        </li>
      </ul>
      <hr />
      <h6>Point information</h6>
      <ul style={{ minWidth: '400px' }}>
        <li>
          <label htmlFor="iteration-number">Iteration Number</label>
          <input
            id="iteration-number"
            type="number"
            value={iterationNumber}
            onChange={(event) => setIterationNumber(Number(event.target.value))}
          />
        </li>
        <li>
          <label htmlFor="in-progress">In Progress</label>
          <input
            id="in-progress"
            type="checkbox"
            checked={inProgress}
            onChange={(event) => setInProgress(event.target.checked)}
          />
        </li>
        <li>
          <label htmlFor="total-points">Total Points</label>
          <input
            id="total-points"
            type="number"
            value={totalPoint}
            onChange={(event) => setTotalPoint(Number(event.target.value))}
          />
        </li>
      </ul>
      <button onClick={saveOptions}>Save</button>
      <button onClick={clearOptions}>Clear</button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById('root'),
);
