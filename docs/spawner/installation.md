# JupyterHub DataMount Spawner Installation

## Overview

The **JupyterHub DataMount Spawner** (<a href="https://github.com/jsc-jupyter/jupyterhub-data-mount-kubespawner" target="_blank">GitHub source</a>) is designed for seamless integration within <a href="https://z2jh.jupyter.org/en/stable/" target="_blank" style="font-weight: bold">Zero2JupyterHub (Z2JH)</a> deployments. It extends JupyterHub’s Spawner functionality, enabling automatic mounting of external storage resources through the DataMount extension.

## Installation

To use the DataMount Spawner within a Z2JH setup, the **only required configuration** is:

```yaml
hub:
  args:
    - -c
    - >-
      pip install jupyterhub-datamountspawner &&
      jupyterhub -f /usr/local/etc/jupyterhub/jupyterhub_config.py
  command:
    - /bin/bash
  extraConfig:
    customConfig: |
      c.JupyterHub.spawner_class = 'datamountspawner.KubeSpawner'
```

## Compatibility with Z2JH

You can still use any other Spawner-specific **Zero2JupyterHub** configurations alongside the DataMount Spawner. For example:

```yaml
singleuser:
  image:
    name: jupyter/minimal-notebook
    tag: latest
  storage:
    type: none
```

This ensures full compatibility while leveraging the automatic mounting capabilities provided by the DataMount Spawner.

## Pinning Versions

By default, the spawner uses the `jupyterjsc/jupyterlab-data-mount-api:latest` sidecar image and installs the latest `jupyterlab-data-mount` package when the single-user server starts. For reproducible deployments, pin both:

```python
c.KubeSpawner.data_mounts_image = "jupyterjsc/jupyterlab-data-mount-api:<image-tag>"
c.KubeSpawner.data_mount_extension_version = "<package-version>"
```

The sidecar needs privileged mount capabilities and a bidirectional mount for the shared volume. The JupyterLab container uses host-to-container propagation and does not need to run privileged; see [Architecture](../architecture/overview.md) for the security boundary.

The spawner package and sidecar image are released separately. Use versions that include the same DataMount policy changes: the spawner passes the template allowlist and prepares the shared mount directory, while the sidecar enforces the allowlist and protects administrator-provisioned mounts. Pin and upgrade both together; changing only the Python package does not update the sidecar API.
