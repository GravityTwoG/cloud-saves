import classes from './preloader.module.scss';

import { ReactTagProps } from '../../types';

import { Spinner } from '../../atoms/Spinner';
import clsx from 'clsx';

export type PreloaderProps = ReactTagProps<'div'> & { isLoading: boolean };

export const Preloader = ({
  children,
  isLoading,
  ...props
}: PreloaderProps) => {
  return (
    <div {...props} className={clsx(props.className, classes.Preloader)}>
      {children}

      <div className={classes.Spinner} data-is-visible={isLoading}>
        <Spinner />
      </div>
    </div>
  );
};
