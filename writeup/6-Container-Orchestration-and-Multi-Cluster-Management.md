# Container Orchestration and Multi-Cluster Management

Playground's prototype for a code evaluation service has drummed up much excitement and the Series A funding round has provided enough capital to develop a full fledged product! In this task we will build a more advanced, production ready product. Through extensive market research, Playground's product team has identified that hiring managers and HR teams are seeking candidates with strong Python programming skill. 

So far you have completed a task using multiple containers in multiple deployments and have deployed your application in a containerized environment on a single cloud provider. In this task, your code evaluation service will be deployed across multiple cloud service providers.

##Task Illustration##
Playground needs to be resilient to the downtimes experienced by Cloud Service Providers (CSP). Hence, it is best advised that your service is deployed in multiple CSPs. This makes your service highly available, however, it adds a lot of work on your system administrators to manage the service in different cloud platforms. Fortunately, with Kubernetes, the dependency on a particular cloud platform is abstracted. You can work with GCP and Azure at the same time, and manage the clusters in each of them using `kubectl` from one location. We have provided an AWS AMI which contains all the tools such as the  Azure / gcloud CLI, `kubectl` which are needed for the development. We will refer to this instance as the *student VM*. You will manage all your clusters and submit your files from this student VM.


![](https://s3.amazonaws.com/f17/Project2.2/task4_v2.png)
**Figure 11**: Architectural overview of multi-cloud cluster deployment.

In the big picture, you will setup Kubernetes clusters on GCP and Azure and you will connect with each of these Kubernetes cluster from the student VM node. The UI frontend container will be hosted using a Kubernetes `deployment` on GCP and the Python playground server container will be deployed in GCP and Azure. 
The interaction between the user and your service would be as follows:

  1. In the browser the user types the Python code in the text area provided by the Python Playground UI container.

  1. On Submit, the loadbalancer in GCP will receive a POST request which will be forwarded to the Playground UI container in GCP. On receiving the POST request, the playground UI in GCP will place a HTTP request to the container in GCP or Azure in a `round-robin` fashion.

  1. The server container will execute the code, capture the output from `stdout` and `stderr`, and respond it back to the UI container for Python code execution.

  1. The UI container in GCP will return the same response it receives from the server container, back to the browser.

**Note:** All HTTP responses should have header `Content-type` as `application/json`.


# Python Backend Requirements

All requests for executing Python code should be sent to /py/eval to execute and capture the output from stdout and stderr. The table below explains the usage of this API.

[table]
[tbody]

[tr]
[th]API[/th]
[th]Produces[/th]
[th]Consumes[/th]
[th]Request Parameters[/th]
[th]Response Values[/th]
[/tr]

[tr]
[td]`/py/eval`[/th]
[td]`application/json`[/th]
[td]`application/json`[/th]
[td]
**code** - The Python code to execute  
[/td]
[td]
**stdout** - Output captured from `stdout` by executing the Python code.  
**stderr** -  Output captured from `stderr` by executing the Python code. 
[/td]
[/tr]

[/tbody]
[/table]




START-PANEL:"info"

START-PANEL:"warning"
If you are using a Python Flask for the frontend server, your code should be able to the `code` request argument from both the `request.form` and `request.json` field. `code` will appear in one of these locations and you should check both.
END-PANEL

START-PANEL:"info"
You can copy the frontend and backend implementations from the previous task to the `/home/<ANDREW_ID>/Project2_2/task3` directory.
END-PANEL

### Tasks to complete
  1. Setup two Kubernetes clusters, each deployed in GCP and Azure respectively. This setup should be made from the student VM. Visit the primer **Introduction to Kubernetes** for setting up the clusters. After the setup, you should see two contexts when you issue

        kubectl config get-contexts
one for each platform. You can switch between contexts by using `use-context` and perform any `kubectl` operation for that context.

  1.  Launch a t2.micro instance in EC2 using `ami-cb7762b0`. Use that for running the kubectl (Student VM in the diagram).

  1.  On the instance, enter `/home/<ANDREW_ID>/Project2_2/task3`

  1.  Develop the Python backend server Docker image and publish them to GCP's Container Registry and Azure's Container Registry. This is similar to the previous task that you did on GCP.
  1.  In Azure's context, update `azure.yaml` file to do the following:
    - Set up one container in the deployment
        - Python backend server: listening at port `6000`, **in this task make sure that your Python backend server receives the code in json format {'code':'PYTHON_CODE'}**.
    - The loadbalancer service for this deployment should:
        - forward the port `80` request to container port `6000`
  1.  Create a deployment and loadbalancer service using the yaml file in their respective context and then note the IP addresses of the Loadbalancer created in  Azure.
  1.  Using these IP addresses, for GCP, update the playground.py to implement a simple `round-robin` frontend server that will route the `/python` path alternatively to both, Azure and GCP backend, cloud's LB IPs.
  1. When you think that `playground.py` is stable, create a docker image of it and upload it to Google's Container Registry. Then update the `gke_config.yaml` file to:
    - Set up a two deployments
        - Python playground UI: listening at port `5000`
        - Python backend: listening at port `6000`
    - The loadbalancer services for these deployments should:
        - forward the port `80` request to container port `5000`
        - forward the port `6000` request to container `6000`
  1.  Switch to GCP kubectl context and then create the deployment and loadbalancer service. When they are up and running, visit the IP of the load balancer you just created to use your Playground service on a highly available, multiple cloud platform, containerized environment. 
END-PANEL


START-PANEL:"warning"
Please keep an eye on the budget in this task, as you will be using multiple clusters on different cloud platforms.
END-PANEL


START-PANEL:"info"
## How to Submit:

1. Provision and manage the two Kubernetes clusters. You will need access to the clusters from the AWS AMI instance `ami-cb7762b0` that we provided to you.
1. Make sure that your `kubectl` command could successfully manage the two k8s clusters by context switching the kubectl config.
1. Develop the system to meet the above specification. Any YAML files, Dockerfile, and code that you developed should be included under the `task3` directory.
1. Run the submitter from the `/home/<ANDREW_ID>/Project2_2/task3` directory and follow the prompts:

     $ ./task3_submitter
     ... 

END-PANEL

START-PANEL:"info"
###Hints###
If you are unable to see both Kubernetes cluster contexts, refer to the following documents to add the cluster credentials to your Kubernetes config file :

- [gcloud container](https://cloud.google.com/sdk/gcloud/reference/container/clusters/get-credentials)
- [Azure Container Service walkthrough](https://docs.microsoft.com/en-us/azure/container-service/container-service-kubernetes-walkthrough)
- [The kubeconfig file](https://kubernetes.io/docs/user-guide/kubeconfig-file/)

END-PANEL

[1]: https://s3.amazonaws.com/15619public/webcontent/P22_Task_4.jpg
