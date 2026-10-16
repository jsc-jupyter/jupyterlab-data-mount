# UFTP Template Configuration

The **UFTP** template mounts a UNICORE/UFTP storage location. Unlike the rclone-backed templates, it uses an authentication URL and an access token supplied by the Jupyter Server configuration.

## User Options

The dialog asks for an **Auth URL** and a **Directory**. Administrators can provide fixed values or lists of labeled choices. If no directory list is configured, users can enter a directory themselves. Selecting the special `__custom__path__` directory value exposes a separate custom path field.

## Administrator Configuration

Configure the token callback and optional choices through `c.KubeSpawner.data_mount_config`:

```python
c.KubeSpawner.data_mount_config = """
# Define or import get_uftp_access_token() in your deployment configuration.
c.DataMount.uftp_access_token = get_uftp_access_token
c.DataMount.uftp_allowed_dirs = [
    {"label": "Project data", "value": "/project"},
    {"label": "Home", "value": "/home"},
]
c.DataMount.uftp_auth_values = [
    {"label": "Production", "value": "https://example.org/auth"},
]
"""
```

The callback is invoked without a user argument, so the current extension does not provide per-user token lookup to it. It can only use credentials available to that Jupyter Server process. The API requires both `access_token` and `auth_url` to create a UFTP mount; use a token provider with the intended access scope and avoid a broad shared token unless that is explicitly desired. If allowed-directory or authentication choices are omitted, the corresponding fields are editable in the dialog.