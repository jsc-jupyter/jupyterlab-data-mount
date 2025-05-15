import * as React from 'react';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { CommandRegistry } from '@lumino/commands';
import { DirectoryIcon, SettingsIcon, StopIcon } from '../icon';
import { Dialog, showDialog } from '@jupyterlab/apputils';
import { MountDialogBody } from '../dialog/widget';

import { PageConfig } from '@jupyterlab/coreutils';
import { IDataMount, IUFTPConfig } from '../index';

export default class SideBarBody extends React.Component<{
  app: JupyterFrontEnd;
  commands: CommandRegistry;
  commandId: string;
  templates: string[];
  mountDir: string;
  loading: boolean;
  mountPoints: IDataMount[];
  removeMountPoint: (mountPoint: IDataMount) => void;
  uftp_config: IUFTPConfig;
}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="data-mount-sidebar">
        <div className="data-mount-sidebar-header">
          <div className="header-item name">Mount</div>
          <div className="header-item actions">Actions</div>
        </div>
        <ul className="data-mount-sidebar-list">
          {this.props.mountPoints.map(mount => (
            <MountRowElement
              mount={mount}
              commands={this.props.commands}
              templates={this.props.templates}
              mountDir={this.props.mountDir}
              removeMountPoint={this.props.removeMountPoint}
              uftp_config={this.props.uftp_config}
            />
          ))}
        </ul>
      </div>
    );
  }
}

class MountRowElement extends React.Component<{
  mount: IDataMount;
  commands: CommandRegistry;
  templates: string[];
  mountDir: string;
  removeMountPoint: (mountPoint: IDataMount) => void;
  uftp_config: IUFTPConfig;
}> {
  constructor(props: any) {
    super(props);
  }

  openDirectory = (path: string) => {
    this.props.commands.execute('filebrowser:open-path', {
      path: path
    });
  };

  openDialog = () => {
    const buttons = [Dialog.okButton({ label: 'Ok' })];
    const options = {
      template: this.props.mount.template,
      path: this.props.mount.path,
      options: { ...this.props.mount.options }
    };
    const body = new MountDialogBody(
      false,
      options,
      this.props.templates,
      this.props.mountDir,
      this.props.uftp_config
    );

    body.node.style.overflow = 'visible';
    body.node.className = 'data-mount-dialog-body';
    showDialog({
      title: 'Data Mount',
      body: body,
      buttons: buttons
    });
  };

  render() {
    const loading = this.props.mount.loading || false;

    const serverRoot = PageConfig.getOption('serverRoot');
    let relativePath = this.props.mount.path.replace(serverRoot, '');

    if (relativePath.startsWith('/')) {
      relativePath = relativePath.substring(1);
    }

    return (
      <li
        key={this.props.mount.options.displayName}
        className="data-mount-sidebar-item"
      >
        <span
          className={`item-name ${
            this.props.mount.options.external || loading ? 'external' : ''
          }`}
        >
          {this.props.mount.options.displayName}
          {loading ? ' ( loading ... )' : ''}
        </span>
        <span className="item-actions">
          {!loading && (
            <button
              className="icon-button"
              title={`Open ${relativePath}`}
              onClick={() => this.openDirectory(relativePath)}
            >
              <DirectoryIcon.react tag="span" width="16px" height="16px" />
            </button>
          )}
          {!loading && !this.props.mount.options.external && (
            <>
              <button
                className="icon-button"
                title="Show options"
                onClick={this.openDialog}
              >
                <SettingsIcon.react tag="span" width="16px" height="16px" />
              </button>

              <button
                className="icon-button unmount"
                title="Unmount"
                onClick={async () => {
                  try {
                    await this.props.removeMountPoint(this.props.mount);
                  } catch (error) {
                    console.error('Unmount failed:', error);
                  }
                }}
              >
                <StopIcon.react tag="span" width="16px" height="16px" />
              </button>
            </>
          )}
        </span>
      </li>
    );
  }
}
