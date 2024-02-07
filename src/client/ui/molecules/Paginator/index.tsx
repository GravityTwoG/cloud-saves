import { clsx } from "clsx";
import classes from "./paginator.module.scss";

export type PaginatorProps = {
  pageSize: number;
  count: number;
  currentPage: number;
  onPageSelect: (page: number) => void;
  scope?: number;
};

export const Paginator = (props: PaginatorProps) => {
  const pagesCount = Math.ceil(props.count / props.pageSize);
  const scope = props.scope || 3;

  const firstPage = 0;
  const lastPage = Math.max(pagesCount - 1, 0);

  const pages = [];
  for (
    let i = props.currentPage - scope;
    i < props.currentPage + scope && i < pagesCount;
    i++
  ) {
    if (i >= 0) {
      pages.push(i);
    }
  }

  return (
    <div className={clsx(classes.Paginator)}>
      {firstPage < props.currentPage - scope && (
        <PageButton
          pageNumber={"<<"}
          isCurrentPage={false}
          onClick={() => props.onPageSelect(firstPage)}
        />
      )}

      {props.currentPage !== firstPage && (
        <PageButton
          pageNumber={"<"}
          isCurrentPage={false}
          onClick={() => props.onPageSelect(props.currentPage - 1)}
        />
      )}

      {pages.map((page) => (
        <PageButton
          key={page}
          pageNumber={page + 1}
          isCurrentPage={page === props.currentPage}
          onClick={() => props.onPageSelect(page)}
        />
      ))}

      {props.currentPage !== lastPage && (
        <PageButton
          pageNumber={">"}
          isCurrentPage={false}
          onClick={() => props.onPageSelect(props.currentPage + 1)}
        />
      )}

      {lastPage > props.currentPage + scope && (
        <PageButton
          pageNumber={">>"}
          isCurrentPage={false}
          onClick={() => props.onPageSelect(lastPage)}
        />
      )}
    </div>
  );
};

type PageButtonProps = {
  pageNumber: string | number;
  isCurrentPage: boolean;
  onClick: () => void;
};

const PageButton = (props: PageButtonProps) => {
  return (
    <button
      className={clsx(
        classes.PageButton,
        props.isCurrentPage && classes.PageButtonCurrent
      )}
      onClick={props.onClick}
    >
      {props.pageNumber}
    </button>
  );
};
