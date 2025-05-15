import asyncio
import json
import os

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
from tornado import web
from tornado.httpclient import AsyncHTTPClient, HTTPClientError, HTTPRequest

from traitlets.config import Configurable
from traitlets import Any, Bool, Unicode, List


class DataMount(Configurable):
    enabled = Bool(
        os.environ.get("JUPYTERLAB_DATA_MOUNT_ENABLED", "false").lower()
        in ["1", "true"],
        config=True,
        help=("Enable extension backend"),
    )

    api_url = Unicode(
        os.environ.get("JUPYTERLAB_DATA_MOUNT_API_URL", "http://localhost:8090/"),
        config=True,
        help=("URL used to connect to DataMount RClone instance."),
    )

    mount_dir = Unicode(
        os.environ.get("JUPYTERLAB_DATA_MOUNT_DIR", "data_mounts"),
        config=True,
        help=(
            """
        The directory which is shared with the DataMountAPI. Create a symlink
        from new mount directory to user chosen directory.
        """
        ),
    )

    templates = Any(
        default_value=os.environ.get(
            "JUPYTERLAB_DATA_MOUNT_TEMPLATES", "uftp,b2drop,aws,s3,webdav,generic"
        ).split(","),
        config=True,
        help=(
            """
          Templates that should be shown in the frontend.
          Available Templates:
            - aws
            - b2drop
            - s3
            - uftp
            - webdav
            - generic

            Can be a callable function.
        """
        ),
    )

    uftp_access_token = Any(
        default_value=None,
        config=True,
        help=(
            """
        Function called to get current access token of user before sending
        request to the API.

        Example:
        def get_token():
            return "mytoken"
        """
        ),
    )

    uftp_allowed_dirs = Any(
        default_value=[],
        config=True,
        help=(
            """
        Define the allowed mounting directories.
        Supported Types: String, List or callable function.
        Callable function must return a List or a String.

        Frontend behavior based on this value:
        If type is string:
            Value is shown and user can change it.
        If type is list:
            Required Structure for each element:
                { "label": "_label_", "value": "_url" }
            If list has zero elements: User will see a TextField to enter url
            If list has one element: User will not see the Dropdown Menu
            If list has multiple elements: User can select a auth url
        """
        ),
    )

    uftp_auth_values = Any(
        default_value=os.environ.get("JUPYTERLAB_DATA_MOUNT_UFTP_AUTH_VALUES", ""),
        config=True,
        help=(
            """
        Allowed "_auth" values for pyunicore.uftp.uftp.UFTP().authenticate(cred, _auth, _base_dir)

        Supported Types: String, List or callable function.
        Callable function must return a List or a String.

        Frontend behavior based on this value:
        If type is string:
            Value is shown and user can change it.
        If type is list:
            Required Structure for each element:
                { "label": "_label_", "value": "_url" }
            If list has zero elements: User will see a TextField to enter url
            If list has one element: User will not see the Dropdown Menu
            If list has multiple elements: User can select a auth url
        """
        ),
    )

    uftp_label = Unicode(
        default_value=os.environ.get("JUPYTERLAB_DATA_MOUNT_UFTP_LABEL", "UFTP"),
        config=True,
        help=(
            """
            Define label used for uftp in the frontend Mount Dialog
            """
        ),
    )


