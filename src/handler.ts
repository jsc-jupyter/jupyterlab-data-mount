import { URLExt } from '@jupyterlab/coreutils';

import { ServerConnection } from '@jupyterlab/services';

import { IDataMount, IUFTPConfig } from './index';

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

export async function RequestGetTemplates(): Promise<[]> {
  let data = [];
  try {
    data = await requestAPI<any>('templates', {
      method: 'GET'
    });
  } catch (reason) {
    data = ['aws', 'b2drop', 's3', 'webdav', 'generic'];
    console.error(`Data Mount: Could not get templates.\n${reason}`);
    throw new Error(`Failed to get templates.\n${reason}`);
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
    data = ['aws', 'b2drop', 's3', 'webdav', 'generic'];
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
      throw new Error(`${reason}`);
    } else {
      throw new Error('Failed to delete mount point.');
    }
  }
}
