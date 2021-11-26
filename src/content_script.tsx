chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  sendResponse(getBoards());
});

const getBoards = (): number => {
  const boards = document.querySelectorAll("[data-board-column]");
  let result = 0;
  boards.forEach((board) => {
    const b: any = document.getElementById(board.id);
    if (b.dataset.boardColumn == "In Progress") {
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
      result += points;
    }
  });
  return result;
};
