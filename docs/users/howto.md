# Using JupyterLab DataMount

## Overview

JupyterLab DataMount provides an intuitive way to access external storage within your JupyterLab environment. This guide walks you through using the extension, from opening the interface to mounting and managing your storage.

## Accessing the Extension

1. Open JupyterLab in your browser.
2. Locate the **DataMount** sidebar on the left panel.
3. Click on "Add Mount" to open the mount dialog.

<div style="text-align: center;">
  <img src="https://jsc-jupyter.github.io/jupyterlab-data-mount/images/sidebar.png" alt="Sidebar" style="width: 50%;">
</div>

## Mounting a Storage Location

1. **Choose a Template**
   Select from predefined storage templates such as B2Drop, AWS S3, S3-compatible storage, WebDav, or a generic configuration.
2. **Specify the Mount Path**
   Define where the storage should be mounted within your JupyterLab environment.
3. **Enter Storage Credentials**
   Provide the necessary details (e.g. bucket name, API keys, tokens, or access credentials).
4. **Click Mount**
   The extension will establish a connection and mount the storage location.

<div style="text-align: center;">
  <img src="https://jsc-jupyter.github.io/jupyterlab-data-mount/images/dialog.png" alt="Dialog" style="width: 50%;">
</div>

## Managing Mounted Storage

- **Open Directory**: Open directory of mounted storage.
- **Show settings**: Show settings used during the mount process.
- **Unmount**: Unmount external storage location.

<div style="text-align: center;">
  <img src="https://jsc-jupyter.github.io/jupyterlab-data-mount/images/mountlist.png" alt="Mountlist" style="width: 30%;">
</div>

## Working with Mounted Storage

- **Access Files**: Mounted storage will appear in the JupyterLab file browser, allowing you to open, edit, and manage files as if they were local.
- **Read-Only vs Read-Write**: Some mounts may be read-only, depending on the configuration.
- **Performance Considerations**: Remote storage access speed depends on network conditions and storage provider.

## Preconfigured Mounts

Before starting the JupyterLab, one can preconfigure data mounts.
These mounts are set up by administrators and cannot be modified by the user. The underlying configurations remain hidden, ensuring that sensitive credentials are not exposed. This feature allows users to access shared datasets securely for tasks such as data visualization, analysis, or workshops without requiring direct access to storage credentials.
Preconfigured mounts are displayed in _italic_ and only provide the **"Open Directory"** button.

<div style="text-align: center;">
  <img src="https://jsc-jupyter.github.io/jupyterlab-data-mount/images/mountlist_ext.png" alt="Mountlist" style="width: 30%;">
</div>

## Next Steps

Now that you’ve learned how to mount storage, explore the [Storage Templates](#) section for specific details on configuring B2Drop, AWS S3, WebDav, and other storage options.
