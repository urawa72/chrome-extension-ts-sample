import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Options = () => {
  const [inProgressStatusName, setInProgressStatusName] =
    useState<string>('In Progress');
  const [reviewStatusName, setReviewStatusName] = useState<string>('Review');
  const [iterationNumber, setIterationNumber] = useState<number>(0);
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [plannedPoints, setPlannedPoints] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);

  useEffect(() => {
    chrome.storage.local.get().then((data) => {
      if (data.inProgressStatusName)
        setInProgressStatusName(data.inProgressStatusName);
      if (data.reviewStatusName) setReviewStatusName(data.reviewStatusName);
      if (data.iterationNumber) setIterationNumber(data.iterationNumber);
      if (data.plannedPoints) setPlannedPoints(data.plannedPoints);
      if (data.totalPoints) setTotalPoints(data.totalPoints);
      setInProgress(!!data.inProgress);
    });
  }, []);

  const saveOptions = () => {
    chrome.storage.local
      .set({
        inProgressStatusName,
        reviewStatusName,
        iterationNumber,
        inProgress,
        totalPoints,
        plannedPoints,
      })
      .then(() => console.log('Saved!'));
  };

  const clearOptions = () => {
    chrome.storage.local
      .remove(['iterationNumber', 'inProgress', 'totalPoints', 'plannedPoints'])
      .then(() => console.log('Cleared!'));
  };

  return (
    <>
      <h6>Status information</h6>
      <ul style={{ minWidth: '400px' }}>
        <li>
          <label htmlFor="in-progress-status-name">
            In Progress Status Name
          </label>
          <input
            id="in-progress-status-name"
            type="text"
            value={inProgressStatusName}
            onChange={(event) => setInProgressStatusName(event.target.value)}
          />
        </li>
        <li>
          <label htmlFor="review-status-name">
            Wating for Review Status Name
          </label>
          <input
            id="review-status-name"
            type="text"
            value={reviewStatusName}
            onChange={(event) => setReviewStatusName(event.target.value)}
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
          <label htmlFor="planned-points">Planned Points</label>
          <input
            id="planned-points"
            type="number"
            value={plannedPoints}
            onChange={(event) => setPlannedPoints(Number(event.target.value))}
          />
        </li>
        <li>
          <label htmlFor="total-points">Total Points</label>
          <input
            id="total-points"
            type="number"
            value={totalPoints}
            onChange={(event) => setTotalPoints(Number(event.target.value))}
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
