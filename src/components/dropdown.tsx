import * as React from 'react';
import Select from 'react-select';
import { Tooltip } from 'react-tooltip';

export interface IDropdownValues {
  value: string;
  label: string;
}

interface IDropdownProps {
  label: string;
  key_: string;
  selected: any;
  values: Array<IDropdownValues>;
  onValueChange: any;
  editable: boolean;
  tooltip?: string;
  searchable?: boolean;
}

export class DropdownComponent extends React.Component<IDropdownProps> {
  private selectRef: React.RefObject<HTMLSelectElement>;

  constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearchableChange = this.handleSearchableChange.bind(this);

    this.selectRef = React.createRef();
  }

  handleChange = (event: any) => {
    this.props.onValueChange(this.props.key_, event.target.value);
  };
  handleSearchableChange = (event: any) => {
    this.props.onValueChange(this.props.key_, event.value);
  };

  render() {
    const selected = this.props.selected;
    const values = this.props.values;
    const label = this.props.label;
    const tooltip = this.props.tooltip;
    const valuesReact = values.map(x => {
      if (x.value === selected) {
        return (
          <option value={x.value} selected>
            {x.label}
          </option>
        );
      } else {
        return <option value={x.value}>{x.label}</option>;
      }
    });

    // <div className="lm-Widget p-Widget jp-Dialog-body" style={{ overflow: 'visible' }}>
    return (
      <div className="row">
        <div className="col-12">
          <div className="row mb-1">
            {label && (
              <div className="col-4 col-form-label d-flex align-items-center">
                <label>{label}:</label>
                {tooltip && (
                  <a
                    data-tooltip-id={`data-mount-tooltip-${name}`}
                    data-tooltip-html={tooltip}
                    data-tooltip-place="top"
                    className="lh-1 ms-auto data-mount-dialog-label-tooltip"
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
                )}
              </div>
            )}
            <div className="col-8 d-flex flex-column justify-content-center">
              {this.props.searchable && (
                <Select
                  options={values}
                  value={values.find(option => option.value === selected)}
                  isDisabled={!this.props.editable}
                  placeholder="Select an option"
                  onChange={this.handleSearchableChange}
                  styles={{
                    menu: (provided: any) => ({
                      ...provided,
                      maxHeight: '300px',
                      overflowY: 'auto',
                      zIndex: 9999
                    })
                  }}
                />
              )}
              {!this.props.searchable && (
                <select
                  ref={this.selectRef}
                  className="data-mount-select"
                  key={this.props.key_}
                  disabled={!this.props.editable}
                  name={this.props.key_}
                  onChange={this.handleChange}
                >
                  {valuesReact}
                </select>
              )}
            </div>
          </div>
        </div>
        <Tooltip id={`data-mount-tooltip-${name}`} />
      </div>
    );
  }
}
