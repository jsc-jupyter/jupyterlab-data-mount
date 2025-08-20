# NFS Template Configuration

The **NFS** template allows users to mount NFS servers within JupyterLab.

> This feature is disabled by default. JupyterHub administrators must enable it via [JupyterHub DataMount KubeSpawner](../../spawner/configuration.md#enable-nfs).

## Configuration Parameters

To configure a NFS mount, the following parameters are required:

- **Server**: IP Address of the NFS Server.
- **Path**: NFS Server path.

<div style="text-align: center;">
  <img src="https://jsc-jupyter.github.io/jupyterlab-data-mount/images/nfs.png" alt="NFS" style="width: 30%;">
</div>

## Restricted NFS Servers

For security reasons, administrators can define IP ranges that cannot be mounted by users.
This prevents accidental or unauthorized access to sensitive exports, such as other users' home directories or internal system mounts.

If you try to mount a blocked server, the request will be denied, and you will see an error message in mounts.log logfile.
