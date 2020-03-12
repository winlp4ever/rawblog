# AWS Identity & Access Management

## Overview

_"IAM allows you to manage users and control how they can access to different services on AWS Console."_

## Objectives

After this lesson, you should be able to:

* Understand what IAM is how it functions.
* Set up your account's security.
* Manage users/groups with IAM.

## Slides

[Google Slides](https://docs.google.com/presentation/d/e/2PACX-1vSZ44q-fwq2DIeF8852-rjZrgxDFBGLXrOjEsl3YMO8HDcRmzpTcrep4304gQPdSWfsCftxlBhqJM8R/embed?start=false&loop=false&delayms=3000)

<div data-remark> <b>Supp. info:</b> For security purpose, a login session will expire in 12 hours when you sign into the AWS Management Console with your AWS or IAM account credentials. To resume your work after the session expires, we ask you to click the "Click login to continue" button and login again. The duration of federated sessions varies depending on the federation API (GetFederationToken or AssumeRole) and the administrator’s preference. (<b>AWS Documentation</b>)</div> 

## Further knowledge

### Tagging

Whenever you create a new user, you can better describe that one by adding tags: Name, Position, etc.. The benefit of tagging is even greater than that as AWS permit tagging access controls.

See it in details here:

[download Tagging-IAM-users-&-roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_tags.html)

Access Control via Tagging is done via Access Policy, for example:

```json
{
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Action": "iam:DeleteUser",
        "Resource": "*",
        "Condition": {"StringLike": {"iam:ResourceTag/status": "terminated"}}
    }]
}
```

In short, you provide tag information in the [condition element]() of a policy:

* __Resource__ - use __iam:ResourceTag/__*key-name* to specify which tag key-value pair must be attached to the resources. 

<div data-warning>Try not to mistake this with _ec2:ResourceTag_ which is used in other AWS services</div>

* __Request__ - use __iam:RequestTag/__*key-name*. Control what tags can be passed in an IAM request.

* __Principal__ - use __iam:Principal/__*key-name*. Control what the person is making the request is allowed to do.

* __Any part of the authorization process__ - Use the __aws:TagKeys__ condition key to control whether specific tag keys can be used on a resource, in a request, or by a principal. In this case, the key value does not matter.

### AWS IAM Access Analyzer

_AWS IAM Access Analyzer_ is needed to locate AWS resources you're sharing with an external entity. That way, you're able to detect any security risk.

### Create a Billing Alarm

A small helpful tutorial that teaches you how to set up a billing alarm that helps you monitor estimated AWS charges.

[download creating-a-billing-alarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html)

## Sum-up

Here are some important notes:
* __IAM is universal__: There's no regional restrictions that you can set up now for the accounts.
* __The root account__ is the very first account you create to access to AWS Console.
* __New users__ are assigned an _Access key ID_ & _Secret Key ID_ to be able to use AWS Services through AWS API and Command line (not AWS Console).

See here for __IAM best practices__:

[download IAM-best-practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

