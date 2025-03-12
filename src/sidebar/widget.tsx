import * as React from 'react';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { ReactWidget } from '@jupyterlab/apputils';
import { CommandRegistry } from '@lumino/commands';
import { cloudStorageIcon } from '../icon';
import SideBarHeader from './header';
import SideBarBody from './body';
import { listAllMountpoints, RequestRemoveMountPoint } from '../handler';

import { IDataMount } from '../index';

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
  },
  ISideBarState
> {
  private _app: JupyterFrontEnd;
  private _commands: CommandRegistry;
  private _openCommandId: string;
  private _templates: string[];
  private _mountDir: string;

  constructor(props: any) {
    super(props);
    this._app = props.app;
    this._commands = props.commands;
    this._openCommandId = props.commandId;
    this._templates = props.templates;
    this._mountDir = props.mountDir;
    this.removeMountPoint = this.removeMountPoint.bind(this);

    this.state = {
      mountPoints: [],
      globalLoading: true,
      globalLoadingFailed: false
    };
  }

  async reloadMountPoints() {
    try {
      const mountPoints: IDataMount[] = await listAllMountpoints();
      this.setState({
        mountPoints,
        globalLoading: false
      });
    } catch {
      this.setState({ globalLoadingFailed: true, globalLoading: false });
    }
  }

  async componentDidMount() {
    await this.reloadMountPoints();
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

  constructor(
    app: JupyterFrontEnd,
    commands: CommandRegistry,
    openCommandId: string,
    templates: string[],
    mountDir: string
  ) {
    super();
    this._app = app;
    this.id = 'data-mount-jupyterlab:sidebarwidget';
    this.title.caption = 'Data Mount';
    this._commands = commands;
    this._openCommandId = openCommandId;
    this._templates = templates;
    this._mountDir = mountDir;
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
        />
      </body>
    );
  }
}

export default SideBarWidget;
