import * as React from 'react';
import { CommandRegistry } from '@lumino/commands';
import Button from '@mui/material/Button';
import PlusIcon from '@mui/icons-material/Add';
import { Tooltip } from 'react-tooltip';

export default class SideBarHeader extends React.Component<{
  commands: CommandRegistry;
  commandId: string;
  loading: boolean;
  failedLoading: boolean;
}> {
  render() {
    const onClick = () => this.props.commands.execute(this.props.commandId);
    return (
      <>
        <div className="data-mount-sidepanel-header container mb-3">
          <a
            data-tooltip-id={'data-mount-tooltip-documentation'}
            data-tooltip-html="Click for documentation"
            data-tooltip-place="left"
            className="data-mount-sidepanel-header-documentation lh-1 ms-auto data-mount-dialog-label-tooltip"
            href="https://jsc-jupyter.github.io/jupyterlab-data-mount/"
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
          <div className="data-mount-sidepanel-header-button-div mt-3">
            {this.props.failedLoading && (
              <>
                <Button variant="contained" size="small" disabled>
                  Start failed.
                </Button>
                <p>Check logs in Browser for more information</p>
              </>
            )}
            {!this.props.failedLoading && this.props.loading && (
              <Button variant="contained" size="small" disabled>
                Loading ...
              </Button>
            )}
            {!this.props.failedLoading && !this.props.loading && (
              <Button
                variant="contained"
                size="small"
                startIcon={<PlusIcon />}
                onClick={onClick}
              >
                Add Mount
              </Button>
            )}
          </div>
          <hr />
        </div>
        <Tooltip id={'data-mount-tooltip-documentation'} />
      </>
    );
  }
}
