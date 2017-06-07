from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.db import connection
from myapp.csrfexemptview import CSRFExemptView

import json
from mysql.connector import Error
# Create your views here.

@csrf_exempt
def search(request):
    if request.method == 'POST':
        name = (request.body)
        print name
        #name = search_json['name']
        try:
            cursor = connection.cursor()
            cursor.callproc('search_sp',[name])
            details = cursor.fetchall()
            search_lst = []
            for detail in details:
                # print detail
                search_details = {}
                search_details['fullname'] = detail[0] + ' ' + detail[1]
                search_details['emailId'] = detail[2]
                search_details['displayPic'] = detail[3]
                search_details['recentInfo'] = detail[5]
                search_details['title'] = detail[6]
                search_lst.append(search_details)
            # print search_lst
        except Error as e:
            print e
        finally:
            cursor.close()

        context = {
                    "search_details":search_lst
        }
        return HttpResponse(json.dumps(context))

''' To search with firstname, lastname, university, company name and company position'''
class advance_search(CSRFExemptView):
    def post(self,request):
        info = json.loads(request.body)
        print "Advanced Search Info is: ", info
        to_user = request.session['username']
        try:
            cursor = connection.cursor()
            cursor.callproc('advance_search_sp',[info['fullname'],info['university'],info['company'],info['position']])
            details = cursor.fetchall()
        except Error as e:
            print e
        finally:
            cursor.close()

        search_lst = []
        for detail in details:
            # print detail
            search_details = {}
            search_details['fullname'] = detail[0] + ' ' + detail[1]
            search_details['emailId'] = detail[2]
            search_details['displayPic'] = detail[3]
            search_details['currentPosition'] = detail[5]
            search_details['currentCompany'] = detail[6]
            search_details['joined'] = str(detail[7])
            search_details['university'] = detail[8]
            #search_details['friendshipStatus'] = "Add Friend"

            try:
                cursor = connection.cursor()
                cursor.callproc('get_overviewByUsername_sp',[detail[2],to_user])
                user_info = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()

            for element in user_info:
                try:
                    search_details['friendshipStatus'] = element[4]
                except:
                    search_details['friendshipStatus'] = "Add Friend"
            search_lst.append(search_details)
        print search_lst

        context = {
                    "search_details":search_lst
        }
        # print search_lst
        return HttpResponse(json.dumps(context))

''' To get simple overview(First Name, Last Name, User Profile Image) while selecting user from search'''
class overview(CSRFExemptView):
    def get(self,request):
        username = request.GET.get('emailId')
        # print username
        to_user = request.session['username']
        if username == to_user:
            try:
                cursor = connection.cursor()
                cursor.callproc('get_overviewByUsername_sp', [username,to_user])
                user_info = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()

            for element in user_info:
                overview = {}
                overview['firstname'] = element[0]
                overview['lastname'] = element[1]
                overview['image'] = element[3]
                overview['friendshipStatus'] = ""

        else:
            if username is not None:
                try:
                    cursor = connection.cursor()
                    cursor.callproc('get_overviewByUsername_sp', [username,to_user])
                    user_info = cursor.fetchall()
                except Error as e:
                    print e
                finally:
                    cursor.close()
            else:
                return HttpResponse("Please provide username for selected user")

            print user_info
            for element in user_info:
                overview = {}
                overview['firstname'] = element[0]
                overview['lastname'] = element[1]
                overview['image'] = element[3]
                try:
                    overview['friendshipStatus'] = element[4]
                except:
                    overview['friendshipStatus'] = "Add Friend"
        print "Overview is: ",overview
        context = {
                    "overview":overview
        }
        return HttpResponse(json.dumps(context))