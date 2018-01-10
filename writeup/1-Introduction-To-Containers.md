START-PANEL:"info"
## Learning Objectives
At the end of the assignment, students should be able to:

 * Build, deploy, manage, and administer Docker containers and Kubernetes clusters
 * Understand Docker and Kubernetes directives and use them to architect containerized applications
 * Create and use container registries
 * Explain how containers communicate with each other, among the Kubernetes cluster, and with the host machine
 * Compare working with Kubernetes clusters and deploying applications to multiple clouds
 * Be able to identify downstream service failures. Route traffic away from a failed cluster and be able to scale up a service in the healthy cluster using autoscaling rules.
 * Being able to describe the advantages of using the container cluster framework, realizing the importance of such tool in terms of application scalability, portability, and management.
END-PANEL

START-PANEL:"danger"
## Project Grading Penalties
[table]

[tbody]

[tr]

[th]Violation[/th]

[th]Penalty of the project grade[/th]

[/tr]

[tr]

[td]Spending more than $1 for this project on AWS[/td]

[td]-10%[/td]

[/tr]

[tr]

[td]Spending more than $2 for this project on AWS[/td]

[td]-100%[/td]

[/tr]

[tr]

[td]Failing to tag all your resources in any task (EC2 instances) for this project; `Key: Project` and `Value: 2.2`[/td]

[td]-10%[/td]

[/tr]

[tr] 
[td]Incomplete submission of required files[/td]
[td]-10%[/td] 
[/tr]

[tr]
[td]Provisioning resources in regions other than `us-east-1` in AWS[/td]
[td]-10%[/td]
[/tr]

[tr]
[td]Using instances other than t2.micro in AWS as the submitter instance[/td]
[td]-100%[/td]
[/tr]

[tr]

[td]Submitting your AWS, GCP, or Azure credentials, other secrets, or Andrew ID in your code for grading[/td]

[td]-100%[/td]

[/tr]
[tr]

[td]Submitting executables (`.jar`, `.pyc`, etc.) instead of human-readable code (`.py`,`.java`, `.sh`, etc.)[/td]

[td]-100%[/td]

[/tr]

[tr]

[td]Attempting to hack/tamper the autograder in any way[/td]

[td]-100%[/td]

[/tr]

[tr]

[td]Cheating, plagiarism or unauthorized assistance (please refer to the university policy on academic integrity and our syllabus)[/td]

[td]-200% & potential dismissal[/td]

[/tr]
[/tbody]

[/table]
END-PANEL

START-PANEL:"warning"
## Resource Tagging
For this project, assign the tags with  `Key: Project` and `Value: 2.2` for all AWS resources.
END-PANEL

# Overview
Virtualization is a core technology that has enabled the cloud computing paradigm. Virtualization is a method for the host's OS kernel to be exposed to multiple user-space instances. What we call these multiple instances depends on their degree of isolation, and the techniques used to achieve it. For example, last week, we built scalable applications using Azure, GCP and AWS virtual machines (VMs). Since the advent of cloud computing, VMs have been a popular way of deploying applications. Infrastructure as a Service (IaaS) providers directly allow application owners to provision VMs, whereas Platform as a Service (PaaS) providers and Software as a Service (SaaS) providers have historically used VMs to support their services. 

On the same host, VMs are isolated from each other and the underlying hardware using a virtual machine monitor (VMM) or hypervisor. Generally, this hypervisor provides and manages guest operating systems. Each guest VM has its own personal kernel-space. However, this method of sharing the host is quite expensive, as each VM requires significant setup, and system calls must either be emulated or run in an intermediate paravirtual layer.

![enter image description here][1]
    **Figure 1**: Multiple virtual machines sharing a host


Developers and application owners have been willing to pay the cost of a few minutes it would take to launch a virtual machine. Applications have been configured and saved as virtual machine images that are easily launched and executed. However, recently a new class of virtualization using containers has been rapidly changing the way applications are built and deployed, especially in automated, scalable systems. Popularly known as OS-level virtualization, this technique allows different “containers” to share the host kernel.

Containers are a more lightweight virtualization technology than VMs. Since all containers running on a host share the kernel they are faster to set up. Just like virtual machine images (we have looked at AMIs, VHDs and OS images), containers make it possible for dependencies to be packaged with applications. This allows the same "containerized application" to run seamlessly in any environment-- development, test, staging or production.

![enter image description here][2]
    **Figure 2**: Multiple containers running on the same host

To the average user, a container seems exactly like a VM. It runs in its own process space with its own network interface. If you SSH into a container, you will be able to work in a shell environment, which you can use to get root access to the container and allows you to install or deploy any application. A key difference is that containers share the host kernel, and all processes within containers are visible to the host. 

During this project we will learn how to build Docker images and run a number of isolated applications. We will also learn how Kubernetes can be used for deploying, scaling, and management of containerized applications. Kubernetes groups the containers that make up an application into a logical unit for easy management. Please read the primers listed below as they contain useful background information about steps to follow for setting up your Docker images and Kubernetes clusters. You can use these tasks to test the different isolation and performance properties which are discussed in the overview and in the primers. 
START-PANEL:"info"

Primers to read:

0. Introduction to Containers
1. Configuring and Deploying Containers and Kubernetes Clusters

END-PANEL

  [1]: https://s3.amazonaws.com/15619public/webcontent/15619_p22_virtual_machine_arch.png
  [2]: https://s3.amazonaws.com/15619public/webcontent/15619_p22_container_arch.png
  [3]: https://s3.amazonaws.com/privatetpzuploads/uploads/media/cgroups-pic2.png
  [4]: https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Docker-linux-interfaces.svg/650px-Docker-linux-interfaces.svg.png
  [5]: https://s3.amazonaws.com/privatetpzuploads/uploads/media/cgroups-pic1.png
