let contentElem: HTMLElement | null = null;

const getContentElem = () => {
  if (!contentElem) {
    contentElem = document.querySelector("main");
  }

  return contentElem;
};

export const scrollToTop = () => {
  getContentElem()?.scrollTo(0, 0);
};
