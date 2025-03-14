# Generic Template Configuration

The **Generic** template allows users to mount each rclone supported Storage within JupyterLab.

> JupyterLab DataMount uses **rclone** to mount WebDAV. Check out their [documentation](https://rclone.org/) for more details.

## Configuration Parameters

To configure a Generic mount, the following parameters are required:

- **Type**: Type of storage to configure.
- Add more options. Check out the rclone [documentation](https://rclone.org/docs/) for all options.

<div style="text-align: center;">
  <img src="https://jsc-jupyter.github.io/jupyterlab-data-mount/images/generic.png" alt="Generic" style="width: 30%;">
</div>

## Advanced

<details>
  <summary>RClone configuration</summary>
  <br>
  The following configuration is used to mount WebDAV with rclone:<br>
  generic.config:<br>
  ```yaml
  [generic]
  type = _type_
  <br>
  Mounted via <br>
  ```bash
  rclone mount --config generic.config _type_:/ _path_ --vfs-cache-max-size=10G --vfs-read-chunk-size=64M --vfs-cache-mode=writes --allow-other --uid=1000 --gid=100
  ```
  <br>
</details>
