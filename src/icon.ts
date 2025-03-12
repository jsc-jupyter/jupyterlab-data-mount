import { LabIcon } from '@jupyterlab/ui-components';
import cloudStorageIconSvg from '../style/img/cloud-storage-icon.svg';
import plusIconSvg from '../style/img/plus.svg';
import deleteIconSvg from '../style/img/delete.svg';
import refreshIconSvg from '../style/img/refresh.svg';
import directoryIconSvg from '../style/img/directory.svg';
import settingsIconSvg from '../style/img/settings.svg';
import stopIconSvg from '../style/img/stop.svg';

export const cloudStorageIcon = new LabIcon({
  name: 'jupyterlab-data-mount:cloud-storage',
  svgstr: cloudStorageIconSvg
});

export const PlusIcon = new LabIcon({
  name: 'jupyterlab-data-mount:plus-icon',
  svgstr: plusIconSvg
});

export const DeleteIcon = new LabIcon({
  name: 'jupyterlab-data-mount:delete-icon',
  svgstr: deleteIconSvg
});

export const RefreshIcon = new LabIcon({
  name: 'jupyterlab-data-mount:refresh-icon',
  svgstr: refreshIconSvg
});

export const DirectoryIcon = new LabIcon({
  name: 'jupyterlab-data-mount:dir-icon',
  svgstr: directoryIconSvg
});

export const SettingsIcon = new LabIcon({
  name: 'jupyterlab-data-mount:settings-icon',
  svgstr: settingsIconSvg
});

export const StopIcon = new LabIcon({
  name: 'jupyterlab-data-mount:stop-icon',
  svgstr: stopIconSvg
});
