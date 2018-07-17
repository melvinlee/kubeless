# [Kubeless](https://kubeless.io/)

> Kubeless is a Kubernetes-native serverless framework that lets you deploy small bits of code (functions) without having to worry about the underlying infrastructure.

## Quickstart

kubeless manifests

- `kubeless-$RELEASE.yaml` is used for RBAC Kubernetes cluster.
- `kubeless-non-rbac-$RELEASE.yaml` is used for non-RBAC Kubernetes cluster.

The following deploying kubeless to a `non-RBAC` Kubernetes cluster.

```sh
$ export RELEASE=$(curl -s https://api.github.com/repos/kubeless/kubeless/releases/latest | grep tag_name | cut -d '"' -f 4)

$ kubectl create ns kubeless

$ kubectl create -f https://github.com/kubeless/kubeless/releases/download/$RELEASE/kubeless-non-rbac-$RELEASE.yaml
```

To verify kubeless have been deploy successfully.

```sh
$ kubectl get pods -n kubeless
NAME                                           READY     STATUS    RESTARTS   AGE
kubeless-controller-manager-67fbc78f6d-cqbjb   1/1       Running   0          20h

$ kubectl get deployment -n kubeless
NAME                          DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
kubeless-controller-manager   1         1         1            1           20h

$ kubectl get customresourcedefinition
NAME                          AGE
cronjobtriggers.kubeless.io   20h
functions.kubeless.io         20h
httptriggers.kubeless.io      20h
```

## CLI

Download and install `kubeless` CLI using execute:

### Linux and macOS

```sh
$ export OS=$(uname -s| tr '[:upper:]' '[:lower:]')
$ curl -OL https://github.com/kubeless/kubeless/releases/download/$RELEASE/kubeless_$OS-amd64.zip && \
  unzip kubeless_$OS-amd64.zip && \
  sudo mv bundles/kubeless_$OS-amd64/kubeless /usr/local/bin/
```

### Windows

1. Download the latest release from [the releases page](https://github.com/kubeless/kubeless/releases).
2. Extract the content and add the `kubeless` binary to the system PATH.

## Runtimes

You can see the list of supported runtimes by executing:

```sh
$ kubeless get-server-config
INFO[0000] Current Server Config:
INFO[0000] Supported Runtimes are: python2.7, python3.4, python3.6, nodejs6, nodejs8, nodejs_distroless8, ruby2.4, php7.2, go1.10, dotnetcore2.0, java1.8, ballerina0.980.0, jvm1.8
```

## Sample function

Let's create the following node.js sample `nodejs-test.js`

```js
module.exports.handler = (event,context) => {
      console.log(event);
      let greeting = `hello, ${event.data}!`;
      return JSON.stringify(greeting);
}
```

and deploy function with:

```sh
$ kubeless function deploy hellojs \
--runtime nodejs8 \
--handler hello.handler \
--from-file hello.js
INFO[0000] Deploying function...
INFO[0000] Function hellojs submitted for deployment
INFO[0000] Check the deployment status executing 'kubeless function ls hellojs'
```

Check the function creation status:

```sh
$ kubeless function ls
NAME    NAMESPACE       HANDLER         RUNTIME DEPENDENCIES    STATUS
hellojs default         hello.handler   nodejs8                 1/1 READY
```

Call the function with:

```sh
$ kubeless function call hellojs --data 'John'
"hello, John!"
```

Or you can curl directly with kubectl proxyusing an apiserver proxy URL.
For example:

```sh
$ kubectl proxy &

$ curl -L --data "Peter" \
  localhost:8001/api/v1/namespaces/default/services/hellojs:http-function-port/proxy/
```

## Cleanup

Finally, let's cleanup everything.

```sh
$ kubectl delete ns kubeless
namespace "kubeless" deleted

$ kubectl delete customresourcedefinition --all
customresourcedefinition.apiextensions.k8s.io "cronjobtriggers.kubeless.io" deleted
customresourcedefinition.apiextensions.k8s.io "functions.kubeless.io" deleted
customresourcedefinition.apiextensions.k8s.io "httptriggers.kubeless.io" deleted
```