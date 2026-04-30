import {
  Field,
  Input,
  type InputOnChangeData,
} from "@fluentui/react-components";
import type { ChangeEvent } from "react";

import styles from "./ProductSearchBox.module.css";

type ProductSearchBoxProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

export function ProductSearchBox({ query, onQueryChange }: ProductSearchBoxProps) {
  return (
    <div className={styles.root}>
      <Field
        label="商品を検索"
        hint="商品名、カナ、ブランド、カテゴリ、タグ、商品コードで検索できます。"
      >
        <Input
          className={styles.input}
          value={query}
          placeholder="例: トマト、ヨーグルト、FD-CND"
          onChange={(
            _event: ChangeEvent<HTMLInputElement>,
            data: InputOnChangeData,
          ) => onQueryChange(data.value)}
          size="large"
        />
      </Field>
    </div>
  );
}
