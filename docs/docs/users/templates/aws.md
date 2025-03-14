# AWS Template Configuration

The **AWS** template allows users to mount their Amazon Web Service S3 Bucket within JupyterLab.

> JupyterLab DataMount uses **rclone** to mount AWS. Check out their [documentation](https://rclone.org/s3/#configuration) for more details.

## Requirements

- An Amazon S3 Storage Object. The setup process is not covered in this documentation, you can learn more about it [here](https://aws.amazon.com/s3/).

 <div style="text-align: center;">
  <img src="images/awsbucket.png" alt="AWS Bucket" style="width: 80%;">
</div>

## Configuration Parameters

To configure an AWS mount, the following parameters are required:

- **Bucket Name**: AWS Bucket Name (_myawsbucket4545_ in the example above).
- **Region**: Region to connect to (_eu-north-1_ in the example above).
- **Username**: AWS Access Key ID.
- **Password**: AWS Secret Access Key.

<div style="text-align: center;">
  <img src="images/aws.png" alt="AWS" style="width: 30%;">
</div>

## Advanced

<details>
  <summary>RClone configuration</summary>
  <br>
  The following configuration is used to mount AWS with rclone:<br>
  aws.config:<br>
  ```yaml
  [aws]
  type = s3
  provider = AWS
  access_key_id = _username_
  secret_access_key = _password_
  region = _region_
  <br>
  Mounted via <br>
  ```bash
  rclone mount --config aws.config aws:_bucketname_ _path_ --vfs-cache-max-size=10G --vfs-read-chunk-size=64M --vfs-cache-mode=writes --allow-other --uid=1000 --gid=100
  ```
  <br>
</details>
<details>
  <summary>JupyterHub pre_configuration</summary>
  <br>
  The following configuration can be used to preconfigure a AWS mount for users:<br>
  ```json
  # pip install jupyterhub-datamountspawner
  c.JupyterHub.spawner_class = 'datamountspawner.KubeSpawner'
  c.KubeSpawner.init_mounts = [
    {
      "path": "_path_", # relative path. "aws" is a valid value
      "options": {
        "displayName": "AWS (external)",
        "template": "aws",
        "readonly": True, # default: False
        "config": {
          "remotepath": "_bucketname_",
          "type": "s3",
          "provider": "AWS",
          "access_key_id": "_id_",
          "secret_access_key": "_secret_",
          "region": "_region_"
        }
      }
    }
  ]
  ```
  - Replace _path_, _bucketname_, _region_, _id_ and _secret_<br>
  - Users will not see the used configuration
</details>
