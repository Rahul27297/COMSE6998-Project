import boto3
from botocore.exceptions import ClientError
import requests
import json
import datetime

# dynamo db functions
def lookup_data(key, db=None, table='components-db'):
    if not db:
        db = boto3.resource('dynamodb')
    table = db.Table(table)
    try:
        response = table.get_item(Key=key)
    except ClientError as e:
        print('Error', e.response['Error']['Message'])
    else:
        print(response['Item'])
        return response['Item']

def insert_data(data_list, db=None, table='components-db'):
    if not db:
        db = boto3.resource('dynamodb')
    table = db.Table(table) 
    # overwrite if the same index is provided
    for data in data_list:
        response = table.put_item(Item=data)
    #print('@insert_data: response', response)
    return response 
    
    
def update_item(key, feature, db=None, table='components-db'):
    if not db:
        db = boto3.resource('dynamodb')
    table = db.Table(table)
    # change student name
    response = table.update_item(
        Key=key, 
        UpdateExpression="set #feature=:f",
        ExpressionAttributeValues={
            ':f': feature
        },  
        ExpressionAttributeNames={
            "#feature": "name"
        },
        ReturnValues="UPDATED_NEW"
    )
    print(response)
    return response
    
def delete_item(key, db=None, table='components-db'):
    if not db:
        db = boto3.resource('dynamodb')
    table = db.Table(table)
    try:
        response = table.delete_item(Key=key)
    except ClientError as e:
        print('Error', e.response['Error']['Message'])
    else:
        print(response)
        return response

# add id to the raw data
def add_id_to_data():
    # Read JSON file
    with open('backup.json') as data_file:
        i = 1
        for line in data_file:
            data_loaded = json.loads(line)
            data_loaded['id'] = str(i)
            with open('components.json', 'a+') as json_file:
                json.dump(data_loaded, json_file)
                json_file.write("\n")
            i += 1
            #print(data_loaded)
            #print(data_loaded['power'])
            #print(type(data_loaded))

# create the json file for elastic search domain
def create_domain_json():
    with open('components.json', 'r') as data:
        for line in data:
            data_loaded = json.loads(line)

            data_index = {"index": {"_index":"components", "_id":str(data_loaded['id'])}}
            data_body = {"id": str(data_loaded['id']), "type": str(data_loaded['type']), "brand": str(data_loaded['brand']), "power": str(data_loaded['power'])}
            with open('es_domain.json', 'a+') as outfile:
                json.dump(data_index, outfile)
                outfile.write('\n')
                json.dump(data_body, outfile)
                outfile.write('\n')

# add data to dynamodb components-db
def add_to_db():
    data_list = []
    with open('components.json', 'r') as data:
        for line in data:
            data_loaded = json.loads(line)
            data_list.append(data_loaded)
    #print(data_list)
    insert_data(data_list)


#data = [{'id':'1', 'text':'hello'}]
#insert_data(data)



#create_domain_json()
#add_id_to_data()
add_to_db()