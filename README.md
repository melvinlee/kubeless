# Kubeless

## Quickstart

kubeless manifests

- `kubeless-$RELEASE.yaml` is used for RBAC Kubernetes cluster.
- `kubeless-non-rbac-$RELEASE.yaml` is used for non-RBAC Kubernetes cluster.

The following deploying kubeless to a `non-RBAC` Kubernetes cluster.

```sh
export RELEASE=$(curl -s https://api.github.com/repos/kubeless/kubeless/releases/latest | grep tag_name | cut -d '"' -f 4)

kubectl create ns kubeless

kubectl create -f https://github.com/kubeless/kubeless/releases/download/$RELEASE/kubeless-non-rbac-$RELEASE.yaml
```

To verify kubeless have been deploy successfully.

```sh
kubectl get pods -n kubeless

kubectl get deployment -n kubeless

kubectl get customresourcedefinition
```

## CLI

Download and install `kubeless` CLI using execute:

### Linux and macOS

```sh
export OS=$(uname -s| tr '[:upper:]' '[:lower:]')
curl -OL https://github.com/kubeless/kubeless/releases/download/$RELEASE/kubeless_$OS-amd64.zip && \
  unzip kubeless_$OS-amd64.zip && \
  sudo mv bundles/kubeless_$OS-amd64/kubeless /usr/local/bin/
```

### Windows

1. Download the latest release from [the releases page](https://github.com/kubeless/kubeless/releases).
2. Extract the content and add the `kubeless` binary to the system PATH.


## Runtimes

You can see the list of supported runtimes executing:

```sh
kubeless get-server-config
```

