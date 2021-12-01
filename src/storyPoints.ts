// ref: https://gist.github.com/fr-ser/ded7690b245223094cd876069456ed6c
export const debounce = <F extends Function>(func: F, waitMs: number): F => {
  let timeoutID: number;
  return <F>(<any>function (this: any, ...args: any[]) {
    clearTimeout(timeoutID);
    const context = this;
    timeoutID = window.setTimeout(function () {
      func.apply(context, args);
    }, waitMs);
  });
};

const getBoard = () => {
  const boards = document.querySelectorAll('[data-board-column]');
  const boardIds = Array.from(boards).map((board) => board.id);
  return boardIds
    .map((boardId) => document.getElementById(boardId))
    .filter((board) => board != null);
};

const callback = () => {
  getBoard().forEach((board) => {
    if (board) {
      const pointNodes = board.querySelectorAll(
        '[data-test-id="custom-label-Point"]',
      );
      if (!pointNodes) {
        return;
      }

      const totalPoint = Array.from(pointNodes)
        .map((p) => Number(p.textContent))
        .reduce((acc, cur) => {
          return acc + cur;
        }, 0)
        .toString();
      const totalPointLabel = `${totalPoint}pt`;

      const totalPointNode = board.querySelector(
        '.js-total-story-point',
      ) as HTMLSpanElement;

      if (totalPointNode) {
        totalPointNode.innerText = totalPointLabel;
      } else {
        const columnCounter = board.querySelector(
          '[data-test-id="column-counter"]',
        );
        if (columnCounter) {
          let pointNode = columnCounter.cloneNode(false) as HTMLSpanElement;
          pointNode.classList.add('js-total-story-point');
          pointNode.innerText = totalPointLabel;
          columnCounter.insertAdjacentHTML('afterend', pointNode.outerHTML);
        }
      }
    }
  });
};

const waitMs = 300;
const observer = new MutationObserver(debounce(callback, waitMs));
const target = document.querySelector('[data-test-id="board-view"]');

if (!!target) {
  observer.observe(target, { attributes: true, subtree: true });
} else {
  throw new Error('[GitHub Project Story Points] board-view is missing');
}
