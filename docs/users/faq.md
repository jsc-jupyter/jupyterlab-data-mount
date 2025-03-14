# Troubleshooting & FAQ

## Troubleshooting

### Checking Logs for Issues

If you encounter any problems while mounting storage, you can check the logs of the mounting backend. The logs are written to:

```
/home/jovyan/data_mounts/mount.log
```

Reviewing this log file may provide insights into what went wrong and how to fix it.

### Failed Unmount: Resource is Busy

One common issue when unmounting a storage resource is receiving an error stating that the resource is busy. This happens when there are open files or processes still accessing the mounted directory.

#### How to resolve:

1. Ensure no files within the mount directory are open.
2. Close any terminals or applications that may be using the mount.
3. Retry unmounting the storage.
4. If it still doesn't work don't worry. When the JupyterLab's stopped, everything will be unmounted.

> Due to the way JupyterLab operates, unmounting a storage mount may sometimes fail. For example, JupyterLab may attempt to create a `.ipynb-checkpoints` directory within a read-only mount, causing the system to keep the mount point "busy." In such cases, the mount cannot be released until JupyterLab is stopped.

---

## Frequently Asked Questions (FAQ)

### Can I contribute additional mount templates?

Yes! We welcome contributions to expand the available mount templates. You can find existing templates in the source code repository, which can serve as blueprints for creating new ones.

- **Existing Templates:** [GitHub](https://github.com/jsc-jupyter/jupyterlab-data-mount/tree/main/src/templates)
- **How to contribute:**
  1. Create your own mount template based on existing ones.
  2. Test it to ensure it works as expected. [Development](https://github.com/jsc-jupyter/jupyterlab-data-mount/tree/main?tab=readme-ov-file#contributing)
  3. Submit a Pull Request to the repository.

We appreciate community contributions to enhance the software!
