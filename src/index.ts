import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { SideBarWidget } from './sidebar/widget';

import { RequestGetTemplates, RequestGetMountDir } from './handler';

import { addCommands, CommandIDs } from './commands';

import 'bootstrap/dist/css/bootstrap.min.css';

export interface IDataMount {
  template: string;
  path: string;
  options: any;
  loading: boolean | false;
  failedLoading: boolean | false;
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

  const sbwidget = new SideBarWidget(
    app,
    app.commands,
    CommandIDs.opendialog,
    templates,
    mountDir
  );
  app.shell.add(sbwidget, 'left');
  app.shell.activateById(sbwidget.id);
  addCommands(app, sbwidget, templates, mountDir);

  palette.addItem({
    command: CommandIDs.opendialog,
    category: 'Data'
  });
}

export default plugin;
