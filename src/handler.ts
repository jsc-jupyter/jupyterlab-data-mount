import { Dialog, showDialog } from '@jupyterlab/apputils';

import { URLExt } from '@jupyterlab/coreutils';

import { ServerConnection } from '@jupyterlab/services';

import { IDataMount, IRememberConfig, IUFTPConfig } from './index';

/**
 * Call the API extension
 *
 * @param path Path argument, must be encoded
 * @param init Initial values for the request
 * @returns The response body interpreted as JSON
 */
export async function requestAPI<T>(
  path = '',
  init: RequestInit = {}
): Promise<T> {
  // Make request to Jupyter API
  const settings = ServerConnection.makeSettings();
  const requestUrl = URLExt.join(
    settings.baseUrl,
    'data-mount', // API Namespace
    path
  );

  let response: Response;
  try {
    response = await ServerConnection.makeRequest(requestUrl, init, settings);
  } catch (error) {
    throw new ServerConnection.NetworkError(error as any);
  }

  let data: any = await response.text();

  if (data.length > 0) {
    try {
      data = JSON.parse(data);
    } catch (error) {
      console.log('Not a JSON response body.', response);
    }
  }

  if (!response.ok) {
    throw new ServerConnection.ResponseError(response, data.message || data);
  }
  return data;
}

export async function listAllMountpoints(path: string): Promise<IDataMount[]> {
  let mountPoints: IDataMount[] = [];
  try {
    const data = await requestAPI<any>(path);
    mountPoints = data;
  } catch (reason) {
    console.error(`Data Mount: Could not receive MountPoints.\n${reason}`);
    throw new Error(`Failed to fetch mount points\n${reason}`);
  }
  return mountPoints;
}

export async function RequestAddMountPoint(mountPoint: IDataMount) {
  try {
    await requestAPI<any>('', {
      body: JSON.stringify(mountPoint),
      method: 'POST'
    });
  } catch (reason) {
    console.error(`Data Mount: Could not add MountPoint.\n${reason}`);
    throw new Error(`Failed to add mount point.\n${reason}`);
  }
}

export async function RequestGetEnabled(): Promise<boolean> {
  let data = false;
  try {
    data = await requestAPI<any>('enabled', {
      method: 'GET'
    });
  } catch (reason) {
    data = false;
    console.error(`Data Mount: Could not get enable status.\n${reason}`);
  }
  return data;
}

export async function RequestGetTemplates(): Promise<[]> {
  let data = [];
  try {
    data = await requestAPI<any>('templates', {
      method: 'GET'
    });
  } catch (reason) {
    data = ['aws', 'b2drop', 's3', 'webdav', 'nfs', 'generic'];
    console.error(`Data Mount: Could not get templates.\n${reason}`);
    throw new Error(`Failed to get templates.\n${reason}`);
  }
  return data;
}

export async function RequestGetRememberConfig(): Promise<IRememberConfig> {
  let data: IRememberConfig;
  try {
    data = await requestAPI<any>('remember', {
      method: 'GET'
    });
  } catch (reason) {
    data = { path: '/home/jovyan', default: false, enabled: false };
    console.error(
      `Data Mount: Could not get remember path.\n${reason}\nUse /home/jovyan instead.`
    );
  }
  return data;
}

export async function RequestGetMountDir() {
  let data = [];
  try {
    data = await requestAPI<any>('mountdir', {
      method: 'GET'
    });
  } catch (reason) {
    data = ['aws', 'b2drop', 's3', 'webdav', 'nfs', 'generic'];
    console.error(`Data Mount: Could not get templates.\n${reason}`);
    throw new Error(`Failed to get templates.\n${reason}`);
  }
  return data;
}

export async function RequestGetUFTPConfig(): Promise<IUFTPConfig> {
  let data: IUFTPConfig;
  try {
    data = await requestAPI<any>('uftp', {
      method: 'GET'
    });
  } catch (reason) {
    data = { name: 'UFTP', allowed_dirs: [], auth_values: [] };
    console.error(`Data Mount: Could not get templates.\n${reason}`);
    throw new Error(`Failed to get templates.\n${reason}`);
  }
  return data;
}

export async function RequestRemoveMountPoint(mountPoint: IDataMount) {
  const pathEncoded = encodeURIComponent(mountPoint.path);
  try {
    await requestAPI<any>(pathEncoded, {
      body: JSON.stringify(mountPoint),
      method: 'DELETE'
    });
  } catch (reason) {
    if (reason) {
      showDialog({
        title: 'Data Mount',
        body: `${reason}`,
        buttons: [Dialog.okButton({ label: 'Ok' })]
      });
      console.error(`${reason}`);
    } else {
      showDialog({
        title: 'Data Mount',
        body: 'Check mount.log for more information.',
        buttons: [Dialog.okButton({ label: 'Ok' })]
      });
      console.error('Failed to delete mount point.');
    }
  }
}
