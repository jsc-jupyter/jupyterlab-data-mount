import * as React from 'react';
import { Tooltip } from 'react-tooltip';
import { PlusIcon, DeleteIcon } from '../icon';

export interface IOptionRowProps {
  index: number;
  totalCount: number;
  valueFirst?: string;
  valueSecond?: string;
  onTextChange?: (index: number, key: string, value: string) => void;
  addButton?: any;
  delButton?: any;
  placeholderFirst?: string;
  placeholderSecond?: string;
  tooltip?: string;
  invalid?: boolean | false;
  editable: boolean | true;
}

interface IOptionRowState {
  valueFirst: string;
  valueSecond: string;
}

export default class OptionRow extends React.Component<
  IOptionRowProps,
  IOptionRowState
> {
  private keyRef: any;
  private valueRef: any;

  constructor(props: IOptionRowProps) {
    super(props);

    this.state = {
      valueFirst: props.valueFirst || '',
      valueSecond: props.valueSecond || ''
    };

    this.handleKeyChange = this.handleKeyChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleDel = this.handleDel.bind(this);
    this.keyRef = React.createRef();
    this.valueRef = React.createRef();
  }

  handleAdd = () => {
    if (this.props.addButton) {
      this.props.addButton();
    }
  };

  handleDel = () => {
    if (this.props.delButton) {
      this.props.delButton(this.props.index);
    }
  };

  handleKeyChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ valueFirst: event.target.value });
    if (this.props.onTextChange) {
      const value = this.valueRef.current.value;
      this.props.onTextChange(this.props.index, event.target.value, value);
    }
  }

  handleValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ valueSecond: event.target.value });
    if (this.props.onTextChange) {
      const key = this.keyRef.current.value;
      this.props.onTextChange(this.props.index, key, event.target.value);
    }
  }

  render() {
    const {
      valueFirst,
      valueSecond,
      placeholderFirst,
      placeholderSecond,
      editable
    } = this.props;
    const colElements = 'col-12';
    return (
      <div className="row">
        <div className="col-12">
          <div className="row mb-1">
            <div className={`${colElements} d-flex justify-content-center`}>
              <input
                type="text"
                ref={this.keyRef}
                value={valueFirst}
                onChange={this.handleKeyChange}
                placeholder={placeholderFirst}
                disabled={!editable || this.props.index === 0}
                className={`form-control data-mount-dialog-textfield ${
                  this.props.invalid ? 'invalid' : ''
                }`}
              />
              <input
                type="text"
                ref={this.valueRef}
                value={valueSecond}
                onChange={this.handleValueChange}
                placeholder={placeholderSecond}
                disabled={!editable}
                className="form-control data-mount-dialog-textfield"
              />
              {this.props.index !== 0 && (
                <button
                  style={{ marginLeft: '8px' }}
                  className="icon-button"
                  onClick={this.handleDel}
                  disabled={!editable}
                >
                  <DeleteIcon.react tag="span" width="16px" height="16px" />
                </button>
              )}
              {this.props.index === 0 && (
                <button
                  style={{
                    marginLeft: '8px',
                    opacity: 0,
                    pointerEvents: 'none'
                  }}
                  className="icon-button"
                  disabled={true}
                >
                  <DeleteIcon.react tag="span" width="16px" height="16px" />
                </button>
              )}
              <button
                style={{ marginLeft: '8px' }}
                className="icon-button"
                onClick={this.handleAdd}
                disabled={!editable}
              >
                <PlusIcon.react tag="span" width="16px" height="16px" />
              </button>
            </div>
          </div>
        </div>
        <Tooltip id={`data-mount-tooltip-${name}`} />
      </div>
    );
  }
}
