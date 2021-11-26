import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const getBoards = () => {
  const boards = document.querySelectorAll("[data-board-column]");
  boards.forEach((board) => {
    const b: any = document.getElementById(board.id);
    const pointNodes = b.querySelectorAll(
      '[data-test-id="custom-label-point"]'
    );
    let sum: any = [];
    pointNodes.forEach((p: any) => {
      sum.push(Number(p.textContent));
    });
    const points = sum.reduce((acc: number, cur: number) => {
      return acc + cur;
    }, 0);
    console.log(points);
  });
};

const Popup = () => {
  const [count, setCount] = useState(0);
  const [currentURL, setCurrentURL] = useState<string>();

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  const changeBackground = () => {
    getBoards();
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            color: "#555555",
          },
          (msg) => {
            console.log("result message:", msg);
          }
        );
      }
    });
  };

  return (
    <>
      <ul style={{ minWidth: "700px" }}>
        <li>Current URL: {currentURL}</li>
        <li>Current Time: {new Date().toLocaleTimeString()}</li>
      </ul>
      <button
        onClick={() => setCount(count + 1)}
        style={{ marginRight: "5px" }}
      >
        count up
      </button>
      <button onClick={changeBackground}>change background</button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
