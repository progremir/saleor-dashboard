import { Checkbox } from "@material-ui/core";
import { MoreHorizontalIcon } from "@saleor/macaw-ui";
import { toggle } from "@saleor/utils/lists";
import React from "react";
import Spreadsheet from "react-spreadsheet";

import CardMenu, { CardMenuItem } from "../CardMenu";
import ColumnPicker from "../ColumnPicker";
import Column from "./Column";
import ColumnResize from "./ColumnResize";
import useStyles, { columnResizerWidth, rowIndicatorWidth } from "./styles";
import useDatagrid, { UseDatagridOpts } from "./useDatagrid";

export interface DatagridProps<T extends { id: string }>
  extends UseDatagridOpts<T> {
  menuItems: (id: string) => CardMenuItem[];
}

export const Datagrid = <T extends { id: string }>({
  menuItems,
  ...hookOpts
}: DatagridProps<T>): React.ReactElement => {
  const classes = useStyles();

  const {
    columns,
    data,
    rows,
    onChange,
    onColumnChange,
    onColumnMove,
    onColumnResize
  } = useDatagrid(hookOpts);

  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>([]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.scrollable}>
        <Spreadsheet
          data={data}
          columnLabels={columns.map(c => c.label)}
          className={classes.spreadsheet}
          Table={({ children }) => (
            <table className={classes.table}>
              <colgroup>
                <col className={classes.rowIndicator} />
                {columns.map(({ value, width }) => (
                  <col key={value} style={{ width }} />
                ))}
                <col className={classes.actionCol} />
              </colgroup>
              <tbody>{children}</tbody>
            </table>
          )}
          ColumnIndicator={({ column, label, onSelect }) => (
            <Column
              onClick={() => onSelect(column, true)}
              draggable
              data-column={column}
              onDrop={e => {
                const targetIndex = parseInt(
                  e.dataTransfer.getData("text/plain"),
                  10
                );
                onColumnMove(column, targetIndex);
              }}
            >
              {label}
            </Column>
          )}
          RowIndicator={({ row }) => (
            <td>
              <Checkbox
                checked={selected.includes(data[row][0].id)}
                onChange={() =>
                  setSelected(
                    toggle(data[row][0].id, selected, (a, b) => a === b)
                  )
                }
              />
            </td>
          )}
          CornerIndicator={() => <th />}
          onChange={onChange}
        />
        {columns.slice(0, -1).map((column, index) => (
          <ColumnResize
            key={`${column.value}-${column.width}`}
            offset={
              rowIndicatorWidth +
              columns.slice(0, index + 1).reduce((acc, v) => acc + v.width, 0) -
              Math.ceil(columnResizerWidth / 2)
            }
            onDrop={(_, data) => onColumnResize(column, data.x)}
          />
        ))}
      </div>
      <table className={classes.actions}>
        <tbody>
          <tr className={classes.actionRow}>
            <th>
              <ColumnPicker
                IconButtonProps={{
                  variant: "secondary"
                }}
                availableColumns={hookOpts.availableColumns}
                initialColumns={columns}
                defaultColumns={hookOpts.availableColumns.map(
                  ({ value }) => value
                )}
                onSave={onColumnChange}
                hasMore={false}
                loading={false}
                onFetchMore={() => undefined}
                onQueryChange={setQuery}
                query={query}
              />
            </th>
          </tr>
          {data.map((_, rowIndex) => (
            <tr key={rows[rowIndex]} className={classes.actionRow}>
              <td>
                <CardMenu
                  Icon={MoreHorizontalIcon}
                  menuItems={menuItems(rows[rowIndex])}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
Datagrid.displayName = "Datagrid";
export default Datagrid;