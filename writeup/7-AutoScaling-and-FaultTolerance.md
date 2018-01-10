# Autoscaling and Fault-Tolerance

It's been a couple of years since Playground's multi-cluster Python Code Execution As A Service was first launched. Surprisingly, the code and configuration files you wrote all those years ago are still surviving in production. Now, Playground is about to be listed in the New York Stock Exchange with the ticker symbol FUN. Playground has just hired a team of application security analysts to scrutinize your work and minimize the possibility of service outages as the product gains even more popularity. They have made two recommendations: (1) beefing up fault-tolerance and (2) autoscaling to deal with demand. 

By this point, you should have created a multi-cluster deployment across Azure and GCP. You have a front end listening on port 80 that routes requests to backend deployments in clusters hosted on both Azure and Google Cloud Platform. Your role in this task is to (1) make sure that your backend deployments in both Azure and GCP will replicate to scale out with increased load and (2) make sure that all HTTP requests we send to the containers all receive a successful response, even if an evil hacker has taken down one of your deployments.


![](https://s3.amazonaws.com/f17/Project2.2/task4_v2.png)
**Figure 11**: Architectural overview of  a fault tolerant system

START-PANEL:"info"
If you are using a global counter to maintain the number of `non-200` responses each backend services, you may have to re-deploy the frontend application to reset the counter between submissions. It's up to you to determine how to implement the backend service blacklisting functionality. 
END-PANEL

START-PANEL:"info"
You can copy the frontend and backend implementations from the previous task to the `/home/<ANDREW_ID>/Project2_2/task3` directory.
END-PANEL

START-PANEL:"info"
## Tasks to Complete
1. Launch a t2.micro instance in EC2 using `ami-cb7762b0` or continue using your instance from the previous tasks.

1. On the instance, enter `/home/<ANDREW_ID>/Project2_2/task4` directory

1. Update the frontend application so that it maintains the count of `non-200` responses each backend services. After receiving more than **10** `non-200` responses from a backend, you should stop sending requests to that service and begin sending all traffic to the remaining healthy services.

1. In the `yaml` files for both the GCP and Azure clusters, create a `HorizontalPodAutoscaler` for all of your backend `Deployment` in both GCP and Azure. 

1. Define some appropriate specs for the `HorizontalPodAutoscaler`. Think about what kind of scaling policy you should implement. Some ideas include the minimum and maximum number of pods and the target CPU utilization each replica can have.

1. Here is a barebones template you can append to the `yaml` file you have from the previous task.

  

         apiVersion: autoscaling/v1
         kind: HorizontalPodAutoscaler
         metadata:
           name: meaningful_name
           namespace: default
         spec:
           scaleTargetRef:
             apiVersion: apps/v1beta1
             kind: Deployment
             name: meaningful_name
         minReplicas: meaningful_number
         maxReplicas: meaningful_number
         targetCPUUtilizationPercentage: another_meaningful_number

1. You should monitor the CPU utilization of the deployments to determine the `targetCPUUtilizationPercentage` so that scaling will occur under a high load.

1. To submit task run and follow the prompts:

         $ ./task4_submitter
          ...

###Hints

1. You can find some documentation on horizontal scaling in Kubernetes [here](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) and [here](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/).

1. `kubectl get deployments` will tell you the number of desired, current and available replicas are currently running. Similarly, `kubectl get HorizontalPodAutoscaler` will give a summary of the autoscaling policy you have defined in your yaml file.

1. `kubectl get  horizontalpodautoscaler` will show you the CPU utilization for the deployment each autoscaler is monitoring.

1. You should test deleting your deployment and monitoring CPU utilization under a certain load.

END-PANEL

