import asyncio
import json
import urllib.parse

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
from tornado import web
from tornado.httpclient import AsyncHTTPClient, HTTPClientError, HTTPRequest

from traitlets.config import Configurable
from traitlets import Unicode, List

import os


class DataMount(Configurable):
    api_url = Unicode(
        os.environ.get("JUPYTERLAB_DATA_MOUNT_API_URL", "http://localhost:8090/"),
        config=True,
        help=("URL used to connect to DataMount RClone instance."),
    )

    mount_dir = Unicode(
        os.environ.get("JUPYTERLAB_DATA_MOUNT_DIR", "/mnt/data_mounts"),
        config=True,
        help=(
            """
        The directory which is shared with the DataMountAPI. Create a symlink
        from new mount directory to user chosen directory.
        """
        ),
    )

    templates = List(
        os.environ.get(
            "JUPYTERLAB_DATA_MOUNT_TEMPLATES", "b2drop,aws,s3,webdav,generic"
        ).split(","),
        config=True,
        help=(
            """
          Templates that should be shown in the frontend.
          Available Templates:
            - aws
            - b2drop
            - s3
            - webdav
            - generic
        """
        ),
    )


class DataMountHandler(APIHandler):
    c = {}
    templates = []
    api_url = None
    mount_dir = None
    client = None
    headers = {"Accept": "application/json", "Content-Type": "application/json"}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.c = DataMount(config=self.config)
        self.api_url = f"{self.c.api_url.rstrip('/')}/"
        self.mount_dir = self.c.mount_dir.rstrip("/")
        self.templates = self.c.templates
        self.client = AsyncHTTPClient()

    @web.authenticated
    async def get(self, option=""):
        if option == "templates":
            self.finish(json.dumps(self.templates))
        elif option == "mountdir":
            self.finish(json.dumps(self.mount_dir))
        else:
            try:
                request = HTTPRequest(self.api_url, method="GET", headers=self.headers)
                response = await self.client.fetch(request)
                backend_list = json.loads(response.body.decode("utf-8"))
                frontend_list = []
                for item in backend_list:
                    options = item["options"]
                    template = options.get("template", None)
                    path = f"{self.mount_dir}/{item['path']}"

                    config = options.get("config")
                    config["readonly"] = options.get("readonly", False)
                    config["displayName"] = options.get("displayName", False)
                    config["external"] = options.get("external", False)

                    frontend_list.append(
                        {"template": template, "path": path, "options": config}
                    )

                self.finish(json.dumps(frontend_list))
            except Exception as e:
                self.set_status(400)
                self.finish(str(e))

    @web.authenticated
    async def delete(self, path):
        path = path.lstrip(f"{self.mount_dir}/")
        url = url_path_join(self.api_url, path)
        try:
            request = HTTPRequest(url, method="DELETE", headers=self.headers)
            response = await self.client.fetch(request)
            self.set_status(204)
        except HTTPClientError as e:
            self.set_status(400)
            if e.response:  # Check if a response exists
                error_body = json.loads(e.response.body.decode())
                self.finish(json.dumps(error_body.get("detail", str(e))))
        except Exception as e:
            self.set_status(400)
            self.finish(str(e))

    @web.authenticated
    async def post(self):
        frontend_dict = json.loads(self.request.body)
        path = frontend_dict["path"]
        template = frontend_dict["template"]

        config = frontend_dict.get("options", {})
        readonly = config.pop("readonly", False)
        display_name = config.pop("displayName", template)

        backend_dict = {
            "path": path.lstrip(f"{self.mount_dir}/"),
            "options": {
                "displayName": display_name,
                "template": template,
                "external": False,
                "readonly": readonly,
                "config": config,
            },
        }
        try:
            request = HTTPRequest(
                self.api_url,
                method="POST",
                body=json.dumps(backend_dict),
                headers=self.headers,
                request_timeout=60.0,
            )
            response = await self.client.fetch(request)
            self.log.info(response)
        except Exception as e:
            self.set_status(400)


def setup_handlers(web_app):
    base_url = url_path_join(
        web_app.settings["base_url"], "data-mount"  # API Namespace
    )
    web_app.add_handlers(
        ".*$",
        [
            (
                url_path_join(
                    base_url,
                ),
                DataMountHandler,
            ),
            (url_path_join(base_url, "([^/]+)"), DataMountHandler),
        ],
    )
