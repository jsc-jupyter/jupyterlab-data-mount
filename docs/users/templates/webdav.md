# WebDAV Template Configuration

The **WebDAV** template allows users to mount their WebDAV Storage within JupyterLab.

> JupyterLab DataMount uses **rclone** to mount WebDAV. Check out their [documentation](https://rclone.org/webdav/) for more details.

## Configuration Parameters

To configure a WebDAV mount, the following parameters are required:

- **URL**: URL of http host to connect to.
- **Vendor**: Name of the WebDAV site/service/software you are using.
- **User**: User name.
- **Password**: Password.
- **Bearer Token**: Bearer token instead of user/pass (e.g. a Macaroon)

<div style="text-align: center;">
  <img src="https://jsc-jupyter.github.io/jupyterlab-data-mount/images/webdav.png" alt="WebDAV" style="width: 30%;">
</div>

## Advanced

<details>
  <summary>RClone configuration</summary>
  <br>
  The following configuration is used to mount WebDAV with rclone:<br>
  webdav.config:<br>
  ```yaml
  [webdav]
  type = webdav
  url = _url_
  vendor = _vendor_
  user = _user_
  pass = _password_ # will be obscured during config creation
  bearer_token = _bearer_token_ # optional
  <br>
  Mounted via <br>
  ```bash
  rclone mount --config webdav.config webdav:/ _path_ --vfs-cache-max-size=10G --vfs-read-chunk-size=64M --vfs-cache-mode=writes --allow-other --uid=1000 --gid=100
  ```
  <br>
</details>
