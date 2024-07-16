---
title: "Snippets, Samples, and Gists"
date: 2024-07-16T15:33:59Z
image: /images/posts/post-1.jpg
categories:
  - Code 
post_id: BD4B29A2-EFE0-40FF-B151-5D1AD2A3CC0E
draft: false
---

This article is more of a knowledge base for various code snippets, samples and gists! Take any of the below at your own risk!
## PostgreSQL
<details>
  <summary>CLICK ME TO EXPAND POSTGRESQL</summary>

### Generated Value as Key


```sql
CREATE OR REPLACE FUNCTION public.generate_key(_len int)  
    returns varchar(50)  
as  
$$  
SELECT substr(md5(random()::text), 0, (_len + 1))::varchar;  
$$  
    language sql  
    immutable;

CREATE TABLE IF NOT EXISTS tableName(
    generatedKey varchar(8) NOT NULL GENERATED ALWAYS AS (public.generate_key(8)) STORED
);

```


### Make pseudo id column
When joining things that are pre-sorted, in order to join together, needs a pseudo ID field. Use ROW_NUMBER()

```sql
WITH docIds as (SELECT id from documents d order by id desc limit 15),  
     docIdsWithCount as (SELECT row_number() over (order by id) as rowNum, id from docIds),  
     refIds as (SELECT id from references r order by id desc limit 15),  
     refIdsWithCount as (SELECT row_number() over (order by id) as rowNum, id from refIds),  
SELECT r.id as refId, d.id as docId from docIdsWithCount d  
        left join refIdsWithCount r on d.rowNum = r.rowNum
```


### Delete all data from all tables
USE WITH CAUTION!
```sql
DO  
$$  
DECLARE  
    rec RECORD;  
BEGIN  
    -- Generate the truncate statements for all tables in the specified schema  
    FOR rec IN  
        SELECT tablename  
        FROM pg_tables  
        WHERE schemaname = 'edi_transactions'  
    LOOP  
        EXECUTE 'TRUNCATE TABLE edi_transactions.' || quote_ident(rec.tablename) || ' CASCADE;';  
    END LOOP;
END  
$$;
```

### jsonb_typeof
Detect type of json structure in parameter - perform looping if array, etc.
```sql
if jsonb_typeof(_schemaarray) = 'array' THEN   
  -- DO THINGS HERE
END IF;
```

</details>


## jq
<details>

<summary>CLICK ME TO EXPAND JQ</summary>

Check out [jqCheatSheet](https://lzone.de/cheat-sheet/jq) for fast help!

### Use args in jq filter
```bash
jq --arg v "$PRJNAME" '.dev.projects[$v]' config.json 

```

### JSON.parse, but in jq
read property that contains a string as json
```bash
cat response.text | jq ' . | fromjson.title'
```

### Minify JSON
Minify the string
```
echo '{ "foo": "bar" }' | jq -r tostring
```


Minify a file

```
jq -r tostring file.json
```

### Merge Objects
Take two json objects stored in bash variable and merge them together based on key
```bash
jq -n --argjson a "$a" --argjson b "$b" '$a + $b'
```

### Recursive Merge 
[Recursive JSON Object Merge with jq](https://stackoverflow.com/questions/19529688/how-to-merge-2-json-objects-from-2-files-using-jq)
```bash
# note: jq 1.4 or later
jq -s '.[0] * .[1]' file1 file2
```

### Array of Objects to CSV
```
cat json-filename.json | jq -r '(map(keys) | add | unique) as $cols | map(. as $row | $cols | map($row[.])) as $rows | $cols, $rows[] | @csv'
```

### CSV file to JSON
Requires manual setting of column names, but could automate that using GPT pipeline or other script.
```
jq --slurp --raw-input --raw-output \
  'split("\n") | .[1:] | map(split(",")) |
      map({"status": .[0],
           "date": .[1],
           "description": .[2],
           "debit": .[3],
           "credit": .[4],
           "member": .[5]})' \
  Since\ Nov\ 15,\ 2023.CSV
```

</details>
