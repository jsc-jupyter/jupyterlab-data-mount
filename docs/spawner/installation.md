# JupyterHub DataMount Spawner

## Overview

The **JupyterHub DataMount Spawner** ([GitHub source](https://github.com/jsc-jupyter/jupyterhub-data-mount-kubespawner)) is designed for seamless integration within **Zero2JupyterHub (Z2JH)** deployments. It extends JupyterHub’s Spawner functionality, enabling automatic mounting of external storage resources through the DataMount extension.

## Configuration

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
