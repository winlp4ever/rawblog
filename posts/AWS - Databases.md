# AWS - Databases

## Read more on this topic

### Relational vs Non-relational databases

An insight into the differences between two types of databases along with pros and cons when using each type can be read here:

[download relational-vs-non-relational](https://www.pluralsight.com/blog/software-development/relational-non-relational-databases)

In a few words,

* Relational databases stores data in tables and rows, while non-relational databases are collections of JSON files.

* The structure of relational databases allow information to be linked between different tables using foreign key, thus makes them suitable for treating complicated queries and transactions and routine analysis of data. However, it poses problems in scalability or for expandable data structures.

* In that case, non-relational databases like MongoDB may come to the rescue. Data samples are more flexible in containing supplementary fields. Also, JSON supported data formats are simply superior than those available for relational databases. Together with the schema-less nature, non-relational databases are much friendlier for software development.

* However, scalability and flexibility come at a cost. Compared to relational databases, there's no explicit links between different tables in non-relational databases, which implies you have to join the data manually, and thus the transaction mechanisms are more error prone. 