import * as React from 'react';

import { IDropdownValues, DropdownComponent } from '../components/dropdown';
import { TextField } from '../components/textfield';
import { BaseComponent } from './base';

interface IWebDavState {
  remotepath: string;
  type: string;
  url: string;
  vendor: string;
  user: string;
  obscure_pass: string;
  bearer_token: string;
}

interface IWebDavProps {
  onValueChange: any;
  ref: any;
  editable: boolean;
  options: any;
}

export default class Webdav extends BaseComponent<IWebDavProps, IWebDavState> {
  private tooltips = {
    remotepath: '',
    type: '',
    url: 'URL of http host to connect to',
    vendor: 'Name of the Webdav site/service/software you are using',
    user: 'User name or App name',
    obscure_pass: 'Password or App password',
    bearer_token: 'Bearer token instead of user/pass (eg a Macaroon)'
  };

  private vendorOptions: IDropdownValues[] = [
    {
      value: 'nextcloud',
      label: 'Nextcloud'
    },
    {
      value: 'owncloud',
      label: 'Owncloud'
    },
    {
      value: 'sharepoint',
      label: 'Sharepoint'
    },
    {
      value: 'other',
      label: 'Other site/service or software'
    }
  ];

  constructor(props: any) {
    super(props);
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
        obscure_pass: '',
        bearer_token: ''
      };
    }
  }

  render() {
    return (
      <div className="data-mount-dialog-options">
        <div className="row mb-1 data-mount-dialog-config-header">
          <p>B2Drop Configuration</p>
        </div>
        <TextField
          label="URL"
          name="url"
          tooltip={this.tooltips.url}
          value={this.state.url}
          editable={this.props.editable}
          onChange={this.handleTextFieldChange}
        />
        <DropdownComponent
          label="Vendor"
          key_="vendor"
          tooltip={this.tooltips.vendor}
          selected={this.state.vendor}
          values={this.vendorOptions}
          onValueChange={this.handleDropdownChange}
          editable={this.props.editable}
          searchable={true}
        />
        <TextField
          label="User"
          name="user"
          tooltip={this.tooltips.user}
          value={this.state.user}
          editable={this.props.editable}
          onChange={this.handleTextFieldChange}
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
        <TextField
          label="Bearer Token (optional)"
          name="bearer_token"
          tooltip={this.tooltips.bearer_token}
          value={this.state.bearer_token}
          editable={this.props.editable}
          onChange={this.handleTextFieldChange}
        />
      </div>
    );
  }
}
