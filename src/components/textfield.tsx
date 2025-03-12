import React, { Component } from 'react';
import { Tooltip } from 'react-tooltip';

export interface ITextFieldProps {
  label: string;
  name: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  tooltip?: string;
  required?: boolean;
  editable: boolean | true;
  type?: 'text' | 'password';
}

interface ITextFieldState {
  value: string;
  showPassword: boolean;
}

export class TextField extends Component<ITextFieldProps, ITextFieldState> {
  constructor(props: ITextFieldProps) {
    super(props);

    this.state = {
      value: props.value || '',
      showPassword: props.type === 'password' ? false : true
    };

    // Bind the methods to the instance
    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    this.setState({ value });
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  // Method to toggle password visibility
  togglePasswordVisibility() {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword
    }));
  }

  // Method to get the current value of the text input
  getValue() {
    return this.state.value;
  }

  render() {
    const {
      label,
      name,
      value,
      type = 'text',
      placeholder,
      required,
      tooltip
    } = this.props;
    const { showPassword } = this.state;
    const inputType =
      type === 'password' && !showPassword ? 'password' : 'text';

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
              <div className="input-group">
                <input
                  type={inputType}
                  value={value}
                  name={name}
                  onChange={this.handleChange}
                  placeholder={placeholder}
                  disabled={!this.props.editable}
                  required={required}
                  className="form-control data-mount-dialog-textfield"
                />
                {type === 'password' && (
                  <span className="input-group-append">
                    <button
                      className="btn btn-light"
                      type="button"
                      onClick={this.togglePasswordVisibility}
                    >
                      <i
                        className={`fa ${
                          showPassword ? 'fa-eye-slash' : 'fa-eye'
                        }`}
                        aria-hidden="true"
                      ></i>
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <Tooltip id={`data-mount-tooltip-${name}`} />
      </div>
    );
  }
}
