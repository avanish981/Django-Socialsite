from django.shortcuts import render
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import HttpResponse
from django.db import connection

from rest_framework import permissions, viewsets
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework import status, views
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout

import requests
import json
from mysql.connector import Error

from myapp.csrfexemptview import CSRFExemptView
from .models import UploadFileForm, Upload, User  #Account
from .permissions import IsAccountOwner
from .serializers import UserSerializer #AccountSerializer
import os


# BASE_DIR = os.path.dirname(os.path.dirname(__file__))
# MEDIA_ROOT = os.path.join(os.path.dirname(BASE_DIR),"/MySocialElite/myapp/media_cdn") 

mainurl = "https://localhost:8000"

# Create your views here.
def home(req):
    return render(req, 'main.html', {'STATIC_URL': settings.STATIC_URL})


''' the ModelViewSet offers an interface for listing, creating, retrieving, updating and destroying objects of a given model.'''
class UserViewSet(viewsets.ModelViewSet):
    #use the username attribute of the Account model to look up accounts instead of the id attribute
    lookup_field = 'username'
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    def create(self, request):
        #print request.data
        serializer = self.serializer_class(data=request.data)
        # print serializer

        if serializer.is_valid():
            User.objects.create_user(**serializer.validated_data)
            # print serializer.validated_data

            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

''' views.APIView are made specifically to handle AJAX requests. This turns out to save us a lot of time.'''
class LoginView(views.APIView):
    def post(self, request, format=None):
        data = json.loads(request.body)

        email = data.get('username', None)
        password = data.get('password', None)

        '''authenticate() takes an email and a password. Django then checks the database for an Account with email email. If one is found, 
        Django will try to verify the given password. If the username and password are correct, the Account found by authenticate() is 
        returned. If either of these steps fail, authenticate() will return None.'''

        account = authenticate(username=email, password=password)
        print "Authenticated account is: ",account
        if account is not None:
            if account.is_active:
                login(request, account)             #If authenticate() success and the user is active, then Django's login() utility to create a new session for this user.

                serialized = UserSerializer(account)
                request.session['username'] = email

                try:
                    cursor = connection.cursor()
                    cursor.callproc('get_userByUsername_sp', [email])
                    user = cursor.fetchall()
                    for element in user:
                        request.session['userid'] = element[0]

                except Error as e:
                    print e

                finally:
                    cursor.close()

                return Response(serialized.data)
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This account has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, 
            #status=status.HTTP_401_UNAUTHORIZED
            )

''' To successfully logout user and remove session related to user'''
class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,) #Only authenticated users should be able to hit this endpoint.

    def post(self, request, format=None):
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)


# ''' To Insert User's details in MySQL Database
#     object_user = userid(default=0),username,password,gender,date_of_birth,url,firstname,lastname,middlename,suffix,language,bio '''
# @csrf_exempt
# def insert_user(request):
#     if request.method == 'POST':
#         json_req = json.loads(request.body)
#         # print json_req
#         firstname = json_req['first_name']
#         lastname = json_req['last_name']
#         email = json_req['email']
#         password = json_req['password']
#         # gender = "male"
#         # birthdate = "1992/03/25"

        
#         try:
#             cursor = connection.cursor()
#             cursor.callproc('get_userByUsername_sp', [email])
#             user = cursor.fetchall()
#             # print user
#         except Error as e:
#             print e
#         finally:
#             cursor.close()

#         if not user:
#             object_user = [0,email,password,'','',firstname,lastname,'']
#             cursor = connection.cursor()
#             try:
#                 cursor.callproc('insert_user_sp', object_user)
#                 userid = cursor.fetchall()
#                 return HttpResponse("Called SP")
#             except Error as e:
#                 print e
#             finally:
#                 cursor.close()
#         else:
#             return HttpResponse("The Email ID has been already used. Please try to login with username and password!")



# ''' Open login URL and Perform validation of User's credentials for Regular LogIn
#     element[1] = username
#     element[2] = password  '''

# class login(CSRFExemptView):
#     def post(self,request):
#         json_req = json.loads(request.body)
#         username =  json_req['username']
#         password =  json_req['password']

#         cursor = connection.cursor()
#         try:
#             cursor.callproc('get_userByUsername_sp', [username])
#             user = cursor.fetchall()
#             # print user
#         except Error as e:
#             print e
#         finally:
#             cursor.close()

