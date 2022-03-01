---
layout: post
title: How to fix Postgres sequence sync issues
image: elephant.jpg
categories: ["Postgres", "Databases"]
---

<p class="intro"><span class="dropcap">E</span>very so often you may come accross an error where you get a duplicate key violation when trying to insert a new record into a table in your <a href="https://www.postgresql.org/" target="_blank">Postgres</a> database. <strong>Let's see how we can solve that easily.</strong></p>

Firstly we can create a script to interrogate some of the internal Postgres tables to automatically get us all the tables and sequences we have in our DB.

```sql
SELECT 'SELECT SETVAL(' ||
       quote_literal(quote_ident(PGT.schemaname) || '.' || quote_ident(PGC1.relname)) ||
       ', COALESCE(MAX(' ||quote_ident(PGA.attname)|| '), 1) ) FROM ' ||
       quote_ident(PGT.schemaname)|| '.'||quote_ident(PGC2.relname)|| ';'
FROM pg_class AS PGC1,
     pg_depend AS PGD,
     pg_class AS PGC2,
     pg_attribute AS PGA,
     pg_tables AS PGT
  WHERE PGC1.relkind = 'S'
  AND   PGC1.oid = PGD.objid
  AND   PGD.refobjid = PGC2.oid
  AND   PGD.refobjid = PGA.attrelid
  AND   PGD.refobjsubid = PGA.attnum
  AND   PGC2.relname = PGT.tablename
    ORDER BY PGC1.relname;
```

If you run the above script you will see that this gives us SQL as an output that we can then copy and run against our database. This will update all our sequences to the max id of the table or 1 if there is no data.

Your output will look something like the below;

```sql
SELECT SETVAL('public.company_company_id_seq', COALESCE(MAX(id), 1) ) FROM public.company_company;
SELECT SETVAL('public.company_companysize_id_seq', COALESCE(MAX(id), 1) ) FROM public.company_companysize;
SELECT SETVAL('public.company_turnover_id_seq', COALESCE(MAX(id), 1) ) FROM public.company_turnover;
SELECT SETVAL('public.contact_contact_id_seq', COALESCE(MAX(id), 1) ) FROM public.contact_contact;
SELECT SETVAL('public.contact_contacttype_id_seq', COALESCE(MAX(id), 1) ) FROM public.contact_contacttype;
```

All you need to do now is to copy the output and paste it into your query window and run the generated SQL to update your sequences.