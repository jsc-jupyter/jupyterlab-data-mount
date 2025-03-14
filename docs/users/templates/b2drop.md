# B2Drop Template Configuration

The **B2Drop** template allows users to mount their B2Drop storage within JupyterLab using WebDAV authentication.

> JupyterLab DataMount uses **rclone** to mount B2Drop. Check out their [documentation](https://rclone.org/webdav/) for more details.

## Requirements

For a safe mount of B2Drop an **app password** is required.

1.  Open [B2Drop Security Settings](https://b2drop.eudat.eu/settings/user/security)
2.  Scroll down, enter "JupyterLab DataMount" as "App name" and click on "Create new app password"
3.  Save "Login" ( aka **user** ) and "Password"

<div style="text-align: center;">
  <img src="https://jsc-jupyter.github.io/jupyterlab-data-mount/images/b2drop_apppassword.png" alt="B2Drop AppPassword" style="width: 30%;">
</div>

## Configuration Parameters

To configure a B2Drop mount, the following parameters are required:

- **Path**: The path within B2Drop to be mounted (default: `/`, mounts all files in B2Drop).
- **User**: "Login" from the app password.
- **Password**: "Password" from the app password.

<div style="text-align: center;">
  <img src="https://jsc-jupyter.github.io/jupyterlab-data-mount/images/b2drop.png" alt="B2Drop" style="width: 30%;">
</div>

## Advanced

<details>
  <summary>RClone configuration</summary>
  <br>
  The following configuration is used to mount B2Drop with rclone:<br>
  b2drop.config:<br>
  ```yaml
  [b2drop]
  type = webdav
  url = https://b2drop.eudat.eu/remote.php/dav/files/_user_/
  vendor = nextcloud
  user = _user_
  pass = _obscuredpassword_
  ```
  <br>
  Mounted via <br>
  ```bash
  rclone mount --config b2drop.config b2drop:_remotepath_ _path_ --vfs-cache-max-size=10G --vfs-read-chunk-size=64M --vfs-cache-mode=writes --allow-other --uid=1000 --gid=100
  ```
  <br>
</details>
<details>
  <summary>JupyterHub pre_configuration</summary>
  <br>
  The following configuration can be used to preconfigure a B2Drop mount for users:<br>
  ```json
  # pip install jupyterhub-datamountspawner
  c.JupyterHub.spawner_class = 'datamountspawner.KubeSpawner'
  c.KubeSpawner.init_mounts = [
    {
      "path": "_path_", # relative path. "b2drop" is a valid value
      "options": {
        "displayName": "B2Drop (external)",
        "template": "b2drop",
        "readonly": True, # default: False
        "config": {
          "remotepath": "/", # If only a subdirectory should be shared, define it here
          "type": "webdav",
          "url": "https://b2drop.eudat.eu/remote.php/dav/files/_user_/",
          "vendor": "nextcloud",
          "user": "_user_",
          "obscure_pass": "_password_" # will be obscured during config creation
        }
      }
    }
  ]
  ```
    <ul>Replace _path_, _user_ and _password_</ul>
    <ul>Users will not see the used configuration</ul>
</details>
