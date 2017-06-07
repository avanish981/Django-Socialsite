from django.shortcuts import render
from django.http import HttpResponse
from django.db import connection
from myapp.csrfexemptview import CSRFExemptView
import json
from mysql.connector import Error
import re
# Create your views here.

''' To insert,update,get and delete calender events'''
class calender(CSRFExemptView):
    def post(self,request):
        info = json.loads(request.body)
        print info
        json_info = info['eventDetails']
        username = info['emailId']
        start_offset = info['timeOffsetStart']
        end_offset = info['timeOffsetEnd']
        print "start_offset is: ", start_offset
        print json_info
        if username is not False:
            try:
                cursor = connection.cursor()
                cursor.callproc('insert_calenderByuserName_sp', [0,username,json_info['title'],json_info['startsAt'],json_info['endsAt'],
                                                            json_info['type'],json_info['description'],info['timeOffsetStart'],
                                                            info['timeOffsetEnd']])
                print "New Event inserted into calender"
            except Error as e:
                print e
            finally:
                cursor.close()
        else:
            userid = request.session['userid']
            try:
                cursor = connection.cursor()
                cursor.callproc('insert_calenderByuserId_sp', [0,userid,json_info['title'],json_info['startsAt'],json_info['endsAt'],
                                                            json_info['type'],json_info['description'],info['timeOffsetStart'],
                                                            info['timeOffsetEnd']])
                print "New Event inserted into calender"
            except Error as e:
                print e
            finally:
                cursor.close()
        return HttpResponse("New Event inserted into calender")

    def put(self,request):
        info = json.loads(request.body)
        json_info = info['eventDetails']
        username = info['emailId']
        print json_info
        # print "username is: ", username
        if username is not False:
            try:
                cursor = connection.cursor()
                cursor.callproc('insert_calenderByuserName_sp', [json_info['id'],username,json_info['title'],json_info['startsAt'],
                                                                json_info['endsAt'],json_info['type'],json_info['description'],
                                                                info['timeOffsetStart'],info['timeOffsetEnd']])
                print "Event Updated into calender"
            except Error as e:
                print e
            finally:
                cursor.close()
        else:
            userid = request.session['userid']
            try:
                cursor = connection.cursor()
                cursor.callproc('insert_calenderByuserId_sp', [json_info['id'],userid,json_info['title'],json_info['startsAt'],
                                                                json_info['endsAt'],json_info['type'],json_info['description'],
                                                                info['timeOffsetStart'],info['timeOffsetEnd']])
                print "Event Updated into calender"
            except Error as e:
                print e
            finally:
                cursor.close()
        return HttpResponse("Event Updated into calender")

    def get(self,request):
        startDay = request.GET.get('startDay')
        endDay = request.GET.get('endDay')
        username = request.GET.get('emailId')
        print "startDay", startDay
        print "endDay", endDay
        print "username", username
        if username is not None:
            try:
                cursor = connection.cursor()
                cursor.callproc('get_calenderByUserName_sp', [username,startDay,endDay])
                events = cursor.fetchall()
                print "Get events related to date range"
            except Error as e:
                print e
            finally:
                cursor.close()
        else:
            userid = request.session['userid']
            try:
                cursor = connection.cursor()
                cursor.callproc('get_calenderByuserId_sp', [userid,startDay,endDay])
                events = cursor.fetchall()
                print "Get events related to date range"
            except Error as e:
                print e
            finally:
                cursor.close()

        calender_events = []
        for element in events:
            event = {}
            event['id'] = element[0]
            event['title'] = element[1]
            event['type'] = element[2]
            #startAt = str(element[3])
            event['startsAt'] = re.sub('[-]', '/', str(element[3]))
            event['endsAt'] = re.sub('[-]', '/', str(element[4]))
            event['description'] = element[5]
            event['draggable'] = True
            event['resizable'] = True
            calender_events.append(event)
        context = {
                    "calender_events":calender_events
        }
        return HttpResponse(json.dumps(context))

    def delete(self,request):
        info = json.loads(request.body)
        json_info = info['eventDetails']
        username = info['emailId']
        print json_info
        print "username is:", username
        if username is not False:
            try:
                cursor = connection.cursor()
                cursor.callproc('delete_calenderByuserName_sp', [json_info['id'],username,json_info['title'],json_info['startsAt'],json_info['endsAt'],
                                                            json_info['type'],json_info['description']])
                print "Event deleted from calender"
            except Error as e:
                print e
            finally:
                cursor.close()
        else:
            userid = request.session['userid']
            try:
                cursor = connection.cursor()
                cursor.callproc('delete_calenderByuserId_sp', [json_info['id'],userid,json_info['title'],json_info['startsAt'],json_info['endsAt'],
                                                            json_info['type'],json_info['description']])
                print "Event deleted from calender"
            except Error as e:
                print e
            finally:
                cursor.close()
        return HttpResponse("Event deleted from calender")