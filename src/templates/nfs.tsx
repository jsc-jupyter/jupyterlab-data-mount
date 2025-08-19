import * as React from 'react';

import { TextField } from '../components/textfield';
import { BaseComponent } from './base';

interface INFSState {
  server: string;
  remotepath: string;
}

interface INFSProps {
  onValueChange: any;
  ref: any;
  editable: boolean;
  options: any;
}

export default class NFS extends BaseComponent<INFSProps, INFSState> {
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
        server: '127.0.0.1',
        remotepath: '/'
      };
    }
  }

  getDisplayName() {
    return `NFS (${this.state.server}:${this.state.remotepath})`;
  }

  render() {
    return (
      <div className="data-mount-dialog-options">
        <div className="row mb-1 data-mount-dialog-config-header">
          <p>
            NFS Configuration
            <a
              data-tooltip-id={'data-mount-nfs-tooltip'}
              data-tooltip-html="Click for documentation"
              data-tooltip-place="left"
              className="data-mount-nfs-tooltip lh-1 ms-1 data-mount-dialog-label-tooltip"
              href="https://jsc-jupyter.github.io/jupyterlab-data-mount/users/templates/nfs/"
              target="_blank"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="var(--jp-ui-font-color1)"
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
          label="NFS server IP"
          name="server"
          value={this.state.server}
          onChange={this.handleTextFieldChange}
          editable={this.props.editable}
        />
        <TextField
          label="NFS Server Path"
          name="remotepath"
          value={this.state.remotepath}
          onChange={this.handleTextFieldChange}
          editable={this.props.editable}
        />
      </div>
    );
  }
}
