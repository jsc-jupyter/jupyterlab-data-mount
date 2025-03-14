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
          <p>
            S3 Compliant Storage Provider Configuration
            <a
              data-tooltip-id={'data-mount-s3-tooltip'}
              data-tooltip-html="Click for documentation"
              data-tooltip-place="left"
              className="data-mount-s3-tooltip lh-1 ms-1 data-mount-dialog-label-tooltip"
              href="https://jsc-jupyter.github.io/jupyterlab-data-mount/users/templates/s3/"
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
