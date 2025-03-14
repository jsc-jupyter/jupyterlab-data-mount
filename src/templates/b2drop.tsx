import * as React from 'react';

import { TextField } from '../components/textfield';
import { BaseComponent } from './base';

interface IB2DropState {
  remotepath: string;
  type: string;
  url: string;
  vendor: string;
  user: string;
  obscure_pass: string;
}

interface IB2DropProps {
  onValueChange: any;
  ref: any;
  editable: boolean;
  options: any;
}

export default class B2Drop extends BaseComponent<IB2DropProps, IB2DropState> {
  private tooltips = {
    remotepath: 'Path in B2Drop to mount. "/" mounts all of your B2Drop files',
    user: 'User name or App name',
    obscure_pass: 'Password or App password'
  };

  constructor(props: any) {
    super(props);
    this.handleUserTextFieldChange = this.handleUserTextFieldChange.bind(this);
    if (
      !props.editable &&
      props.options &&
      Object.keys(props.options).length > 0
    ) {
      this.state = props.options;
    } else {
      this.state = {
        remotepath: '/',
        type: 'webdav',
        url: 'https://b2drop.eudat.eu/remote.php/webdav/',
        vendor: 'nextcloud',
        user: '',
        obscure_pass: ''
      };
    }
  }

  getDisplayName() {
    return 'B2Drop';
  }

  handleUserTextFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    this.setState(
      {
        user: value,
        url: `https://b2drop.eudat.eu/remote.php/dav/files/${value}/`
      },
      () => {
        if (this.props.onValueChange) {
          this.props.onValueChange('user', value);
          this.props.onValueChange(
            'url',
            `https://b2drop.eudat.eu/remote.php/dav/files/${value}/`
          );
        }
      }
    );
  }

  render() {
    return (
      <div className="data-mount-dialog-options">
        <div className="row mb-1 data-mount-dialog-config-header">
          <p>
            B2Drop Configuration
            <a
              data-tooltip-id={'data-mount-b2drop-tooltip'}
              data-tooltip-html="Click for documentation"
              data-tooltip-place="left"
              className="data-mount-b2drop-tooltip lh-1 ms-1 data-mount-dialog-label-tooltip"
              href="https://jsc-jupyter.github.io/jupyterlab-data-mount/users/templates/b2drop/"
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
        <TextField
          label="Path"
          name="remotepath"
          tooltip={this.tooltips.remotepath}
          value={this.state.remotepath}
          editable={this.props.editable}
          onChange={this.handleTextFieldChange}
        />
        <TextField
          label="User"
          name="user"
          tooltip={this.tooltips.user}
          value={this.state.user}
          editable={this.props.editable}
          onChange={this.handleUserTextFieldChange}
        />
        <TextField
          label="Password"
          type="password"
          name="obscure_pass"
          tooltip={this.tooltips.obscure_pass}
          value={this.state.obscure_pass}
          editable={this.props.editable}
          onChange={this.handleTextFieldChange}
        />
      </div>
    );
  }
}