class DataMountHandler(APIHandler):
    c = {}
    templates = []
    enabled = False
    api_url = None
    mount_dir = None
    client = None
    uftp_allowed_dirs = []
    uftp_auth_values = []
    uftp_access_token = None
    reached_api = False
    headers = {"Accept": "application/json", "Content-Type": "application/json"}

    async def fetch(self, request, timeout=60, interval=2):
        start_time = asyncio.get_event_loop().time()

        while asyncio.get_event_loop().time() - start_time < timeout:
            try:
                response = await self.client.fetch(request)
                self.reached_api = True
                return response
            except HTTPClientError as e:
                if self.reached_api:
                    raise e
                self.log.debug(f"Data Mount API not ready, retrying in {interval}s...")
                await asyncio.sleep(interval)
            except ConnectionRefusedError:
                if self.reached_api:
                    raise e
                self.log.debug(f"Data Mount API not ready, retrying in {interval}s...")
                await asyncio.sleep(interval)

        self.log.info(
            f"Data Mount API did not become ready within {timeout} seconds. Giving up."
        )
        raise Exception(
            f"Data Mount API did not become ready within {timeout} seconds. Giving up."
        )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.client = AsyncHTTPClient()
        self.c = DataMount(config=self.config)
        self.enabled = self.c.enabled
        self.api_url = f"{self.c.api_url.rstrip('/')}/"
        self.mount_dir = self.c.mount_dir.rstrip("/")

        templates = self.c.templates
        if callable(templates):
            self.templates = templates()
        else:
            self.templates = templates

        self.uftp_label = self.c.uftp_label
        self.uftp_access_token = self.c.uftp_access_token

        uftp_allowed_dirs = self.c.uftp_allowed_dirs
        if callable(uftp_allowed_dirs):
            if callable(self.uftp_access_token):
                access_token = self.uftp_access_token()
            else:
                access_token = self.uftp_access_token
            self.uftp_allowed_dirs = uftp_allowed_dirs(access_token)
        else:
            self.uftp_allowed_dirs = uftp_allowed_dirs

        uftp_auth_values = self.c.uftp_auth_values
        if callable(uftp_auth_values):
            self.uftp_auth_values = uftp_auth_values()
        else:
            self.uftp_auth_values = uftp_auth_values

    @web.authenticated
    async def get(self, option=""):
        if option == "templates":
            self.finish(json.dumps(self.templates))
        elif option == "uftp":
            allowed_dirs = [
                {"value": x["value"], "label": x["label"]}
                for x in self.uftp_allowed_dirs
            ]
            self.finish(
                json.dumps(
                    {
                        "name": self.uftp_label,
                        "allowed_dirs": allowed_dirs,
                        "auth_values": self.uftp_auth_values,
                    }
                )
            )
        elif option == "mountdir":
            self.finish(json.dumps(self.mount_dir))
        else:
            if not self.enabled:
                self.set_status(200)
                self.finish(json.dumps([]))
            else:
                try:
                    request = HTTPRequest(
                        self.api_url, method="GET", headers=self.headers
                    )
                    if option == "init":
                        response = await self.fetch(request)
                    else:
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
                    self.log.exception("DataMount - List failed")
                    self.set_status(400)
                    self.finish(str(e))

    @web.authenticated
    async def delete(self, path):
        path = path.replace(f"{self.mount_dir}/", "", 1)
        url = url_path_join(self.api_url, path)
        try:
            request = HTTPRequest(url, method="DELETE", headers=self.headers)
            await self.client.fetch(request)
            self.set_status(204)
        except HTTPClientError as e:
            self.log.exception("DataMount - Delete failed")
            self.set_status(400)
            if e.response:  # Check if a response exists
                error_body = json.loads(e.response.body.decode())
                self.finish(json.dumps(error_body.get("detail", str(e))))
        except Exception as e:
            self.log.exception("DataMount - Delete failed")
            self.set_status(400)
            self.finish(str(e))

    @web.authenticated
    async def post(self):
        frontend_dict = json.loads(self.request.body)
        path = frontend_dict["path"]
        path = path.replace(f"{self.mount_dir}/", "", 1)
        template = frontend_dict["template"]
        config = frontend_dict.get("options", {})

        if template == "uftp":
            if self.uftp_access_token:
                access_token = self.uftp_access_token()
                if access_token:
                    config["access_token"] = access_token
            predefined_dir = [
                x.get("options", {})
                for x in self.uftp_allowed_dirs
                if config.get("remotepath") == x.get("value")
            ]
            if predefined_dir:
                config.update(predefined_dir[0])

        readonly = config.pop("readonly", False)
        display_name = config.pop("displayName", template)
        backend_dict = {
            "path": path,
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
            )
            await self.client.fetch(request)
        except Exception as e:
            self.log.exception("DataMount - Post failed")
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
            (url_path_join(base_url, "(.*)"), DataMountHandler),
        ],
    )
