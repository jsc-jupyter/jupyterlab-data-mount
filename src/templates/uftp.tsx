import * as React from 'react';

import { IDropdownValues, DropdownComponent } from '../components/dropdown';
import { TextField } from '../components/textfield';
import { BaseComponent } from './base';
import { IUFTPConfig } from '..';

interface IUFTPState {
  remotepath: string;
  type: string;
  auth_url: string;
  custompath: string;
}

interface IUFTPProps {
  onValueChange: any;
  ref: any;
  editable: boolean;
  options: any;
  config: IUFTPConfig;
}

export default class UFTP extends BaseComponent<IUFTPProps, IUFTPState> {
  private tooltips = {
    remotepath: 'The name of the bucket to mount',
    auth_url: 'UFTP Auth URL'
  };
  private allowedDirsIsDropdown: boolean = false;
  private allowedDirsDropdownValues: IDropdownValues[] = [];
  private authUrlsIsDropdown: boolean = false;
  private authUrlsDropdownValues: IDropdownValues[] = [];

  constructor(props: any) {
    super(props);

    if (
      !props.editable &&
      props.options &&
      Object.keys(props.options).length > 0
    ) {
      this.state = props.options;
    } else {
      const { allowed_dirs, auth_values } = this.props.config;

      let allowed_dirs_value = '/';
      if (typeof allowed_dirs === 'string') {
        allowed_dirs_value = allowed_dirs;
      } else if (allowed_dirs.length > 0) {
        allowed_dirs_value = allowed_dirs[0].value;
        this.allowedDirsDropdownValues = allowed_dirs as IDropdownValues[];
        this.allowedDirsIsDropdown = true;
      }

      let auth_value = '';
      if (typeof auth_values === 'string') {
        auth_value = auth_values;
      } else if (auth_values.length > 0) {
        auth_value = auth_values[0].value;
        this.authUrlsDropdownValues = auth_values as IDropdownValues[];
        this.authUrlsIsDropdown = true;
      }

      this.state = {
        remotepath: allowed_dirs_value,
        type: 'uftp',
        auth_url: auth_value,
        custompath: ''
      };
    }
  }

  getDisplayName() {
    const match = this.allowedDirsDropdownValues.find(
      item => item.value === this.state.remotepath
    );
    const label = match?.label || this.state.remotepath;
    const name = this.props.config.name || 'UFTP';
    return `${name} (${label})`;
  }

  render() {
    return (
      <div className="data-mount-dialog-options">
        <div className="row mb-1 data-mount-dialog-config-header">
          <p>
            {this.props.config.name} Configuration
            <a
              data-tooltip-id={'data-mount-aws-tooltip'}
              data-tooltip-html="Click for documentation"
              data-tooltip-place="left"
              className="data-mount-aws-tooltip lh-1 ms-1 data-mount-dialog-label-tooltip"
              href="https://jsc-jupyter.github.io/jupyterlab-data-mount/users/templates/aws/"
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
        {!this.allowedDirsIsDropdown && (
          <TextField
            label="Directory"
            name="remotepath"
            value={this.state.remotepath}
            onChange={this.handleTextFieldChange}
            editable={this.props.editable}
          />
        )}
        {this.allowedDirsIsDropdown && (
          <DropdownComponent
            label="Directory"
            key_="remotepath"
            selected={this.state.remotepath}
            values={this.allowedDirsDropdownValues}
            tooltip={this.tooltips.remotepath}
            onValueChange={this.handleDropdownChange}
            editable={this.props.editable}
            searchable={true}
          />
        )}
        {this.state.remotepath === '__custom__path__' && (
          <TextField
            label="Directory"
            name="custompath"
            value={this.state.custompath}
            onChange={this.handleTextFieldChange}
            editable={this.props.editable}
          />
        )}
        {!this.authUrlsIsDropdown && (
          <TextField
            label="Auth URL"
            name="auth_url"
            value={this.state.auth_url}
            onChange={this.handleTextFieldChange}
            editable={this.props.editable}
          />
        )}
        {this.authUrlsIsDropdown && this.authUrlsDropdownValues.length > 1 && (
          <DropdownComponent
            label="Auth URL"
            key_="auth_url"
            selected={this.state.auth_url}
            values={this.authUrlsDropdownValues}
            tooltip={this.tooltips.auth_url}
            onValueChange={this.handleDropdownChange}
            editable={this.props.editable}
            searchable={true}
          />
        )}
      </div>
    );
  }
}
