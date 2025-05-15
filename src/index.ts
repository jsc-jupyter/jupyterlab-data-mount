import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { SideBarWidget } from './sidebar/widget';

import {
  RequestGetTemplates,
  RequestGetMountDir,
  RequestGetUFTPConfig
} from './handler';

import { IDropdownValues } from './components/dropdown';
import { addCommands, CommandIDs } from './commands';

import 'bootstrap/dist/css/bootstrap.min.css';

export interface IDataMount {
  template: string;
  path: string;
  options: any;
  loading: boolean | false;
  failedLoading: boolean | false;
}
export interface IUFTPConfig {
  name: string;
  allowed_dirs: IDropdownValues[] | string;
  auth_values: IDropdownValues[] | string;
}

/**
 * Initialization data for the jupyterlab-data-mount extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-data-mount:plugin',
  description:
    'A JupyterLab extension to mount external data storage locations.',
  autoStart: true,
  requires: [ICommandPalette],
  activate: activate
};

async function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette
): Promise<void> {
  console.log('JupyterLab extension jupyterlab-data-mount is activated!');
  const templates = await RequestGetTemplates();
  const mountDir = await RequestGetMountDir();
  const uftpTemplate = templates.find(t => t === 'uftp');
  let uftp_config: IUFTPConfig = {
    name: '',
    allowed_dirs: [],
    auth_values: []
  };
  if (uftpTemplate) {
    uftp_config = await RequestGetUFTPConfig();
  }

  const sbwidget = new SideBarWidget(
    app,
    app.commands,
    CommandIDs.opendialog,
    templates,
    mountDir,
    uftp_config
  );
  app.shell.add(sbwidget, 'left');
  app.shell.activateById(sbwidget.id);
  addCommands(app, sbwidget, templates, mountDir, uftp_config);

  palette.addItem({
    command: CommandIDs.opendialog,
    category: 'Data'
  });
}

export default plugin;
