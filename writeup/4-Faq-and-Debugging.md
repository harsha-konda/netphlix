This section contains approaches to resolving common issues that may be encountered during the project and techniques for gaining insight about your systems. You may refer back to this section while completing the subsequent project tasks.

If you find that the issue you are facing is not described in this section, then it is recommended to identify the root cause of the issue and seek resolution by reviewing additional technical material. Documentation that you may find relevant to this project are listed below.

## References

### Docker
* [Docker CLI](https://docs.docker.com/engine/reference/commandline/docker/)
* [Docker Engine user guide](https://docs.docker.com/engine/userguide/intro/)
* [Best practices for writing Dockerfiles](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/)

### Kubernetes
* [kubectl Reference Documentation](https://kubernetes.io/docs/user-guide/kubectl/v1.6/)
* [Kubernetes Reference Documentation](https://kubernetes.io/docs/reference/)
 * [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
 * [Services](https://kubernetes.io/docs/user-guide/services/)
* [Kubernetes Resource Types](https://kubernetes.io/docs/resources-reference/v1.6/)
 
### Cloud Tools
* [Azure CLI 2.0 Reference](https://docs.microsoft.com/en-us/cli/azure/)
* [gcloud Reference](https://cloud.google.com/sdk/gcloud/reference/)

## FAQ
* **Why aren't all of the containers in my deployment running?**
 * Using `kubectl`, you can determine if the issue is related to launching the container ( `kubectl describe deployment`) or if the issue occurs after the container is launched (`kubectl logs`).  
* **Why didn't my container update after I rebuild my Docker image?**
 * If the image name or image tags did not change (i.e. the image tag remains ***latest*** as in ***ubuntu:latest***), then Kubernetes will not deploy a new image when you apply the configuration to the cluster. Instead, tag your images with a version number (i.e. `v0`, `v1`...).
 * If the image has not been updated in the Docker repository - whether in ACR or GCR - then the image cannot be pulled for use in the Kubernetes cluster.
* **Can I run a command inside a running container?**
 * Yes, Kubernetes provides the `execute` functionality of Docker, which allows you to access running containers. In fact, this command can be used to start an interactive shell.
