import { getBoards, getPoints, getPointNodes } from './util';

interface GetPointMessage {
  doneStatusName: string;
}

chrome.runtime.onMessage.addListener(function (
  msg: GetPointMessage,
  _,
  sendResponse,
) {
  const boards = getBoards();
  const donePoint = getBoardPoint(boards, msg.doneStatusName);
  sendResponse(donePoint);
});

const getBoardPoint = (boards: (HTMLElement | null)[], status: string) => {
  boards.forEach((board) => {
    if (board && board.dataset.boardColumn === status) {
      const targetPointNodes = getPointNodes(board);
      if (!targetPointNodes) {
        return 0;
      }
      return getPoints(targetPointNodes);
    }
  });
};
