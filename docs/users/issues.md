# Troubleshooting

## Checking Logs for Issues

If you encounter any problems while mounting storage, you can check the logs of the mounting backend. The logs are written to:

```
/home/jovyan/data_mounts/mount.log
```

Reviewing this log file may provide insights into what went wrong and how to fix it.

## Failed Unmount: Resource is Busy

One common issue when unmounting a storage resource is receiving an error stating that the resource is busy. This happens when there are open files or processes still accessing the mounted directory.

### How to resolve:

1. Ensure no files within the mount directory are open.
2. Close any terminals or applications that may be using the mount.
3. Retry unmounting the storage.
4. If it still doesn't work don't worry. When the JupyterLab's stopped, everything will be unmounted.

> Due to the way JupyterLab operates, unmounting a storage mount may sometimes fail. For example, JupyterLab may attempt to create a `.ipynb-checkpoints` directory within a read-only mount, causing the system to keep the mount point "busy." In such cases, the mount cannot be released until JupyterLab is stopped.
