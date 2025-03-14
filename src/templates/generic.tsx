import * as React from 'react';

import OptionRow from '../components/optionrow';
import { BaseComponent } from './base';
import { Tooltip } from 'react-tooltip';

interface IGenericState {
  rows: any[];
}

interface IGenericProps {
  onValueChange: any;
  ref: any;
  editable: boolean;
  options: any;
}

export default class Generic extends BaseComponent<
  IGenericProps,
  IGenericState
> {
  constructor(props: any) {
    super(props);

    if (
      !props.editable &&
      props.options &&
      Object.keys(props.options).length > 0
    ) {
      const rows = Object.entries(props.options)
        .filter(([key, value]) => !['displayName', 'readonly'].includes(key))
        .map(([key, value], index) => ({
          valueFirst: key,
          valueSecond: value,
          invalid: false,
          index: index
        }));
      this.state = {
        rows: rows
      };
    } else {
      this.state = {
        rows: [
          {
            valueFirst: 'type',
            valueSecond: 's3',
            invalid: false,
            index: 0
          }
        ]
      };
    }
    this.onTextChange = this.onTextChange.bind(this);
    this.addRow = this.addRow.bind(this);
    this.delRow = this.delRow.bind(this);
  }

  onTextChange(index: number, key: string, value: string) {
    // check for duplicated keys
    const isKeyDuplicate = this.state.rows.some(
      (row: any) =>
        row.index !== index && row.valueFirst === key && !row.invalid
    );

    // Update row with row.index == index
    const updatedRows = this.state.rows.map((row: any) => {
      if (row.index === index) {
        return {
          ...row,
          valueFirst: key,
          valueSecond: value,
          invalid: isKeyDuplicate
        };
      }
      return row;
    });

    this.setState({ rows: updatedRows }, () => {
      if (this.props.onValueChange) {
        this.props.onValueChange();
      }
    });
  }

  getValue() {
    const rowDict = this.state.rows.reduce(
      (acc: Record<string, string>, row: any) => {
        acc[row.valueFirst] = row.valueSecond;
        return acc;
      },
      {}
    );
    return rowDict;
  }

  addRow() {
    const newIndex = this.state.rows[this.state.rows.length - 1].index + 1;
    const newRow = {
      valueFirst: '',
      valueSecond: '',
      invalid: false,
      index: newIndex
    };
    this.setState(prevState => ({
      rows: [...prevState.rows, newRow]
    }));
  }

  delRow(index: number) {
    const updatedRows = this.state.rows.filter(
      (row: any) => row.index !== index
    );
    this.setState({ rows: updatedRows }, () => {
      if (this.props.onValueChange) {
        this.props.onValueChange();
      }
    });
  }

  getDisplayName() {
    return `Generic ${this.state.rows[0].valueSecond}`;
  }

  render() {
    return (
      <>
        <div className="data-mount-dialog-options">
          <div className="row mb-1 data-mount-dialog-config-header">
            <p>
              Generic Configuration
              <a
                data-tooltip-id={'data-mount-generic-tooltip'}
                data-tooltip-html="Click for documentation"
                data-tooltip-place="left"
                className="data-mount-generic-tooltip lh-1 ms-1 data-mount-dialog-label-tooltip"
                href="https://jsc-jupyter.github.io/jupyterlab-data-mount/users/templates/generic/"
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-info-circle"
                  viewBox="0 0 16 16"
                  style={{ verticalAlign: 'sub' }}
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
                </svg>
              </a>
            </p>
          </div>
          <Tooltip id={'data-mount-generic-tooltip'} />
          {this.state.rows.map(row => (
            <OptionRow
              index={row.index}
              totalCount={this.state.rows.length}
              valueFirst={row.valueFirst}
              valueSecond={row.valueSecond}
              invalid={row.invalid}
              onTextChange={this.onTextChange}
              addButton={this.addRow}
              delButton={this.delRow}
              placeholderFirst="key"
              placeholderSecond="value"
              editable={this.props.editable}
            />
          ))}
        </div>
      </>
    );
  }
}
