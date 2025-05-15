import { MountDialogBody } from './dialog/widget';
import { cloudStorageIcon } from './icon';
import { Dialog, showDialog } from '@jupyterlab/apputils';
import { JupyterFrontEnd } from '@jupyterlab/application';
import SideBarWidget from './sidebar/widget';
import { RequestAddMountPoint } from './handler';
import { IUFTPConfig } from '.';

export namespace CommandIDs {
  export const opendialog = 'jupyterlab-data-mount:opendialog';
}

export function addCommands(
  app: JupyterFrontEnd,
  sbwidget: SideBarWidget,
  templates: string[],
  mountDir: string,
  uftp_config: IUFTPConfig
) {
  app.commands.addCommand(CommandIDs.opendialog, {
    label: args => 'Open Data Mount',
    caption: 'Open Data Mount',
    icon: args => cloudStorageIcon,
    execute: async () => {
      const buttons = [
        Dialog.cancelButton({ label: 'Cancel' }),
        Dialog.okButton({ label: 'Mount' })
      ];

      const body = new MountDialogBody(
        true,
        {},
        templates,
        mountDir,
        uftp_config
      );
      body.node.style.overflow = 'visible';
      body.node.className = 'data-mount-dialog-body';
      showDialog({
        title: 'Data Mount',
        body: body,
        buttons: buttons
      }).then(result => {
        if (result.button.accept) {
          handleResult(result.value, sbwidget, mountDir);
        }
      });
    }
  });
}

async function handleResult(
  result: any,
  sbwidget: SideBarWidget,
  mountDir: string
) {
  try {
    result.loading = true;
    sbwidget.addMountPoint(result);
    await RequestAddMountPoint(result);
    result.loading = false;
    sbwidget.setMountPointLoaded(result);
  } catch (reason) {
    alert(
      `Could not mount ${result.options.displayName}.\nCheck ${mountDir}/mount.log for details`
    );
    await sbwidget.removeMountPoint(result, true);
  }
}
