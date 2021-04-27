from fpdf import FPDF
import json
import requests
import boto3
from botocore.exceptions import ClientError
import datetime

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

	filename = name  # In same directory as script

	with open(filename, "rb") as attachment:
		part = MIMEApplication(attachment.read())
		part.add_header("Content-Disposition",
						"attachment",
						filename=filename)
	msg.attach(part)

	# Convert message to string and send
	ses_client = boto3.client("ses", region_name="us-east-1")
	response = ses_client.send_raw_email(
		Source="admin@solarcentral.awsapps.com",
		Destinations=[email],
		RawMessage={"Data": msg.as_string()}
	)
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
        JSONtoPDF(data)
        send_email_with_attachment(user_id_data['user_id'], vendor_id + "_" + user_id_data['user_id'] + ".pdf")

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
		self.image('./solar.jpeg', 10, 8, 33)
		# Arial bold 15
		self.set_font('Arial', 'B', 15)
		# Move to the right
		self.cell(80)
		# Title
		self.cell(30, 10, 'Solar Coorporation', 1, 0, 'C')
		# Line break
		self.ln(20)
		print("hello i am called")

	# Page footer
	def footer(self):
		# Position at 1.5 cm from bottom
		self.set_y(-15)
		# Arial italic 8
		self.set_font('Arial', 'I', 8)
		# Page number
		self.cell(0, 10, 'Page ' + str(self.page_no()) + '/{nb}', 0, 0, 'C')


def error_exit(message):
	sys.stderr.write(message)
	sys.exit(1)

def JSONtoPDF(json_data):
		# Get the data values from the JSON string json_data.
	try:
		#data = json.loads(json_data)
		pdf = FPDF()
		pdf.alias_nb_pages()
		pdf.add_page()
		pdf.set_font("Arial", size = 15)
		pdf.cell(200, 10, txt = "Solar Panels Hub", 
			 ln = 5, align = 'C')
		pdf.cell(200, 20, txt = "Quotation for Solar Panel Installation",
			 ln = 6, align = 'C')
		for i, (key,val) in enumerate(json_data.items()):
			pdf.cell(100, 15, txt = key +" : "+ val,
			 	ln = i+10, align = 'L')
		
		# save the pdf with name .pdf
		pdf.output(json_data['vendor_id']+"_"+json_data['user_id']+".pdf")

	except Exception as e:
		error_exit("Error generating file: {}".format(e.message))

    
def testJSONtoPDF():
	f = open('data.json')	 
	data = json.load(f)
	#print(data)
	JSONtoPDF(data)

