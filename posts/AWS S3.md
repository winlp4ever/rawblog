# AWS S3 101

## Overview

_S3 is an object-based, region-based storage service which make it different from most other storage services. It's one of the very first services provided by AWS_

## S3 basics

[Google Slides](https://docs.google.com/presentation/d/e/2PACX-1vQ3s_KnjhHqTZYrAcnbu6vxKeNSQsRStyJ3l7Uv0bmuCxU2NaH9tOYR1wXrfGnJqPf4or7pJhnbX496/embed?start=false&loop=false&delayms=3000)

## Further knowledge

### Encryption

There are two modes of Encryption:

* Encryption in Transit is achieved by __SSL/TLS__

* Encryption At Rest (Server Side) is achieved by:
    *  __S3 Managed Keys - SSE-S3__
    * __AWS Key Management Service, Managed Keys - SSE-KMS__
    * __Customer Provided Keys - SSE-C__

### Amazon Pricing Tiers

Pricing table can be found here:

[download Pricing-Tiers](https://aws.amazon.com/s3/pricing/)

### Amazon CloudFront

Read more about AWS CloudFront here

[download CloudFront-quickstart](https://aws.amazon.com/cloudfront/getting-started/S3/)

## Sum up

* S3 is object-based. Your data can be encrypted. S3 supports versioning as well.
* Files can be from 0 Bytes to 5TB.
* There is unlimited storage.
* Files are stored in Buckets.
* __S3 is a universal namespace__. That is, names must be unique globally.
* Not suitable to install an operating system on.
* Successful uploads will generate a __HTTP 200__ status code.