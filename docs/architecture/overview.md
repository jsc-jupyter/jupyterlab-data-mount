# Architecture

## Overview

The JupyterLab DataMount Extension integrates external storage seamlessly into Jupyter environments using a sidecar container approach. Below is an overview of the architecture:

<div style="text-align: center;">
  <img src="https://jsc-jupyter.github.io/jupyterlab-data-mount/images/architecture_overview.svg" alt="Architecture" style="width: 70%;">
</div>

<details>
<summary>Architecture with additional information: </summary>
<div style="text-align: center;">
  <img src="https://jsc-jupyter.github.io/jupyterlab-data-mount/images/architecture_overview_details.svg" alt="Architecture" style="width: 90%;">
</div>
</details>

### Mount Propagation & Security

- The **rclone sidecar container** requires **mountPropagation: Bidirectional**, which enables proper propagation of mounted storage.
- The **Jupyter container** only needs **mountPropagation: HostToContainer**, ensuring that it can access mounts without additional privileges.
- To support this mechanism:
    - The **mount container** runs as `root` with `privileged: true` to handle mounting securely.
    - The **Jupyter container** operates as the `jovyan` user with no extra privileges, ensuring security by design.

The JupyterLab container remains unprivileged, but the mount sidecar must run as root with `privileged: true` and the configured mount capabilities. The API sidecar is bound to the Pod loopback interface by default, so the Jupyter Server and notebook code in the same Pod can reach it while other Pods cannot connect through the Pod IP. If the API is moved to a separate deployment, configure its bind address deliberately and restrict network access; the API does not provide authentication.

## Compatibility & Flexibility

The extension is designed to function in various environments, provided that:

1. A **REST API** is available to handle mount requests.
2. A **shared volume** exists between the Jupyter container and the REST API container to support mount propagation.

### Kubernetes & Zero2JupyterHub

While the extension is adaptable to different setups, it is optimized for use with the **Zero2JupyterHub Helm Chart on Kubernetes**, providing a streamlined and simple deployment process. Look into the [Spawner](../spawner/installation.md) section for more information.
