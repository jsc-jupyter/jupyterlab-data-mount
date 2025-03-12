import setuptools

with open("README.md", "r", encoding="utf-8") as f:
    long_description = f.read()

setuptools.setup(
    name="jupyterlab_data_mount",
    version="0.1.0",
    packages=setuptools.find_packages(),
    url="https://github.com/jsc-jupyter/jupyterlab-data-mount",
    author="Tim Kreuzer",
    author_email="t.kreuzer@fz-juelich.de",
    description="Jupyter extension to mount external data storage.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    classifiers=[
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
    ],
)
