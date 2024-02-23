import classes from "./search-form.module.scss";

import SearchIcon from "@/client/ui/icons/Search.svg";
import { Button } from "@/client/ui/atoms/Button/Button";
import { Input } from "@/client/ui/atoms/Input/Input";

export type SearchFormProps = {
  searchQuery: string;
  onSearch: () => void;
  onQueryChange: (searchQuery: string) => void;
};

export const SearchForm = (props: SearchFormProps) => {
  const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSearch();
  };

  return (
    <form className={classes.SearchForm} onSubmit={onSearch}>
      <Input
        placeholder="Search"
        className={classes.SearchInput}
        value={props.searchQuery}
        onChange={(e) => props.onQueryChange(e.target.value)}
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
