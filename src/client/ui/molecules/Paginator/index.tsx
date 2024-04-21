import { clsx } from "clsx";
import classes from "./paginator.module.scss";
import { ReactTagProps } from "../../types";
import { useMemo } from "react";

export type PaginatorProps = {
  pageSize: number;
  count: number;
  currentPage: number;
  onPageSelect: (page: number) => void;
  scope?: number;
};

const usePagination = (props: {
  pageSize: number;
  scope?: number;
  count: number;
  currentPage: number;
}) => {
  const pagination = useMemo(() => {
    const pagesCount = Math.ceil(props.count / props.pageSize);
    const scope = props.scope || 3;

    const pages = [];
    for (
      let i = Math.max(props.currentPage - scope, 0);
      i < props.currentPage + scope && i < pagesCount;
      i++
    ) {
      pages.push(i + 1);
    }

    const firstPage = 1;
    const lastPage = Math.max(pagesCount, 1);

    return {
      pages,
      firstPage,
      lastPage,
      showFirstPage: firstPage < props.currentPage - scope,
      showLastPage: lastPage > props.currentPage + scope,
      showPrevPage: props.currentPage > firstPage,
      showNextPage: props.currentPage < lastPage,
    };
  }, [props.currentPage, props.pageSize, props.count]);

  return pagination;
};

export const Paginator = (props: PaginatorProps) => {
  const {
    pages,
    firstPage,
    lastPage,
    showFirstPage,
    showLastPage,
    showPrevPage,
    showNextPage,
  } = usePagination(props);

  return (
    <div className={clsx(classes.Paginator)}>
      {showFirstPage && (
        <PageButton
          pageNumber={"<<"}
          isCurrentPage={false}
          onClick={() => props.onPageSelect(firstPage)}
          title="First page"
          aria-label="First page"
        />
      )}

      <PageButton
        pageNumber={"<"}
        isCurrentPage={false}
        onClick={() =>
          showPrevPage && props.onPageSelect(props.currentPage - 1)
        }
        title="Previous page"
        aria-label="Previous page"
        className={clsx(!showPrevPage && classes.PageButtonHidden)}
      />

      {pages.map((page) => (
        <PageButton
          key={page}
          pageNumber={page}
          isCurrentPage={page === props.currentPage}
          onClick={() => props.onPageSelect(page)}
          title={`Page ${page}`}
          aria-label={`Page ${page}`}
        />
      ))}

      <PageButton
        pageNumber={">"}
        isCurrentPage={false}
        onClick={() =>
          showNextPage && props.onPageSelect(props.currentPage + 1)
        }
        title="Next page"
        aria-label="Next page"
        className={clsx(!showNextPage && classes.PageButtonHidden)}
      />

      {showLastPage && (
        <PageButton
          pageNumber={">>"}
          isCurrentPage={false}
          onClick={() => props.onPageSelect(lastPage)}
          title="Last page"
          aria-label="Last page"
        />
      )}
    </div>
  );
};

type PageButtonProps = {
  pageNumber: string | number;
  isCurrentPage: boolean;
} & ReactTagProps<"button">;

const PageButton = ({
  pageNumber,
  isCurrentPage,
  ...props
}: PageButtonProps) => {
  return (
    <button
      {...props}
      className={clsx(
        classes.PageButton,
        props.className,
        isCurrentPage && classes.PageButtonCurrent,
      )}
    >
      {pageNumber}
    </button>
  );
};