#         if not user:
#             return HttpResponse("INVALID USERNAME")
#         else:
#             for element in user:
#                 if element[2] == password:
#                     if element[2] == "Linkedinuser":
#                         return HttpResponse("Please sign in with Linkedin")
#                     elif element[2] == "Googlenuser":
#                         return HttpResponse("Please sign in with Google")
#                     else:
#                         request.session['username'] = username
#                         try:
#                             cursor = connection.cursor()
#                             cursor.callproc('get_userByUsername_sp', [username])
#                             user = cursor.fetchall()
#                             for element in user:
#                                 request.session['userid'] = element[0]
#                             # print user
#                         except Error as e:
#                             print e
#                         finally:
#                             cursor.close()
#                         return HttpResponse("USER FOUND")
#                 else:
#                     return HttpResponse("Username AND Password didn't match")

''' the ModelViewSet offers an interface for listing, creating, retrieving, updating and destroying objects of a given model.'''
class UserViewSet_google(viewsets.ModelViewSet):
    #use the username attribute of the Account model to look up accounts instead of the id attribute
    lookup_field = 'username'
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # def get_permissions(self):
    #     if self.request.method in permissions.SAFE_METHODS:
    #         return (permissions.AllowAny(),)

    #     if self.request.method == 'POST':
    #         return (permissions.AllowAny(),)

    #     return (permissions.IsAuthenticated(), IsAccountOwner(),)

    def create(self, data):
        serializer = self.serializer_class(data=data)
        # print serializer

        if serializer.is_valid():
            User.objects.create_user(**serializer.validated_data)

        #     return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        # return Response({
        #     'status': 'Bad request',
        #     'message': 'Account could not be created with received data.'
        # }, status=status.HTTP_400_BAD_REQUEST)

''' To get the token from Google and pass the token to get userdata'''

