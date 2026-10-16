# JupyterHub DataMount Spawner Configuration

## Overview

This section provides a detailed explanation of the available configuration options for the **JupyterHub DataMount Spawner**.

## Configuration Features

### Templates

```python
c.KubeSpawner.templates = ["b2drop", "aws", "s3", "webdav", "generic"]
```

- Allows administrators to specify which mount templates should be visible to users.
- The configured templates are passed to both the Jupyter Server and sidecar API. The API rejects mount requests for templates outside this allowlist, including requests made directly from notebook code.
- If `templates` is unset or empty, the spawner uses `uftp`, `b2drop`, `aws`, `s3`, `webdav`, `nfs`, and `generic`.
- List of currently supported templates can be seen [here](https://github.com/jsc-jupyter/jupyterlab-data-mount/blob/main/src/dialog/widget.tsx#L99) (class `MountDialogComponent` , attribute `templates_all`)

### Logging Configuration

```python
c.KubeSpawner.logging_config = {
  "stream": {
    "enabled": True,
    "level": 20,
    "formatter": "simple",
    "stream": "ext://sys.stdout",
  },
  "file": {
      "enabled": True,
      "level": 20,
      "filename": "/mnt/data_mounts/mount.log",
      "formatter": "simple_user", # simple_user, simple or json
      "when": "h",
      "interval": 1,
      "backupCount": 0,
      "encoding": None,
      "delay": False,
      "utc": False,
      "atTime": None,
      "errors": None,
  },
  "syslog": {
    "enabled": False,
    "level": 20,
    "formatter": "json",
    "address": ["ip", 5141],
    "facility": 1,
    "socktype": "ext://socket.SOCK_DGRAM",
  },
  "smtp": {
    "enabled": False,
    "level": 50,
    "formatter": "simple",
    "mailhost": "mailhost",
    "fromaddr": "smtpmail",
    "toaddrs": [],
    "subject": "SMTPHandler - Log",
    "secure": None,
    "timeout": 1,
  }
}
```

- Configures Python’s logging handler to monitor the extension’s usage.
- Supported logging handlers: `stream`, `file`, `syslog`, `smtp`. `stream` and `file` are enabled by default.
- The log format and verbosity level can be customized as needed.

> The `file` LogHandler is used as feedback for the user. Keep that in mind when editing its configuration.

### Init Mounts

```python
c.KubeSpawner.init_mounts = [
  {
    "path": "aws_pre",
    "options": {
      "displayName": "AWS (external)",
      "template": "aws",
      "config": {
        "remotepath": "myawsbucket",
        "type": "s3",
        "provider": "AWS",
        "access_key_id": "<ACCESS_KEY>",
        "secret_access_key": "<SECRET_KEY>",
        "region": "eu-north-1"
      }
    }
  }
]
```

- Enables automatic mounting of external storage when JupyterLab starts.
- Mounted storage is available to the user without manual intervention.
- The mount is marked administrator-managed: its configuration is redacted by the API, and the API rejects attempts to remove it.
- Secrets are not exposed by the mount-list API response, but administrators should still protect the Hub configuration and the sidecar's configuration volume.

By leveraging these configuration options, administrators can fine-tune the **JupyterHub DataMount Spawner** for their specific deployment needs.

### Remember Mounts

To allow users to remember mounts that persist after JupyterLab restarts, each user must have a user-specific persistent storage. Their mount configurations will be stored in plain text at a place that an administrator has to configure. It must be configured via `KubeSpawner.data_mount_config`.

```python
c.KubeSpawner.data_mount_config = """
c.DataMount.remember_enabled = True # default is False
c.DataMount.remember_file = "/home/jovyan/.jupyter/datamounts/mounts.json" # update if your persistent storage is at $HOME/work
c.DataMount.remember_default = False # configure whether the checkbox should be enabled by default. Default: False
"""
```

### Enable NFS

By default NFS is disabled, since there's no authentication in plain NFS setups.

```python
c.KubeSpawner.enable_nfs_mounts = True # default is false
c.KubeSpawner.blocked_nfs_mounts = ["192.168.0.0/24"] # User's won't be able to mount any Server within that CIDR. Can be an empty list, or multiple CIDR strings in a list.
```

NFS server addresses must be IP literals. The spawner's default block list includes common private, loopback, and link-local IPv4 ranges; configure the list for your network and threat model.
