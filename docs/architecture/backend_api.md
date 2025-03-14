# Backend REST API

## Overview

The REST API ([GitHub source](https://github.com/jsc-jupyter/jupyterlab-data-mount-api)) is responsible for handling mount operations by executing `rclone` commands based on incoming requests. It supports **POST**, **GET**, and **DELETE** methods, making it a flexible solution capable of leveraging most of `rclone`'s features.

## Supported Methods

### `POST /`

Mounts external storage based on the provided configuration.

**Request Body Example:**

```json
{
  "path": "relative_path",
  "options": {
    "config": {
      # rclone configuration
    },
    "readonly": false,
    "template": "s3"
  }
}
```

### `GET /`

Returns a list of currently active mounts.

### `DELETE /{path:path}`

Unmounts a previously mounted storage location.

## Flexibility & Feature Set

Since the API directly executes `rclone` commands based on the provided parameters, it is highly flexible and supports nearly all features of `rclone`. Users can configure different storage providers, authentication methods, and transfer settings as needed.

For more details and the full implementation, refer to the [source code](https://github.com/jsc-jupyter/jupyterlab-data-mount-api).
