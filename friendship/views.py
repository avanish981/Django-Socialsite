from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.db import connection

from mysql.connector import Error
import json
# Create your views here.
''' Create a friendship request '''
def friendship_add_friend(to_user,from_user):
	
	try:
		cursor = connection.cursor()
		cursor.callproc('insert_requestByUsername_sp',[to_user,from_user])
		status = cursor.fetchall()
	except Error as e:
	    print e
	finally:
	    cursor.close()

''' To accept a friend request'''
def friendship_accept(to_user,from_user):

    try:
        cursor = connection.cursor()
        cursor.callproc('accept_requestByUsername',[from_user,to_user])
    except Error as e:
        print e
    finally:
        cursor.close()

''' To reject a friend request'''
def friendship_reject(to_user,from_user):

	try:
		cursor = connection.cursor()
		cursor.callproc('reject_requestByUsername',[to_user,from_user])
	except Error as e:
		print e
	finally:
		cursor.close()
    
    
@csrf_exempt
def friendship(request):
    if request.method == 'POST':
        json_response = json.loads(request.body)
        print json_response

        if json_response['friendshipStatus'] == "Add Friend":
            friendship_add_friend(json_response['toUser'],request.session['username'])
            return HttpResponse("request sent")

        elif json_response['friendshipStatus'] == "confirm":
            friendship_accept(json_response['toUser'],request.session['username'])
            return HttpResponse("friends")

        elif json_response['friendshipStatus'] == "reject":
			friendship_reject(json_response['toUser'],request.session['username'])
			return HttpResponse("Friendship Rejected")        

        else:
            return HttpResponse(json_response['friendshipStatus'])

''' Get user's friends list '''
@csrf_exempt
def view_friends(request):
    
    if request.method == 'GET':
        username = request.session['username']

        try:
            cursor = connection.cursor()
            cursor.callproc('get_friendsByUsername_sp',[username])
            friends = cursor.fetchall()
        except Error as e:
            print e
        finally:
            cursor.close()
        
        return HttpResponse("Friendlists")


''' To cancel a friend request'''
@csrf_exempt
def friendship_cancel(request, friendship_request_id):
    if request.method == 'POST':
        json_response = json.loads(request.body)
        from_user = json_response['to_user']
        to_user = request.session['username']

        try:
            cursor = connection.cursor()
            cursor.callproc('reject_requestByUsername',[to_user,from_user])
        except Error as e:
            print e
        finally:
            cursor.close()
        return HttpResponse("Friendship Rejected")

''' To get total friendship requests'''
@csrf_exempt
def friendship_request_list(request, template_name='friendship/friend/requests_list.html'):
    if request.method == 'GET':
        json_response = json.loads(request.body)
        to_user = request.session['username']

        try:
            cursor = connection.cursor()
            cursor.callproc('get_friendRequestsByUsername',[to_user])
            users = cursor.fetchall()
        except Error as e:
            print e
        finally:
            cursor.close()

        context = {
                    "friendRequests":friendRequests,
        }
        return HttpResponse(json.dumps(context))


''' To get the status of friendship requests'''
@csrf_exempt
def friendship_requests_detail(request):
    """ View a particular friendship request """
    if request.method == 'GET':
        json_response = json.loads(request.body)
        to_user = request.session['username']
        from_user = json_response['from_user']
        try:
            cursor = connection.cursor()
            cursor.callproc('get_friendRequestDetailsByUsername',[to_user,from_user])
            users_request_details = cursor.fetchall()
        except Error as e:
            print e
        finally:
            cursor.close()

        context = {
                    "friendRequests":friendRequests,
        }
        return HttpResponse(json.dumps(context))
