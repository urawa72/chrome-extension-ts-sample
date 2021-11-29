type EventType = 'GetPoints';

interface MessageType {
  type: EventType;
}

interface GetPointsEvent {
  inProgressStatusName: string;
  reviewStatusName: string;
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
    console.log(data);
  });
});

const getBoards = (msg: GetPointsEvent) => {
  const boards = document.querySelectorAll('[data-board-column]');
  let inProgressPoints = 0;
  let reviewPoints = 0;
  boards.forEach((board) => {
    const b: HTMLElement | null = document.getElementById(board.id);
    if (b && b.dataset.boardColumn === msg.inProgressStatusName) {
      const pointNodes = b.querySelectorAll(
        '[data-test-id="custom-label-point"]',
      );
      const points = Array.from(pointNodes).map((p) => Number(p.textContent));
      const totalPoints = points.reduce((acc: number, cur: number) => {
        return acc + cur;
      }, 0);
      inProgressPoints = totalPoints;
    }
    if (b && b.dataset.boardColumn === msg.reviewStatusName) {
      const pointNodes = b.querySelectorAll(
        '[data-test-id="custom-label-point"]',
      );
      const points = Array.from(pointNodes).map((p) => Number(p.textContent));
      const totalPoints = points.reduce((acc: number, cur: number) => {
        return acc + cur;
      }, 0);
      reviewPoints = totalPoints;
    }
  });
  return { inProgressPoints, reviewPoints };
};