class google_login(CSRFExemptView):
    def post(self,request):
        json_code = json.loads(request.body) 
        code = json_code['code']
        # print code

        ''' Request url to get the token from Google'''

        url = 'https://www.googleapis.com/oauth2/v4/token'
        
        data = {'code' : str(code),
                'client_id':'509969686826-n6iahscnfpn7ebqo47kjgnov6k4oqbgf.apps.googleusercontent.com',
                'client_secret' : 'dgPOIuipVU0Sc95IfyJCmiuG',
                'redirect_uri': mainurl+'/callbackGoogle',
                'grant_type':'authorization_code',
                # 'access-type': 'offline'
                }

        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        r = requests.post(url,data=data,headers=headers)
        
        r_json = r.json()
        # print 'Output: - ' + r.text
        access_token = r_json['access_token']
        #print access_token
        expires_in = r_json['expires_in']

        ''' Request url to get user's email,name,given_name,family_name,link,picture,gender,locale'''
        
        request_url = ('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+access_token)
        headers = {'Connection': 'Keep-Alive','Authorization': 'Bearer '+r_json['access_token']}
        user_info = requests.get(request_url,headers=headers)
        
        user_info_get = requests.get(request_url)
        # print 'Output of user is: '+user_info_get.text
        user_info = user_info_get.json()
        # print user_info

        email = user_info['email']
        firstname = user_info['given_name']
        lastname = user_info['family_name']
        password = "Googleuser"
        username = user_info['name'] #username is firstname + lastname
        userphoto = user_info['picture']
        gender = user_info['gender']
        birthdate = "1992/03/25"
        context = {
                    "success":"Logged in as",
                    "username":username,
                    "user_photo":userphoto,
                    "firstname":firstname,
                    "lastname":lastname,
                    "email": email,
                    "alldetails":user_info,
        }

        # if not user:
        # object_user = [0,email,password,gender,birthdate,firstname,lastname,userphoto]
        # cursor = connection.cursor()
        # try:
        #     cursor.callproc('insert_user_sp', object_user)
        #     userid = cursor.fetchall()
        #     print "user inserted"
        # except Error as e:
        #     print e
        # finally:
        #     cursor.close()

        objects_userview = UserViewSet_google()
        objects_userview.create({'password': 'Googleuser', 
                                    'first_name': firstname, 
                                    'last_name': lastname, 
                                    'username': email,
                                })
        account = authenticate(username=email, password=password)
        print "account is",account

        if account is not None:
            if account.is_active:
                login(request, account)             #If authenticate() success and the user is active, then Django's login() utility to create a new session for this user.
            request.session['username'] = email
            try:
                cursor = connection.cursor()
                cursor.callproc('get_userByUsername_sp', [email])
                user = cursor.fetchall()
                for element in user:
                    request.session['userid'] = element[0]
            except Error as e:
                print e

            finally:
                cursor.close()

            try:
                cursor = connection.cursor()
                cursor.callproc('insert_photoByUsername_sp', [email,userphoto])
            except Error as e:
                print e
            finally:
                cursor.close()

        return HttpResponse(json.dumps(context))

''' To get the token from LinkedIn and pass the token to get userdata'''
class linkedin_login(CSRFExemptView):
    def post(self,request):
        json_code = json.loads(request.body) 
        code = json_code['code']
        # code = request.POST.get('code')
        ''' Request url to get the token from LinkedIn'''

        request_url = ('https://www.linkedin.com/uas/oauth2/accessToken?'
        + 'grant_type=authorization_code&' + 'code=' + str(code) + '&'
        + 'redirect_uri='+mainurl+'/callbackLinkedIn&'
        + 'client_id=75y4e2gztxa2tx&'
        + 'client_secret=TuXRQurXvXHr4e0w')
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        r = requests.post(request_url,data=json.dumps(code),headers=headers)
        # print r.text
        r_json = r.json()
        # print r_json
        access_token = r_json['access_token']
        expires_in = r_json['expires_in']

        ''' Request url to get user's firstname,lastname,maiden-name,email-address,headline,picture-url,num-connections,
            public-profile-url,industry,specialties,summary,positions,educations,activities,notes'''

        request_url = ('https://api.linkedin.com/v1/people/~:(first-name,last-name,maiden-name,email-address,headline,picture-url,picture-urls::(original),num-connections,public-profile-url,industry,specialties,summary,positions:(id,title,summary,start-date,end-date,is-current,company:(id,name,type,size,industry,ticker)),educations:(id,school-name,field-of-study,start-date,end-date,degree,activities,notes))?format=json')
        headers = {'Connection': 'Keep-Alive','Authorization': 'Bearer '+r_json['access_token']}
        user_info_get = requests.get(request_url,headers=headers)
        user_info = user_info_get.json()

        # print user_info
        firstname = user_info['firstName']
        lastname = user_info['lastName']
        email = user_info['emailAddress']
        password = "Linkedinuser"
        gender = "male"
        birthdate = "1992/03/25"
        userphoto_short = user_info['pictureUrl']
        userorghphoto = user_info['pictureUrls']
        userphoto = userorghphoto['values'][0]
        # print userphoto
        position = user_info['positions']
        publicProfileUrl = user_info['publicProfileUrl']
        numconnections = user_info['numConnections']
        industry = user_info['industry']
        # summary = user_info['summary']
        # print summary
        # specialties = user_info['specialties']
        context = {
                    "success":"Logged in as",
                    "user_photo":userphoto,
                    "firstname":firstname,
                    "lastname":lastname,
                    "email": email,
                    "position": position,
                    "publicProfileUrl":publicProfileUrl,
                    "numconnections":numconnections,
                    "industry":industry,
                    "alldetails":user_info,
                }
        # users = User.objects.filter(username=email)

        # # if not user:
        # object_user = [0,email,password,gender,birthdate,firstname,lastname,userphoto]
        # cursor = connection.cursor()
        # try:
        #     cursor.callproc('insert_user_sp', object_user)
        #     userid = cursor.fetchall()
        #     print "user inserted or updated"
        # except Error as e:
        #     print e
        # finally:
        #     cursor.close()

        objects_userview = UserViewSet_google()
        objects_userview.create({'password': 'Googleuser', 'first_name': firstname, u'last_name': lastname, u'username': email})
        account = authenticate(username=email, password='Googleuser')
        print "account is",account
        if account is not None:
            if account.is_active:
                login(request, account)             #If authenticate() success and the user is active, then Django's login() utility to create a new session for this user.
            request.session['username'] = email

            try:
                cursor = connection.cursor()
                cursor.callproc('get_userByUsername_sp', [request.user])
                user = cursor.fetchall()
                for element in user:
                    request.session['userid'] = element[0]
                # print user
            except Error as e:
                print e
            finally:
                cursor.close()

            try:
                cursor = connection.cursor()
                cursor.callproc('insert_photoByUsername_sp', [email,userphoto])
            except Error as e:
                print e
            finally:
                cursor.close()

        # print "request.user is: ",request.user

                
        return HttpResponse(json.dumps(context))




''' Logout User'''
# @csrf_exempt
# def logout(request):
#     try:
#         del request.session['username']
#         print "Session Deleted"
#     except KeyError:
#         pass
#     return HttpResponse("You're logged out.")


''' To get landing page cover images'''
@csrf_exempt
def get_cover_images(request):
    if request.method == 'GET':
        cursor = connection.cursor()
        try:
            cursor.callproc('get_coverImages_sp')
            images = cursor.fetchall()
            cover_images = []
            for image in images:
                cover_image = {}
                cover_image['src'] = image[0]
                cover_image['dataColor'] = image[1]
                cover_image['alt'] = image[2]
                cover_image['caption'] = image[3]
                cover_image['idx'] = image[4]
                cover_images.append(cover_image)
            # print cover_images
        except Error as e:
            print e
        finally:
            cursor.close()

        context = {
                "coverImages":cover_images,
        }

    return HttpResponse(json.dumps(context))

