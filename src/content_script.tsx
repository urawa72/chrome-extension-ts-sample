type EventType = 'GetPoints';

interface MessageType {
  type: EventType;
}

interface GetPointsEvent {
  doneStatusName: string;
}

chrome.runtime.onMessage.addListener(function (
  msg: MessageType & GetPointsEvent,
  _,
  sendResponse,
) {
  if (msg.type === 'GetPoints') {
    sendResponse(getBoards(msg));
  }
  chrome.storage.local.get().then((data) => {
    console.log('Storage:', data);
  });
});

const getBoards = (msg: GetPointsEvent) => {
  const boards = document.querySelectorAll('[data-board-column]');
  let currentDonePoints = 0;
  boards.forEach((board) => {
    const b: HTMLElement | null = document.getElementById(board.id);
    if (b && b.dataset.boardColumn === msg.doneStatusName) {
      const pointNodes = b.querySelectorAll(
        '[data-test-id="custom-label-Point"]',
      );
      currentDonePoints = Array.from(pointNodes)
        .map((p) => Number(p.textContent))
        .reduce((acc: number, cur: number) => {
          return acc + cur;
        }, 0);
    }
  });
  return currentDonePoints;
};
