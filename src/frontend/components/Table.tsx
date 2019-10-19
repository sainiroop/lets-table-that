/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import * as React from "react";
import { Table, SimpleTableDataProvider, ColumnDescription, RowItem } from "@bentley/ui-components";
import { PropertyRecord, PropertyValue, PropertyValueFormat, PropertyDescription, IModelApp } from "@bentley/imodeljs-frontend";

export interface Props {
  data: any[];
}

/** Table component for the viewer app */
export default class SimpleTableComponent extends React.PureComponent<Props> {

  // creating a simple table data provider.
  private _getDataProvider = (): SimpleTableDataProvider => {

    // adding columns

    const columns: ColumnDescription[] = [];

    columns.push({key: "element_id", label: "Element ID"});
    columns.push({key: "lyrics", label: "lyrics"});
    columns.push({key: "to", label: "to"});
    columns.push({key: "jimi", label: "jimi"});
    columns.push({key: "hendrix", label: "hendrix"});
    columns.push({key: "song", label: "song"});

    const dataProvider: SimpleTableDataProvider = new SimpleTableDataProvider(columns);

    // adding rows => cells => property record => value and description.

    this.props.data.forEach((rowData: [], index) => {
      const rowItem: RowItem = {key: index.toString(), cells: []};
      rowData.forEach((cellValue: string, i: number) => {
      const value: PropertyValue = {valueFormat: PropertyValueFormat.Primitive, value: cellValue};
      const description: PropertyDescription = {displayLabel: columns[i].label, name: columns[i].key, typename: "string"};
      rowItem.cells.push({key: columns[i].key, record: new PropertyRecord(value, description)});
      });
      dataProvider.addRow(rowItem);
    });

    return dataProvider;
  }

  // bonus: zooming into and highlighting element when row is selected.
  private _onRowsSelected = async (rowIterator: AsyncIterableIterator<RowItem>) => {

    const row = await rowIterator.next();
    const elementId = (row.value.cells[0].record!.value as any).value;

    const vp = IModelApp.viewManager.selectedView!;
    vp.zoomToElements(elementId);
    vp.iModel.selectionSet.replace(elementId);

    return Promise.resolve(true);
  }

  public render() {
    return (
      <div style={{ height: "100%" }}>
        <Table dataProvider={this._getDataProvider()} onRowsSelected={this._onRowsSelected} />
      </div>
    );
  }
}
