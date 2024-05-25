import classes from "./search-form.module.scss";

import SearchIcon from "@/client/ui/icons/Search.svg";
import { Button } from "@/client/ui/atoms/Button";
import { Input } from "@/client/ui/atoms/Input";

export type SearchFormProps = {
  searchQuery: string;
  onSearch: () => void;
  onQueryChange: (searchQuery: string) => void;
  placeholder?: string;
};

export const SearchForm = (props: SearchFormProps) => {
  const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSearch();
  };

  return (
    <form className={classes.SearchForm} onSubmit={onSearch}>
      <Input
        placeholder={props.placeholder || "Search"}
        className={classes.SearchInput}
        value={props.searchQuery}
        onChange={(e) => {
          if (e.target.value.trim().length === 0) {
            props.onQueryChange("");
            return;
          }

          props.onQueryChange(e.target.value);
        }}
      />
      <Button
        type="submit"
        className={classes.SearchButton}
        title="Search"
        aria-label="Search"
      >
        <SearchIcon />
      </Button>
    </form>
  );
};
