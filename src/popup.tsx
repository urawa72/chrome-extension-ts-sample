import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Popup = () => {
  const [inProgressStatusName, setInProgressStatusName] =
    useState<string>('In Progress');
  const [reviewStatusName, setReviewStatusName] = useState<string>('Review');
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [inProgressPoints, setInProgressPoints] = useState<number>(0);
  const [plannedPoints, setPlannedPoints] = useState<number>(0);
  const [reviewPoints, setReviewPoints] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.storage.local.get().then((data) => {
        if (data.inProgressStatusName)
          setInProgressStatusName(data.inProgressStatusName);
        if (data.reviewStatusName) setReviewStatusName(data.reviewStatusName);
        if (data.plannedPoints) setPlannedPoints(data.plannedPoints);
        if (data.totalPoints) setTotalPoints(data.totalPoints);
        setInProgress(!!data.inProgress);
      });
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          { type: 'GetPoints', inProgressStatusName, reviewStatusName },
          (points) => {
            setInProgressPoints(points.inProgressPoints);
            setReviewPoints(points.reviewPoints);
          },
        );
      }
    });
  }, []);

  const start = () => {
    setInProgress(true);
    setPlannedPoints(inProgressPoints);
    chrome.storage.local
      .set({ inProgress: true, plannedPoints: inProgressPoints })
      .then(() => console.log('Started!'));
  };

  const finished = () => {
    setInProgress(false);
    setPlannedPoints(0);
    const total = totalPoints + Math.max(0, plannedPoints - inProgressPoints);
    setTotalPoints(total);
    chrome.storage.local
      .set({
        inProgress: false,
        totalPoints: total,
        plannedPoints: 0,
      })
      .then(() => console.log('Finished!'));
  };

  return (
    <>
      <h6>Point information</h6>
      <ul style={{ minWidth: '300px' }}>
        <li>Planned Points: {plannedPoints}</li>
        <li>
          {inProgressStatusName} Points: {inProgressPoints}
        </li>
        <li>
          {reviewStatusName} Points: {reviewPoints}
        </li>
        <li>
          Finished Points: {inProgress ? plannedPoints - inProgressPoints : '-'}
        </li>
        <li>Total Points: {totalPoints}</li>
      </ul>
      <button onClick={start} disabled={inProgress}>
        Start
      </button>
      <button onClick={finished} disabled={!inProgress}>
        Finished
      </button>
      <a href={chrome.runtime.getURL('options.html')}>Options</a>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root'),
);
