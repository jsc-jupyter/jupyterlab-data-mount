import * as React from 'react';

import { IDropdownValues, DropdownComponent } from '../components/dropdown';
import { TextField } from '../components/textfield';
import { BaseComponent } from './base';

interface IAWSState {
  remotepath: string;
  type: string;
  provider: string;
  access_key_id: string;
  secret_access_key: string;
  region: string;
}

interface IAWSProps {
  onValueChange: any;
  ref: any;
  editable: boolean;
  options: any;
}

export default class AWS extends BaseComponent<IAWSProps, IAWSState> {
  private tooltips = {
    remotepath: 'The name of the bucket to mount',
    access_key_id: 'AWS Access Key ID',
    secret_access_key: 'AWS Secret Access Key (password)',
    region: 'Region to connect to'
  };
  private awsRegions: IDropdownValues[] = [
    { value: 'eu-north-1', label: 'EU (Stockholm) (eu-north-1)' },
    { value: 'eu-central-1', label: 'EU (Frankfurt) (eu-central-1)' },
    { value: 'eu-west-1', label: 'EU (Ireland) (eu-west-1)' },
    { value: 'eu-west-2', label: 'EU (London) (eu-west-2)' },
    { value: 'ca-central-1', label: 'Canada (Central) (ca-central-1)' },
    { value: 'us-east-1', label: 'US East (Northern Virginia) (us-east-1)' },
    { value: 'us-east-2', label: 'US East (Ohio) (us-east-2)' },
    { value: 'us-west-1', label: 'US West (Northern California) (us-west-1)' },
    { value: 'us-west-2', label: 'US West (Oregon) (us-west-2)' },
    {
      value: 'ap-southeast-1',
      label: 'Asia Pacific (Singapore) (ap-southeast-1)'
    },
    {
      value: 'ap-southeast-2',
      label: 'Asia Pacific (Sydney) (ap-southeast-2)'
    },
    { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo) (ap-northeast-1)' },
    { value: 'ap-northeast-2', label: 'Asia Pacific (Seoul) (ap-northeast-2)' },
    { value: 'ap-south-1', label: 'Asia Pacific (Mumbai) (ap-south-1)' },
    { value: 'sa-east-1', label: 'South America (Sao Paulo) (sa-east-1)' }
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
        remotepath: 'bucketname',
        type: 's3',
        provider: 'AWS',
        access_key_id: '',
        secret_access_key: '',
        region: 'eu-north-1'
      };
    }
  }

  getDisplayName() {
    return `AWS (${this.state.remotepath})`;
  }

  render() {
    return (
      <div className="data-mount-dialog-options">
        <div className="row mb-1 data-mount-dialog-config-header">
          <p>AWS Configuration</p>
        </div>
        <TextField
          label="Bucket Name"
          name="remotepath"
          value={this.state.remotepath}
          onChange={this.handleTextFieldChange}
          editable={this.props.editable}
        />
        <DropdownComponent
          label="Region"
          key_="region"
          selected={this.state.region}
          values={this.awsRegions}
          tooltip={this.tooltips.region}
          onValueChange={this.handleDropdownChange}
          editable={this.props.editable}
          searchable={true}
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
      </div>
    );
  }
}
