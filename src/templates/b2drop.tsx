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
    remotepath: '',
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
          <p>B2Drop Configuration</p>
        </div>
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
