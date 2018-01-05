#!/bin/bash

configuration() {
    ags_dns="autograding.theproject.zone"
    signature="1K9SaGliHwthRgeOi12hUdCUwAPmN"
    semester="s18"
    courseId="15619"
    projectId="containers"
    taskId="container-and-pod"
    language="java"
    tpz_key="task2"
    codeId="code"
    feedbackId="feedback"
    useContainer="true"
    taskLimit=0
    update="false"
    pending="false"
    duration=120
}

load_dns_info() {
    awsId="$(/usr/bin/curl -s http://169.254.169.254/latest/dynamic/instance-identity/document  | /bin/grep accountId | /usr/bin/cut -d'"' -f4)"
    amiId="$(/usr/bin/ec2metadata --ami-id)"
    instanceId="$(/usr/bin/ec2metadata --instance-id)"
    instanceType="$(/usr/bin/ec2metadata --instance-type)"
    publicHostname="$(/usr/bin/ec2metadata --public-hostname)"
    studentDNS="$publicHostname"
}

get_andrew_id() {
    echo `curl -s "https://theproject.zone/api/reverse_match/?attribute=aws-id&value=$awsId" | awk -F '"' '{print $6}' | awk -F "@" '{print $1}'`
}

get_submission_password() {
    read -r password
    echo $password
}

grade() {
    mkdir .work

    python task2_submitter.py

}

submit_to_tpz() {
    echo "Uploading answers, files larger than 5M will be ignored..."
    # exclude jars in lib folder
    find . -not -path "./lib/*" -size -5M -type f | tar -cvzf "$andrewId".tar.gz -T - &> /dev/null
    postUrl="https://$ags_dns/ags/submission/submit?signature=$signature&andrewId=$andrewId&password=$password&dns=$studentDNS&semester=$semester&courseId=$courseId&projectId=$projectId&taskId=$taskId&lan=$language&tpzKey=$tpz_key&feedbackId=$feedbackId&codeId=$codeId&useContainer=$useContainer&taskLimit=$taskLimit&update=$update&pending=$pending&duration=$duration&checkResult=$checkResult"
    submitFile="$andrewId.tar.gz"

    if ! curl -s -F file=@"$submitFile" "$postUrl"
        then
        echo "Submission failed, please check your password or try again later."
        exit
    else
        # the code can also reaches here with submission failure due to a existing pending submission
        echo "If your submission is uploaded successfully. Log in to theproject.zone and open the submissions table to see how you did!"
    fi
}

cleanup_local() {
    rm -rf "$andrewId".tar.gz
    rm -rf .work/ 2>/dev/null
}

# Sets up variables for this specific task
configuration

# Load various DNS / AWS properties
load_dns_info

while getopts ":ha:" opt; do
    case $opt in
        h)
            echo "This program is used to submit and grade your solutions." >&2
            echo "Usage: ./submitter"
            exit
            ;;
        \?)
            echo "Invalid option: -$OPTARG" >&2
            exit 1
            ;;
    esac
done

if [ "$(ec2metadata  --instance-type)" = "t2.micro" ];
then
    echo "t2.micro instance validated"
else
    echo "Please launch a t2.micro instance only for this project"
    exit
fi

# Get corresponding andrew ID from our database
andrewId=`get_andrew_id`

# Prompt for TPZ submission password
echo "Enter your submission password from TheProject.zone."
password=`get_submission_password`
echo $password

# check if kubectl binary exists in one of the $PATH
KUBECTL_PATH=`which kubectl`
if [ -z $KUBECTL_PATH ]; 
then
    echo "Please copy the kubectl binary to one of the paths - $PATH"
    exit 2
fi

echo "####################"
echo "# INTEGRITY PLEDGE #"
echo "####################"
echo "Have you cited all the reference sources (both people and websites) in the file named 'references'? (Type \"I AGREE\" to continue). By typing \"I AGREE\", you agree that you have not cheated in any way when completing this project. Cheating can lead to severe consequences."
read -r references

if [ "$(echo "$references" | awk '{print tolower($0)}')" == "i agree" ]
then
    grade 2>/dev/null

    submit_to_tpz

    cleanup_local 2>/dev/null
else
    echo "Please cite all the detailed references in the file 'references' and submit again. Type \"I AGREE\" when you submit next time."
    exit
fi




