import * as React from 'react';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { ReactWidget } from '@jupyterlab/apputils';
import { CommandRegistry } from '@lumino/commands';
import { cloudStorageIcon } from '../icon';
import SideBarHeader from './header';
import SideBarBody from './body';
import { listAllMountpoints, RequestRemoveMountPoint } from '../handler';

import { IDataMount, IUFTPConfig } from '../index';

interface ISideBarState {
  mountPoints: IDataMount[];
  globalLoading: boolean;
  globalLoadingFailed: boolean;
}

class SideBarComponent extends React.Component<
  {
    app: JupyterFrontEnd;
    commands: CommandRegistry;
    commandId: string;
    templates: string[];
    mountDir: string;
    uftp_config: IUFTPConfig;
  },
  ISideBarState
> {
  private _app: JupyterFrontEnd;
  private _commands: CommandRegistry;
  private _openCommandId: string;
  private _templates: string[];
  private _mountDir: string;
  private _uftp_config: IUFTPConfig;

  constructor(props: any) {
    super(props);
    this._app = props.app;
    this._commands = props.commands;
    this._openCommandId = props.commandId;
    this._templates = props.templates;
    this._mountDir = props.mountDir;
    this.removeMountPoint = this.removeMountPoint.bind(this);
    this._uftp_config = props.uftp_config;

    this.state = {
      mountPoints: [],
      globalLoading: true,
      globalLoadingFailed: false
    };
  }

  async reloadMountPoints(path: string) {
    try {
      const mountPoints: IDataMount[] = await listAllMountpoints(path);
      this.setState({
        mountPoints,
        globalLoading: false
      });
    } catch {
      this.setState({ globalLoadingFailed: true, globalLoading: false });
    }
  }

  async componentDidMount() {
    await this.reloadMountPoints('init');
  }

  setMountPointLoaded(mountPoint: IDataMount) {
    this.setState(prevState => ({
      mountPoints: prevState.mountPoints.map(mp =>
        mp.path === mountPoint.path ? { ...mp, loading: false } : mp
      )
    }));
  }

  addMountPoint(mountPoint: IDataMount) {
    this.setState(prevState => ({
      mountPoints: [...prevState.mountPoints, mountPoint]
    }));
  }

  addFailedMountPoint(mountPoint: IDataMount) {
    this.setState(prevState => ({
      mountPoints: [...prevState.mountPoints, mountPoint]
    }));
  }

  async removeMountPoint(mountPoint: IDataMount, force?: boolean | false) {
    try {
      await RequestRemoveMountPoint(mountPoint);
      this.setState(prevState => ({
        mountPoints: prevState.mountPoints.filter(
          mountPoint_ => mountPoint_.path !== mountPoint.path
        )
      }));
    } catch (reason) {
      if (force) {
        try {
          this.setState(prevState => ({
            mountPoints: prevState.mountPoints.filter(
              mountPoint_ => mountPoint_.path !== mountPoint.path
            )
          }));
        } catch (error) {
          console.error('Error updating mount points:', error);
        }
      } else {
        alert(
          `Could not unmount ${mountPoint.options.displayName}.\nCheck ${this.props.mountDir}/mount.log for details`
        );
      }
    }
  }

  render(): JSX.Element {
    return (
      <body>
        <SideBarHeader
          commands={this._commands}
          commandId={this._openCommandId}
          loading={this.state.globalLoading}
          failedLoading={this.state.globalLoadingFailed}
        />
        <SideBarBody
          app={this._app}
          commands={this._commands}
          commandId={this._openCommandId}
          templates={this._templates}
          mountDir={this._mountDir}
          loading={this.state.globalLoading}
          mountPoints={this.state.mountPoints}
          removeMountPoint={this.removeMountPoint}
          uftp_config={this._uftp_config}
        />
      </body>
    );
  }
}

export class SideBarWidget extends ReactWidget {
  private _app: JupyterFrontEnd;
  private _commands: CommandRegistry;
  private _openCommandId: string;
  private _sidebarComponentRef = React.createRef<SideBarComponent>();
  private _templates: string[];
  private _mountDir: string;
  private _uftp_config: IUFTPConfig;

  constructor(
    app: JupyterFrontEnd,
    commands: CommandRegistry,
    openCommandId: string,
    templates: string[],
    mountDir: string,
    uftp_config: IUFTPConfig
  ) {
    super();
    this._app = app;
    this.id = 'data-mount-jupyterlab:sidebarwidget';
    this.title.caption = 'Data Mount';
    this._commands = commands;
    this._openCommandId = openCommandId;
    this._templates = templates;
    this._mountDir = mountDir;
    this._uftp_config = uftp_config;
    this.title.icon = cloudStorageIcon;
    this.addClass('jp-data-mount');
  }

  async removeMountPoint(mountPoint: IDataMount, force?: boolean | false) {
    if (this._sidebarComponentRef.current) {
      await this._sidebarComponentRef.current.removeMountPoint(
        mountPoint,
        force
      );
    }
  }

  addMountPoint(mountPoint: IDataMount) {
    if (this._sidebarComponentRef.current) {
      this._sidebarComponentRef.current.addMountPoint(mountPoint);
    }
  }

  setMountPointLoaded(mountPoint: IDataMount) {
    if (this._sidebarComponentRef.current) {
      this._sidebarComponentRef.current.setMountPointLoaded(mountPoint);
    }
  }

  render(): JSX.Element {
    return (
      <body>
        <SideBarComponent
          ref={this._sidebarComponentRef}
          app={this._app}
          commands={this._commands}
          commandId={this._openCommandId}
          templates={this._templates}
          mountDir={this._mountDir}
          uftp_config={this._uftp_config}
        />
      </body>
    );
  }
}

export default SideBarWidget;
