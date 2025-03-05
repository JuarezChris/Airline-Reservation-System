from flask_app.config.mysqlconnection import connectToMySQL
from flask import flash
import re
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
#might need other imports like flash other classes and regex

db = 'airline_db'

class User:
    def __init__(self, data):
        #follow database table fields plus any other attribute you want to create
        self.id = data['id']
        self.fname = data['first_name']
        self.lname = data['last_name']
        self.email = data['email']
        self.password = data['password']
        self.flight_tickets = []


    @classmethod
    def get_all_user(cls):
        query = "SELECT * FROM users;"
        db_response = connectToMySQL(db).query_db(query)
        users = []
        for user in db_response:
            new_user = cls(user)
            users.append(new_user)
        return users
    
    @classmethod
    def create_user(cls, form_data):
        print("Here at create user")
        user_data = form_data["user"]
        print("%%%%%%%%%%%%%")
        query = "INSERT INTO users (fname, lname, email, password) VALUES (%(fname)s, %(lname)s, %(email)s, %(password)s);"
        db_response = connectToMySQL(db).query_db(query, user_data)
        print(db_response)
        return db_response
    
    @classmethod
    def update(cls, form_data):
        query = "UPDATE users SET first_name = %(first_name)s, last_name = %(last_name)s, email = %(email)s WHERE id = %(id)s;"
        db_response = connectToMySQL(db).query_db(query, form_data)
        print(db_response)
        return db_response
    

    @staticmethod
    def validate_user(form_data):
        is_valid = True 
        if len(form_data['first_name']) < 1:
            flash('First name must be more than 1 character!!!')
            is_valid = False
        if not EMAIL_REGEX.match(form_data['email']):
            flash('Invalid email/password!')
            is_valid = False
        if form_data['password'] != form_data['confirm_pw']:
            flash('Invalid email/password!')
            is_valid = False
        return is_valid
    
    @classmethod
    def find_user(cls,email_dict):
        query = "SELECT * from users WHERE email = %(email)s"
        db_response = connectToMySQL(db).query_db(query, email_dict)
        print(db_response)
        if len(db_response) < 1:
            return False
        return cls(db_response[0])
