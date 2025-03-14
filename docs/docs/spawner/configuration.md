# JupyterHub DataMount Spawner Configuration

## Overview

This section provides a detailed explanation of the available configuration options for the **JupyterHub DataMount Spawner**.

## Configuration Features

### Templates

```python
c.KubeSpawner.templates = ["b2drop", "aws"]
```

- Allows administrators to specify which mount templates should be visible to users.
- Users can only create mounts based on the listed templates, providing controlled access to external storage.
- List of currently supported templates can be seen [here](https://github.com/jsc-jupyter/jupyterlab-data-mount/blob/main/src/dialog/widget.tsx#L82) (class `MountDialogComponent` , attribute `templates_all`)

### Logging Configuration

```python
c.KubeSpawner.logging_config = {
logging_config = {
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
        "delay": false,
        "utc": false,
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
- Secrets (e.g., credentials) remain hidden from the user, ensuring security.

By leveraging these configuration options, administrators can fine-tune the **JupyterHub DataMount Spawner** for their specific deployment needs.
