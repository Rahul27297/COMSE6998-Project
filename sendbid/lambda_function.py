from fpdf import FPDF
import json
import requests
import boto3
from botocore.exceptions import ClientError
import datetime
import os

from email import encoders
from email.mime.base import MIMEBase
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def send_email_with_attachment(email, name):
	msg = MIMEMultipart()
	msg["Subject"] = "You have new bids for you request at Solar Central"
	msg["From"] = "admin@solarcentral.awsapps.com"
	msg["To"] = email

	# Set message body
	body = MIMEText(
		"Hello, \nYou have a new bid for your request placed at Solar Central. \nPlease find the bid submitted by the vendor as an attachment to this email.",
		"plain")
	msg.attach(body)
	print(msg)
	filename = "/tmp/" + name  # In same directory as script
	print(filename)

	part = MIMEApplication(open(filename, 'r', encoding = "ISO-8859-1").read())
	print(part)
	print("part printed")
	part.add_header('Content-Disposition', 'attachment', filename=name)
	msg.attach(part)
	print(msg)
	"""
	
	part = MIMEApplication(open(filename, encoding = "ISO-8859-1").read())
	part.add_header('Content-Disposition','attachment; filename="%s"' % os.path.basename(filename))
	msg.attach(part)
	print(msg)
	"""
	# Convert message to string and send
	ses_client = boto3.client("ses", region_name="us-east-1")
	response = ses_client.send_raw_email(
		Source="admin@solarcentral.awsapps.com",
		Destinations=[email],
		RawMessage={"Data": msg.as_string()}
	)
	print("SES response")
	print(response)


def lambda_handler(event, context):

    #print(event['user_id_lists'])
    user_id_lists = event['user_id_lists']
    vendor_id = event['vendor_id']
    vendor_company_name = event['vendor_company_name']
    vendor_address = event['vendor_address']

    # bid lists
    bids = []

    for x in user_id_lists:
        user_id_data = lookup_data({'user_id':x})
        print(user_id_data)
        data = {}
        data['vendor_id'] = vendor_id
        data['company_name'] = vendor_company_name
        data['user_id'] = user_id_data['user_id']
        data['date'] = str(datetime.datetime.now()).split(" ")[0]
        data['price'] = user_id_data['economics']['system_cost']
        data['address'] = vendor_address
        bids.append(data)
        user_id_data['vendor_id'] = vendor_id
        print(user_id_data)
        JSONtoPDF(user_id_data)
        send_email_with_attachment(user_id_data['user_id'], 
        user_id_data['profile']['first_name']+ "_"+ 
        user_id_data['profile']['last_name'] +'_Solar_Quotation' +".pdf")#vendor_id + "_" + user_id_data['user_id'] + ".pdf")

    # insert to the database
    insert_data(bids)
    return {
		'statusCode': 200,
		'body': json.dumps('Hello from Lambda!')
	}


def lookup_data(key, db=None, table='quotations-requests-db'):
	if not db:
		db = boto3.resource('dynamodb')
	table = db.Table(table)
	try:
		response = table.get_item(Key=key)
	except ClientError as e:
		print('Error', e.response['Error']['Message'])
	else:
		# print(response['Item'])
		return response['Item']


def insert_data(data_list, db=None, table='bids-db'):
	if not db:
		db = boto3.resource('dynamodb')
	table = db.Table(table)
	# overwrite if the same index is provided
	for data in data_list:
		response = table.put_item(Item=data)
	# print('@insert_data: response', response)
	return response



class PDF(FPDF):
	def header(self):
		# Logo
		# self.image('./solar.jpeg', 10, 8, 33)
		# Arial bold 15
		self.set_font('Arial', 'B', 15)
		# Move to the right
		self.cell(80)
		# Title
		self.cell(30, 10, 'Solar Central', 1, 0, 'C')
		# Line break
		self.ln(20)

	# Page footer
	def footer(self):
		# Position at 1.5 cm from bottom
		self.set_y(-15)
		# Arial italic 8
		self.set_font('Arial', 'I', 8)
		# Page number
		self.cell(0, 10, 'Page ' + str(self.page_no()) + '/{nb}', 0, 0, 'C')



def JSONtoPDF(json_data):
	# Get the data values from the JSON string json_data.
	#try:
	#data = json.loads(json_data)
	pdf = FPDF()
	pdf.alias_nb_pages()
	pdf.add_page()
	pdf.set_font("Arial", size = 15)
	pdf.cell(200, 10, txt = "Solar Central", ln = 1, align = 'C')
	pdf.cell(220, 20, txt = "Quotation for Solar Panel Installation", ln = 1, align = 'C')
	data_dict = {}
	for key, val in json_data.items():
		if isinstance(val, dict):
			for k, v in val.items():
				data_dict[k]=v
		else:
			data_dict[key] = val
	for key, val in data_dict.items():
		pdf.cell(150, 15, txt = ((str(key)).upper()).replace('_',' ') +" : "+ str(val), ln = 1, align = 'L')
	
	
	# save the pdf with name .pdf
	#print("/tmp/" + json_data['vendor_id']+"_"+json_data['user_id']+".pdf")
	pdf.output("/tmp/" + data_dict['first_name']+ "_"+ data_dict['last_name'] +'_Solar_Quotation' +".pdf", 'F')
	
	
