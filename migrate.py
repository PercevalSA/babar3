#!/usr/local/bin/python3

import sys
import os
import json
import random
import string

""" Quick and dirty migration script
It is not optimized at all and run quite slowly.
It deals arbitrary with errors the following way:
    - names of all kind are truncated to 25 chars
    - if no email, it is randomidied and use domain example.org
    - nicknames not unique are prepended with digits
    - epoch timestamps become all ones
    - deleted customers loose their payments
    - status is either VIP or barman, or defaults to regular
    - quantities make multiple purchases
"""


def fix_encoding(string):
    """
    Fix encoding of given string from the old DB
    """
    replacements = [
        ("&Agrave;", "À"),
        ("&agrave;", "à"),
        ("&Acirc;", "Â"),
        ("&acirc;", "â"),
        ("&Ccedil;", "Ç"),
        ("&ccedil;", "ç"),
        ("&Egrave;", "È"),
        ("&egrave;", "è"),
        ("&Eacute;", "É"),
        ("&eacute;", "é"),
        ("&Ecirc;", "Ê"),
        ("&ecirc;", "ê"),
        ("&Euml;", "Ë"),
        ("&euml;", "ë"),
        ("&Icirc;", "Î"),
        ("&icirc;", "î"),
        ("&Iuml;", "Ï"),
        ("&iuml;", "ï"),
        ("&Ocirc;", "Ô"),
        ("&ocirc;", "ô"),
        ("&OElig;", "Œ"),
        ("&oelig;", "œ"),
        ("&Ugrave;", "Ù"),
        ("&ugrave;", "ù"),
        ("&Ucirc;", "Û"),
        ("&ucirc;", "û"),
        ("&Uuml;", "Ü"),
        ("&uuml;", "ü"),
    ]
    for replacement in replacements:
        string = string.replace(replacement[0], replacement[1])
    return string


class Model:
    db = 'babar_server.'
    pk = 1

    def __init__(self):
        self.pk = self.__class__.pk
        self.__class__.pk += 1

    def encode(self):
        return {
            'model': Model.db + self.__class__.__name__.lower(),
            'pk': self.pk,
            'fields': {}
        }


class Status(Model):
    pk = 1

    def __init__(self, name, overdraft):
        super().__init__()
        self.name = name
        self.overdraft = overdraft

    def encode(self):
        data = super().encode()
        data['fields'] = {
            'name': self.name,
            'overdraft': self.overdraft
        }
        return data


class Product(Model):
    pk = 1

    def __init__(self, name, price):
        super().__init__()
        self.name = fix_encoding(name[0:25])
        self.price = price

    def encode(self):
        data = super().encode()
        data['fields'] = {
            'name': self.name,
            'price': self.price
        }
        return data


class Payment(Model):
    pk = 1

    def __init__(self, customer, amount, timestamp):
        super().__init__()
        self.customer = customer
        self.amount = amount
        if timestamp == '0000-00-00T00:00:00.000Z':
            timestamp = timestamp.replace('0', '1')
        self.timestamp = timestamp

    def encode(self):
        data = super().encode()
        data['fields'] = {
            'customer': self.customer,
            'amount': self.amount,
            'timestamp': self.timestamp
        }
        return data


class Purchase(Payment):
    pk = 1

    def __init__(self, customer, product, amount, timestamp):
        super().__init__(customer, amount, timestamp)
        self.product = product

    def encode(self):
        data = super().encode()
        data['fields']['product'] = self.product
        return data


class Customer(Model):
    pk = 1

    def __init__(self, firstname, lastname, nickname, status):
        super().__init__()
        self.firstname = fix_encoding(firstname[0:25])
        self.lastname = fix_encoding(lastname[0:25])
        self.nickname = fix_encoding(nickname[0:25])
        self.email = ''.join(random.choice(string.digits) for _ in range(10)) + '@example.org'
        self.status = status

    def encode(self):
        data = super().encode()
        data['fields'] = {
            'firstname': self.firstname,
            'lastname': self.lastname,
            'nickname': self.nickname,
            'email': self.email,
            'status': self.status
        }
        return data


if len(sys.argv) != 2 or not os.path.isfile(sys.argv[1]):
    print("Usage: ./migrate.py old.json")
if os.path.isfile('./new.json'):
    print("./new.json would get overwritten. Please remove it yourself.")
    sys.exit(1)


with open(sys.argv[1], 'r') as f:
    lines = f.readlines()

out = []

for index, line in enumerate(lines):
    if "babar_legacy." in line:
        label = line[line.find("babar"):].rstrip()
        if 'cards' in line or 'card_types' in line or 'managers' in line:
            print("Skipping " + label + ".")
        elif 'status' in line:
            print("Making up new statuses: 'Regular', 'Barman' and 'VIP'.")
            out += [Status("Regular", 0), Status("Barman", 20), Status("VIP", 80)]

        else:
            print("Parsing " + label + ".")
            # next line is empty, the one after is data
            data = json.loads(lines[index + 2])
            if 'customers' in line:
                for obj in data:
                    status = 1
                    if 'barman' in obj['status'].lower():
                        status = 2
                    if 'vip' in obj['status'].lower():
                        status = 3
                    if not obj['nickname']:
                        nickname = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))
                    else:
                        nickname = obj['nickname']
                        for out_obj in out:
                            if type(out_obj) is Customer:
                                if fix_encoding(out_obj.nickname.lower()) == fix_encoding(nickname.lower()):
                                    nickname = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))
                    o = Customer(obj['surname'], obj['name'], nickname, status)
                    o.id = obj['customer_id'] # remember old id
                    out += [o]
            elif 'drinks' in line:
                for obj in data:
                    o = Product(obj['name'], obj['price'])
                    o.id = obj['drink_id'] # remember old id
                    out += [o]

for index, line in enumerate(lines):
    if "babar_legacy." in line:
        if 'entries' in line or 'sells' in line:
            label = line[line.find("babar"):].rstrip()
            print("Parsing " + label + ".")
            # next line is empty, the one after is data
            data = json.loads(lines[index + 2])
            for obj in data:
                c_pk = None
                p_pk = None
                time = obj['date'].replace(' ', 'T') + '.000Z'
                for inst in out:
                    if type(inst) is Customer and inst.id == obj['customer_id']:
                        c_pk = inst.pk
                if c_pk is not None: # ignore payments and purchases of dead customers
                    if 'entries' in line:
                        o = Payment(c_pk, obj['amount'], time)
                        out += [o]
                    else:
                        for inst in out:
                            if type(inst) is Product and inst.id == obj['drink_id']:
                                p_pk = inst.pk
                        if p_pk is None:
                            raise Exception('This obj' + str(obj) + ' has no product')
                        for i in range(int(obj['quantity'])):
                            o = Purchase(c_pk, p_pk, obj['price'], time)
                            out += [o]


# Convert our instances to valid DB dictionaries
out = [inst.encode() for inst in out]

with open("./new.json", 'w') as f:
    json.dump(out, f, indent=4, sort_keys=True)
