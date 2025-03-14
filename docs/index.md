# JupyterLab DataMount Extension

## Overview

The **JupyterLab DataMount** extension is designed to provide seamless access to external storage services directly within JupyterLab. By integrating multiple storage backends, it allows users to mount and interact with remote data effortlessly. The extension is especially useful for researchers and data analysts who need quick and secure access to large datasets.

<div style="text-align: center;">
  <img src="https://jsc-jupyter.github.io/jupyterlab-data-mount/images/jupyterlab.png" alt="JupyterLab" style="width: 70%;">
</div>

## Why Use JupyterLab DataMount?

- **Easy Storage Integration**: Supports various storage backends, including WebDav, AWS, S3-compatible storage and many more.
- **User-Friendly Interface**: Provides a simple UI for managing data mounts without requiring complex configurations.
- **Seamless JupyterHub Integration**: Works effortlessly with JupyterHub, allowing admins to preconfigure storage access.
- **Secure & Efficient**: Ensures data security with a sidecar-based approach and restricts privilege escalation.
- **Flexible Usage**: Works for different user needs, including read-only access, temporary mounts, and persistent storage.

## Who Should Use This Extension?

JupyterLab DataMount is designed for:

- **Researchers and Data Scientists** who need to work with large datasets stored in remote locations.
- **Educators and Students** who require seamless access to educational resources and cloud storage.
- **JupyterHub Administrators** who want to preconfigure storage access for users while maintaining security.

## Security Features

JupyterLab DataMount is built with security in mind:

- **Mounting realized in a sidecar container**: The mounting process is embedded in a separate container, ensuring that the main JupyterLab environment remains isolated.
- **No Privileged Execution**: The extension operates without requiring root privileges, preventing unauthorized access.
- **No Privilege Escalation**: The security model explicitly disallows privilege escalation to ensure a controlled execution environment.
- **Hidden Secrets**: Storage credentials and secrets can be preconfigured and hidden from users while still allowing access to external storage in a controlled manner.

## Use Cases

JupyterLab DataMount is ideal for:

- **Data Science & Research**: Access remote datasets for analysis and visualization without downloading them manually.
- **Cloud-Based Workflows**: Mount cloud storage solutions (AWS S3, WebDav, B2Drop, etc.) to work on data stored remotely.
- **Collaborative Environments**: Enable teams to access shared storage locations securely within JupyterLab.
- **Read-Only Data Access**: Provide users with access to preconfigured datasets without exposing credentials or write permissions.

This extension enhances productivity by simplifying how data is accessed and managed within JupyterLab, while maintaining strong security practices.

---

For detailed documentation, refer to the specific sections on [Using the Extension](#), [Security Details](#), and [JupyterHub Integration](#).
