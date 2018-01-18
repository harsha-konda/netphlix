# -*- coding: utf-8 -*-
from halo import Halo
import subprocess
import requests
import random
import sys
import json


output_file = open('.work/context', 'w')
feedback_file = open('.work/feedback', 'w')
setup={}
spinner = Halo(text='Loading', spinner='dots')


GKE_NUM_DEPLOYMENTS=3
GKE_FRONTEND='3000'
GKE_DB='9200'
GKE_BACKEND='5000'
COUNT_GKE=3
TOTAL_SCORE=20
TEST_CASES_URL="https://s3.amazonaws.com/hkonda-code/data/test_cases/test_cases.json"  #TODO: change this course public link

class TestCases:
    def __init__(self, node_url):
        self.node_url=node_url
        data=requests.get(TEST_CASES_URL).text.split("\n")
        self.test_cases=map(random.choice(data),range(10))
        self.score=self.validate()

    @staticmethod
    def get_movies(mv):
        return map(lambda movie:movie['title'],mv)


    def validate(self):
        score=0.0
        for raw_test in self.test_cases:
            test_case=json.loads(raw_test)
            r=requests.post(self.node_url+"/es/users/recommend",data=test_case['q'])
            s_movies_list=TestCases.get_movies(r.json())
            a_movies_list=TestCases.get_movies(test_case['a'])
            score+=(1.0 if s_movies_list==a_movies_list else 0.0)

        return score/len(self.test_cases)



def run_shell_command(cmd):
    cmd_list = cmd.split()
    return str(subprocess.check_output(cmd_list).decode('UTF-8'))


def get_user_input(prompt):
    print(prompt)
    return input()

def writeFeedBack(msg,Exit=False):
    feedback_file.write(msg+"\n")
    spinner.fail(msg)
    if Exit:
        output_file.write("Marks:0\n")
        sys.exit(1)

def get_contexts():
    contexts = run_shell_command('kubectl config get-contexts -o name').strip().split('\n')
    gke_context=None
    try:
        gke_context=filter(lambda x:x.startswith("gke"),contexts)[0]
        spinner.info('Using {} as the GKE context'.format(gke_context))
    except Exception as e:
        feedback = 'Exception: {} looking up contexts'.format(e)
        writeFeedBack(feedback, Exit=True)

    return gke_context


def switch_context(target):
    run_shell_command('kubectl config use-context {}'.format(target))


def list_ips():
    cmd = "kubectl get services -o json | jq -r '.items[] | [.metadata.name,.status.loadBalancer.ingress[]?.ip,.spec.ports[0].targetPort]| @csv'"
    output = subprocess.check_output(cmd, shell=True).strip().split("\n")
    ips=map(lambda x:x.replace('"',"").split(","),json.loads(output))
    parsedIps=filter(lambda d:len(d)==3,ips)
    return parsedIps

'''
Fetches the ips
checks the number of services
'''
def get_ips(gke_context):
    switch_context(gke_context)
    ips = list_ips()
    gke_front,gke_back,gke_db=[[]]*3

    if len(ips) != GKE_NUM_DEPLOYMENTS:
        msg="Found {} ip(s) , please deploy {} deployments".format(len(ips),GKE_NUM_DEPLOYMENTS)
        writeFeedBack(msg,Exit=True)

    try:
        gke_front = filter(lambda x:x[2]==GKE_FRONTEND,ips)[0][1]
        spinner.info('Using {} as the GKE frontend IP address'.format(gke_front))

        gke_back = filter(lambda x:x[2]==GKE_BACKEND,ips)[0][1]
        spinner.info('Using {} as the GKE backend IP address'.format(gke_back))

        gke_db = filter(lambda x:x[2]==GKE_DB,ips)[0][1]
        spinner.info('Using {} as the GKE elastic-search IP address'.format(gke_db))

    except IndexError:
        feedback = 'Exception:looking up IP address in GKE context'
        writeFeedBack(feedback,Exit=True)

    return {'gke_front': gke_front, 'gke_back': gke_back, 'gke_db': gke_db}

def count_deployment(context, name, expected):
    switch_context(context)

    output = run_shell_command('kubectl get deployments -o name').strip().split('\n')
    actual = len(output)

    if actual != expected:
        feedback = 'Expected {} deployment(s) in {}, got {}'.format(expected, name, actual)
        feedback_file.write('{}\n'.format(feedback))
        print(feedback)
    return actual

def check_deployments(gke_context):
    count = 0
    count += count_deployment(gke_context, 'GKE', expected_gke)
    return 1.0 if COUNT_GKE==count else 0.0


def compute_score():

    spinner.start("checking for gke context")
    gke_context = get_contexts()
    spinner.succeed("found gke context!")

    score=0.0

    spinner.start("counting the number of deployments")
    score+=(0.1*TOTAL_SCORE*check_deployments(gke_context))
    spinner.succeed("done counting deplyments!")

    spinner.start("counting the number of services")
    ips = get_ips( gke_context)
    score+=(1.0 if COUNT_GKE == len(ips.keys()) else 0.0)*0.1*TOTAL_SCORE
    spinner.succeed("done counting services")

    spinner.start("testing for correctness")
    score+=TestCases(ips['gke_front']).score*0.8*TOTAL_SCORE
    spinner.succeed("done grading")


if __name__ == "__main__":
    print("--------------------------------------------------------------------------------")
    print("--------------------------------- Task 2! --------------------------------------")
    print("--------------------------------------------------------------------------------")
    compute_score()	

    output_file.write(json.dumps(setup))