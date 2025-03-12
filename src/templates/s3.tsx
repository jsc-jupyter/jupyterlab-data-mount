import * as React from 'react';

import { IDropdownValues, DropdownComponent } from '../components/dropdown';
import { TextField } from '../components/textfield';
import { BaseComponent } from './base';

interface IS3State {
  remotepath: string;
  type: string;
  provider: string;
  access_key_id: string;
  secret_access_key: string;
  endpoint: string;
  region: string;
}

interface IS3Props {
  onValueChange: any;
  ref: any;
  editable: boolean;
  options: any;
}

export default class S3 extends BaseComponent<IS3Props, IS3State> {
  private providerOptions: IDropdownValues[] = [
    {
      value: 'AWS',
      label: 'Amazon Web Services (AWS) S3'
    },
    {
      value: 'Alibaba',
      label: 'Alibaba Cloud Object Storage System (OSS) formerly Aliyun'
    },
    {
      value: 'Ceph',
      label: 'Ceph Object Storage'
    },
    {
      value: 'DigitalOcean',
      label: 'Digital Ocean Spaces'
    },
    {
      value: 'Dreamhost',
      label: 'Dreamhost DreamObjects'
    },
    {
      value: 'IBMCOS',
      label: 'IBM COS S3'
    },
    {
      value: 'Minio',
      label: 'Minio Object Storage'
    },
    {
      value: 'Netease',
      label: 'Netease Object Storage (NOS)'
    },
    {
      value: 'Wasabi',
      label: 'Wasabi Object Storage'
    },
    {
      value: 'Other',
      label: 'Any other S3 compatible provider'
    }
  ];

  private tooltips = {
    remotepath: 'The name of the bucket to mount',
    provider: 'Choose your S3 provider.',
    access_key_id: 'AWS Access Key ID',
    secret_access_key: 'AWS Secret Access Key (password)',
    endpoint:
      'Endpoint for S3 API.<br />\
       Required when using an S3 clone',
    region:
      "Leave blank if you are using an S3 clone and you don't have a region"
  };

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
        remotepath: 'bucketname',
        type: 's3',
        provider: '',
        access_key_id: '',
        secret_access_key: '',
        endpoint: '',
        region: ''
      };
    }
  }

  getDisplayName() {
    return `S3 (${this.state.provider})`;
  }

  render() {
    return (
      <div className="data-mount-dialog-options">
        <div className="row mb-1 data-mount-dialog-config-header">
          <p>S3 Compliant Storage Provider Configuration</p>
        </div>
        <DropdownComponent
          label="Provider"
          key_="provider"
          tooltip={this.tooltips.provider}
          selected={this.state.provider}
          values={this.providerOptions}
          onValueChange={this.handleDropdownChange}
          editable={this.props.editable}
          searchable={true}
        />
        <TextField
          label="Bucket Name"
          name="remotepath"
          value={this.state.remotepath}
          editable={this.props.editable}
          onChange={this.handleTextFieldChange}
        />
        <TextField
          label="Endpoint for S3 API"
          name="endpoint"
          tooltip={this.tooltips.endpoint}
          value={this.state.endpoint}
          editable={this.props.editable}
          onChange={this.handleTextFieldChange}
        />
        <TextField
          label="Username"
          name="access_key_id"
          tooltip={this.tooltips.access_key_id}
          value={this.state.access_key_id}
          editable={this.props.editable}
          onChange={this.handleTextFieldChange}
        />
        <TextField
          label="Password"
          name="secret_access_key"
          type="password"
          tooltip={this.tooltips.secret_access_key}
          value={this.state.secret_access_key}
          editable={this.props.editable}
          onChange={this.handleTextFieldChange}
        />
        <TextField
          label="Region"
          name="region"
          tooltip={this.tooltips.region}
          value={this.state.region}
          editable={this.props.editable}
          onChange={this.handleTextFieldChange}
        />
      </div>
    );
  }
}
