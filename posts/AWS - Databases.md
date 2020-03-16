# AWS - Databases

## Slides

[Google Slides](https://docs.google.com/presentation/d/e/2PACX-1vQtj-ZdR4A4Ww3it-S7vskL8tP4qJ4z_YfcYQxTnIknEf4xZDFxxHxOEMqikd31mBFp4gL_Ytg5t5ph/embed?start=false&loop=false&delayms=3000)

## Database services of AWS

Hot topics that often appear in exams: RDS - DynamoDB - ElastiCache - Amazon Redshift

### To remember

* RDS runs on virtual machines (you cannot ssh to your rds instances)
* You cannot log in to these operating systems however
* Patching of the RDS Operating System and DB is Amazon's responsibility
* RDS is not serverless
* except Aurora serverless

__What is serverless?__
Serverless is the native architecture of the cloud that enables you to shift more of your operational responsibilities to AWS, increasing your agility and innovation. Serverless allows you to build and run applications and services without thinking about servers. It eliminates infrastructure management tasks such as server or cluster provisioning, patching, operating system maintenance, and capacity provisioning. You can build them for nearly any type of application or backend service, and everything required to run and scale your application with high availability is handled for you.

### Back-ups

* Automated Backups
* Manual Snapshots

__Automated Backups__ are enabled by default. the bakup data is stored in S3 and you get free storage space equal to the size of the database.

__DB Snapshots__ are done manually (ie the are user initiated.) They are stored even after you delete the original RDS instance, unlike automated backups.

__Attention!:__ Whenever you restore either an Automatic Backup or a manual Snapshot, the restored version of the database will be a new RDS instance with a new DNS endpoint.

__Encryption At Rest:__ Encryption at rest is supported for MySQL, Oracle, SQL Server, PostgreSQL, MariaDB & Aurora. Encryption is done using the AWS KMS service. Once your RDS instance is encrypted, the data stored at rest in the underlying storage is encrypted, as are its automated backups, read replicas, and snapshots.

__Multi-AZ:__ Your db is replicated across different AZs. Every written operations will be auto synchronized to the stand by db. In the event of an AZ failure, RDS will auto failover to the standby so that db operations can resume quickly without administrative intervention. Available for:
* SQL Server
* Oracle
* MySQL Server
* PostgreSQL
* MariaDB

__Multi-AZ__ is for Disaster Recovery, while __Read Replicas__ is for Performance Improvement.

__Read Replicas:__ Db is replicated and asynchronously updated between different AZs so that different EC2s may link to different Dbs to allow a better performance. (Attention - only your primary database can be written into, other (replica) dbs are read-only (why the name _Read Replica_), so actually this is only useful for read-heavy databases.) Things to know:
* Each read replica will have its own DNS end point.
* You can have read replicas that have multi-AZ.
* You can create read replicas of Multi-AZ source databases.
* Read replicas can be promoted to be their own databases. This breaks the replication.
* You can have a read replica in a second region.

## Lab

_ Create a database.

_ Access the database via command: `psql --username admin --password --hostname <db-dns-endpoint> --port=<db-port>`.

_ Play with the database.

## Read more on this topic

### Relational vs Non-relational databases

An insight into the differences between two types of databases along with pros and cons when using each type can be read here:

[download relational-vs-non-relational](https://www.pluralsight.com/blog/software-development/relational-non-relational-databases)

In a few words,

* Relational databases stores data in tables and rows, while non-relational databases are collections of JSON files.

* The structure of relational databases allow information to be linked between different tables using foreign key, thus makes them suitable for treating complicated queries and transactions and routine analysis of data. However, it poses problems in scalability or for expandable data structures.

* In that case, non-relational databases like MongoDB may come to the rescue. Data samples are more flexible in containing supplementary fields. Also, JSON supported data formats are simply superior than those available for relational databases. Together with the schema-less nature, non-relational databases are much friendlier for software development.

* However, scalability and flexibility come at a cost. Compared to relational databases, there's no explicit links between different tables in non-relational databases, which implies you have to join the data manually, and thus the transaction mechanisms are more error prone. 

