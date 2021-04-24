from requests_html import HTMLSession
from bs4 import BeautifulSoup
import time
import json

def get_data(url):
    r = s.get(url)
    soup = BeautifulSoup(r.text, 'html.parser')
    return soup

def get_data_on_page(soup):
    page = soup.find('ul', {'class':'list-unstyled enf-pd-list-main-ul clearfix'})
    section = page.find_all('li', {'class':'enf-pd-list-main-li'})
    return section

def get_next_page_url(soup):
    page = soup.find('ul', {'class':'pagination enf-pagination'})

def get_page_data_panel(section):
    for i in range(len(section)):
        try:
            # Get Brand Name
            brand_raw = section[i].find('div', {'class':'enf-blue'}).get_text()[2:]
            end = brand_raw.find("\n")
            brand_raw = brand_raw[:end]
            brand = ' '.join(brand_raw.split())
            print(brand)

            # Get Efficiency and Power Rating
            table = section[i].find('table', {'class':'enf-pd-list-table'})
            row = table.find_all('td', {'enf-blue'})

            eff_raw = (row[0].get_text().split())
            eff = eff_raw[-2] + " " + eff_raw[-1]
            print(eff)

            power_raw = (row[1].get_text().split())
            power_cap = int(power_raw[-2])
            print(power_cap)
            power = power_raw[-2] + " " + power_raw[-1]

            # Get Price
            price_raw = section[i].find('div', {'class':'enf-pd-list-price-area'}).find('span', {'class':'enf-yellow'}).find('b').get_text()
            price = float(price_raw[1:]) * power_cap
            print(price_raw)
            print(round(price,2))
            price = str(round(price,2))
            
            # compile data entry
            data = {
                'type': 'Solar Panel',
                'brand': brand,
                'efficiency': eff,
                'power': power,
                'price': price
            }
            # compile data entry
            with open('panel_data.json', 'a+', encoding='utf8') as json_file:
                json.dump(data, json_file)
                json_file.write("\n")
        except:
            # don't compile that data
            pass

def get_page_data_inverter(section):
    for i in range(len(section)):
        try:
            # Get Brand Name
            brand_raw = section[i].find('div', {'class':'enf-blue'}).get_text()[2:]
            end = brand_raw.find("\n")
            brand_raw = brand_raw[:end]
            brand = ' '.join(brand_raw.split())
            print(brand)

            # Get Efficiency and Power Rating
            table = section[i].find('table', {'class':'enf-pd-list-table'})
            row = table.find_all('td', {'enf-blue'})

            warranty_raw = (row[0].get_text().split())
            warranty = warranty_raw[-2] + " " + warranty_raw[-1]
            print(warranty)

            power_raw = (row[1].get_text().split())
            power_cap = int(power_raw[-2])
            power = power_raw[-2] + " " + power_raw[-1]
            print(power)

            # Get Price
            price = section[i].find('div', {'class':'enf-pd-list-price-area'}).find_all('span', {'class':'enf-yellow'})[1].find('b').get_text()
            print(price)

            # compile data entry
            data = {
                'type': 'Inverter',
                'brand': brand,
                'warranty': warranty,
                'power': power,
                'price': price
            }
            with open('inverter_data.json', 'a+', encoding='utf8') as json_file:
                json.dump(data, json_file)
                json_file.write("\n")
        except:
            # don't compile that data
            pass

def get_page_data_battery(section):
    for i in range(len(section)):
        try:
            # Get Brand Name
            brand_raw = section[i].find('div', {'class':'enf-blue'}).get_text()[2:]
            end = brand_raw.find("\n")
            brand_raw = brand_raw[:end]
            brand = ' '.join(brand_raw.split())
            print(brand)

            # Get Warranty and Power Rating
            table = section[i].find('table', {'class':'enf-pd-list-table'})
            row = table.find_all('td', {'enf-blue'})

            warranty_raw = (row[4].get_text().split())
            warranty = warranty_raw[-2] + " " + warranty_raw[-1]
            print(warranty)

            capacity_raw = (row[2].get_text().split())
            capacity_raw = int(capacity_raw[-2])
            capacity = capacity_raw[-2] + " " + capacity_raw[-1]
            print(capacity)

            # Get Price
            price = section[i].find('div', {'class':'enf-pd-list-price-area'}).find_all('span', {'class':'enf-yellow'})[1].find('b').get_text()
            print(price)

            # compile data entry
            data = {
                'type': 'Battery',
                'brand': brand,
                'warranty': warranty,
                'capacity': capacity,
                'price': price
            }
            with open('battery_data.json', 'a+', encoding='utf8') as json_file:
                json.dump(data, json_file)
                json_file.write("\n")
        except:
            # don't compile that data
            pass



s = HTMLSession()
#url = "https://www.enfsolar.com/pv/panel"
url = "https://www.enfsolar.com/pv/inverter"
#url = "https://www.enfsolar.com/pv/storage-system"

soup = get_data(url)
section = get_data_on_page(soup)
#get_page_data_panel(section)
get_page_data_inverter(section)


s = HTMLSession()
i = 111
while i < 168:
    print("\npage" + str(i))
    url = "https://www.enfsolar.com/pv/inverter/"+str(i)
    soup = get_data(url)
    section = get_data_on_page(soup)
    get_page_data_inverter(section)
    i += 1
    time.sleep(10)
