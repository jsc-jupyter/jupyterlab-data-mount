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
