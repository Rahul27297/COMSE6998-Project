import boto3
from botocore.exceptions import ClientError
import requests
import json
import datetime

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

def upload_yelp_data_db(cuisine):
    global counter
    API_KEY = "RTHPMpPmtr6UyHPH3xISqcWXLihrL1bIK21cuozgWN9oHHFzrcidi6DQCPfY48A99vWBuqptjc09HjUEdR71kAfpizylEt98QkAKYdPq5XTSu3v9zF0f2uR8NZ0YYHYx"
    API_HOST = 'https://api.yelp.com'
    SEARCH_PATH = '/v3/business/search'
    BUSINESS_PATH = '/v3/businesses/'

    TERM = str(cuisine)
    LOCATION = 'manhattan'
    LIMIT = 50

    for x in [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500]:
        OFFSET = str(x)

        url = 'https://api.yelp.com/v3/businesses/search?term='+TERM+'&location='+LOCATION + '&offset='+OFFSET+ '&limit='+str(LIMIT)
        #print(url)

        headers = {
            'Authorization': 'Bearer '+ API_KEY
        }

        response = requests.request('GET', url, headers = headers, params = {})
        contents = response.json()['businesses']
        #print(contents[0])

        data_list = []
        
        for x in contents:
            # append to DB
            data = {
                'bussinessID': str(x['id']),
                'restoName': x['name'],
                'location' : x['location']['address1'],
                'coordinates': json.dumps(x['coordinates']),
                'review' : str(x['review_count']),
                'rating' : str(x['rating']),
                'zipCode' : x['location']['zip_code'],
                'timeStamp': str(datetime.datetime.now()),
                'cuisine': TERM
            }
            data_list.append(data)

            # append to the JSON file
            counter += 1
            data_index = {}
            data_body = {}
            data_index = {"index": {"_index":"restaurants", "_id":counter}}
            data_body = {"businessID": str(x['id']), "cuisine": str(TERM)}
            with open('sample2.json', 'a+') as outfile:
                json.dump(data_index, outfile)
                outfile.write('\n')
                json.dump(data_body, outfile)
                outfile.write('\n')
        insert_data(data_list)


'''UPLOADING DATA TO DB'''
counter = 4432
cuisines = ["chinese", "japanese", "american", "mexican", "italian", "french", "thailand", "korea", "indonesian", "indian", "mediterranean", "spanish","vietnam", "german", "greek"]

for cuisine in cuisines:
    upload_yelp_data_db(cuisine)
