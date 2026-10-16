# Backend REST API

## Overview

There are two API layers:

- The authenticated Jupyter Server extension exposes `/data-mount/` beneath the single-user server's base URL (typically `/user/<username>/data-mount/`) and forwards requests to the sidecar.
- The sidecar REST API ([GitHub source](https://github.com/jsc-jupyter/jupyterlab-data-mount-api)) handles mount operations. It listens on `127.0.0.1:8090` by default and does not authenticate requests, so it is intended to remain inside the same Pod. Notebook code can call it directly; template allowlisting and mount policies are enforced by this API, not just by the UI.

The sidecar supports **POST**, **GET**, and **DELETE** methods for managing mounts. Rclone-backed templates accept provider configuration, while the API applies a fixed set of mount and VFS options.

## Supported Methods

### `POST /`

Mounts external storage based on the provided configuration.

**Request Body Example:**

```json
{
  "path": "project-data",
  "options": {
    "displayName": "Project data",
    "template": "s3",
    "readonly": false,
    "config": {
      "type": "s3",
      "provider": "Minio",
      "endpoint": "https://s3.example.org",
      "remotepath": "dataset-bucket",
      "access_key_id": "<access-key>",
      "secret_access_key": "<secret-key>"
    }
  }
}
```

### `GET /`

Returns a list of currently active mounts. Administrator-provisioned mounts have their configuration redacted.

### `DELETE /{path:path}`

Unmounts a user-created mount. The API returns `403` for administrator-provisioned mounts and `404` when the mount path is not active.

Mount targets must be normalized relative paths contained within the shared mount directory. A new mount cannot overlap an active mount target. POST requests are limited to the configured template allowlist.

## Flexibility & Feature Set

The Generic template accepts rclone remote configuration fields. The API validates the required remote type and path, then builds a mount command using the options supported by this service; this is not equivalent to exposing every rclone command-line option.

For more details and the full implementation, refer to the [source code](https://github.com/jsc-jupyter/jupyterlab-data-mount-api).
