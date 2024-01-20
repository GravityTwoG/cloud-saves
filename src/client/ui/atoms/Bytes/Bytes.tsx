const sizes = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
};

export type BytesProps = {
  bytes: number;
};

export const Bytes = (props: BytesProps) => {
  if (props.bytes > sizes.GB) {
    return `${(props.bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
  if (props.bytes > sizes.MB) {
    return `${(props.bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  if (props.bytes > sizes.KB) {
    return `${(props.bytes / 1024).toFixed(2)} KB`;
  }

  return `${props.bytes} bytes`;
};
