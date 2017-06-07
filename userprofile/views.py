from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from myapp.csrfexemptview import CSRFExemptView
from django.db import connection


import json
from mysql.connector import Error

# Create your views here.

''' post = To insert summary details of user,
    put = To Update summary details of the user,
    get = To get summary Details of user,
    delete = To delete summary of user '''
class summary(CSRFExemptView):
    def post(self,request):
        json_summary = json.loads(request.body)
        # print json_summary
        userid = request.session['userid']
        cursor = connection.cursor()
        try:
            cursor.callproc('insert_summary_sp',[0,userid,json_summary["summary"]])
            print "Summary Updated"
        except Error as e:
            print e
        finally:
            cursor.close()
        return HttpResponse("Summary Inserted")

    def put(self,request):
        json_summary = json.loads(request.body)
        # print json_summary
        userid = request.session['userid']
        cursor = connection.cursor()
        try:
            cursor.callproc('insert_summary_sp',[0,userid,json_summary["summary"]])
            print "Summary Updated"
        except Error as e:
            print e
        finally:
            cursor.close()
        return HttpResponse("Summary Updated")


    def get(self,request):
        print request.user
        
        username = request.GET.get('emailId')
        # print username
        if username is not None:
            try:
                cursor = connection.cursor()
                cursor.callproc('get_summaryByUsername_sp', [username])
                summary_info = cursor.fetchall()
                # print summary_info

            except Error as e:
                print e
            finally:
                cursor.close()
        else:
            userid = request.session['userid']
            try:
                cursor = connection.cursor()
                cursor.callproc('get_summaryByUserId_sp', [userid])
                summary_info = cursor.fetchall()
                # print summary_info

            except Error as e:
                print e
            finally:
                cursor.close()

        if summary_info:
            for element in summary_info:
                summary = element[1]
        else:
            summary=""
        context = {
                    "summary":summary,
        }

        return HttpResponse(json.dumps(context))

    def delete(self,request):
        userid = request.session['userid']
        try:
            cursor = connection.cursor()
            cursor.callproc('delete_summaryByUserId_sp',[userid])
            print "User Summary Deleted"
        except Error as e:
            print e
        finally:
            cursor.close()
        return HttpResponse("User Summary Deleted")


''' post = To insert experience details of user,
    put = To Update experience details of the user,
    get = To get experience Details of user,
    delete = To delete Experience of user '''
class experience(CSRFExemptView):
    def post(self,request):
        experience_json = json.loads(request.body)
        userid = request.session['userid']
        cursor = connection.cursor()
        print experience_json
        cursor = connection.cursor()

        try:
            cursor.callproc('insert_experience_sp',[0,userid,experience_json["companyName"],experience_json["title"],
                                                    experience_json["location"],experience_json["startTime"],experience_json["endTime"],
                                                    experience_json["description"],experience_json["logo_url"]])
            print "User Experience Inserted"
            return HttpResponse("User Experience Inserted")
        except Error as e:
            print e
        finally:
            cursor.close()

    def put(self,request):
        experience_json = json.loads(request.body)
        experience = experience_json['updateExperience']
        # print experience_json
        userid = request.session['userid']

        try:
            cursor = connection.cursor()
            cursor.callproc('update_experience_sp',[0,userid,experience['companyName'],experience['title'],experience['location'],
                                                    experience['startTime'],experience['endTime'],experience['description'],
                                                    experience['logo_url'],experience_json['index']])
            print "User Experience Updated"
        except Error as e:
            print e
        finally:
            cursor.close()
        return HttpResponse("User Experience Updated") 

    def get(self,request):
        username = request.GET.get('emailId')
        # print username
        if username is not None:
            try:
                cursor = connection.cursor()
                cursor.callproc('get_experienceByUsername_sp', [username])
                user_exps = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()
        else:
            userid = request.session['userid']
            try:
                cursor = connection.cursor()
                cursor.callproc('get_experienceByUserId_sp', [userid])
                user_exps = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()

        experiences = []
        for element in user_exps:
            experience = {}
            experience["companyName"] = element[1]
            experience["title"] = element[2]
            experience["location"] = element[3]
            experience["startTime"] = str(element[4])
            experience["endTime"] = str(element[5])
            experience["description"] = element[6]
            experience["logo_url"] = element[7]
            updated_at = element[8]
            # print element[1]
            # print updated_at
            experiences.append(experience)
        # print experiences

        context = {
                    "experiences":experiences,
        }
        return HttpResponse(json.dumps(context))

    def delete(self,request):
        userid = request.session['userid']
        json_index = json.loads(request.body)
        index = json_index['index']
        try:
            cursor = connection.cursor()
            cursor.callproc('delete_experienceByUserId_sp',[userid,index])
            print "User Experience Deleted"
        except Error as e:
            print e
        finally:
            cursor.close()
        return HttpResponse("User Experience Deleted")

''' post = To insert organization details of user,
    put = To Update organization details of the user,
    get = To get organization Details of user,
    delete = To delete organization of user '''
class organization(CSRFExemptView):
    def post(self,request):
        organization_json = json.loads(request.body)
        print organization_json
        userid = request.session['userid']
        cursor = connection.cursor()

        try:
            cursor.callproc('insert_organization_sp',[0,userid,organization_json["organizationName"],organization_json["positionHeld"],
                                                    organization_json["occupation"],organization_json["additionalNotes"],
                                                    organization_json["startTime"],organization_json["endTime"],organization_json["logo_url"]])
            print "User Organization Inserted"
            return HttpResponse("User Organization Inserted")
        except Error as e:
            print e
        finally:
            cursor.close()

    def put(self,request):
        json_organization = json.loads(request.body)
        index = json_organization["index"]
        # print index
        organization = json_organization["updateOrganization"]
        # print organization
        userid = request.session['userid']
        try:
            cursor = connection.cursor()
            cursor.callproc('update_organization_sp',[0,userid,organization["organizationName"],organization["positionHeld"],
                                                        organization["occupation"],organization["additionalNotes"],
                                                        organization["startTime"],organization["endTime"],
                                                        organization["logo_url"],index])
            print "User Organizations Inserted or Updated"
            return HttpResponse("User Organizations Inserted or Updated")
        except Error as e:
            print e
        finally:
            cursor.close()

    def get(self,request):
        username = request.GET.get('emailId')
        # print username
        if username is not None:
            try:
                cursor = connection.cursor()
                cursor.callproc('get_orgByUsername_sp', [username])
                user = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()
        else:
            userid = request.session['userid']
            try:
                cursor = connection.cursor()
                cursor.callproc('get_orgByUserId_sp', [userid])
                user = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()

        organizations = []
        for element in user:
            organization = {}
            organization["organizationName"] = element[1]
            organization["positionHeld"] = element[2]
            organization["occupation"] = element[3]
            organization["startTime"] = str(element[4])
            organization["endTime"] = str(element[5])
            organization["additionalNotes"] = element[6]
            organization["logo_url"] = element[7]
            organizations.append(organization)
        # print organizations
        context = {
                    "organizations":organizations,
        }

        return HttpResponse(json.dumps(context))

    def delete(self,request):
        userid = request.session['userid']
        json_index = json.loads(request.body)
        index = json_index['index']
        try:
            cursor = connection.cursor()
            cursor.callproc('delete_organizationByUserId_sp',[userid,index])
            print "User Organization Deleted"
        except Error as e:
            print e
        finally:
            cursor.close()
        return HttpResponse("User Organization Deleted")

''' post = To insert course details of user,
    put = To Update course details of the user,
    get = To get course Details of user,
    delete = To delete course of user '''
class course(CSRFExemptView):
    def post(self,request):
        userid = request.session['userid']
        courses_json = json.loads(request.body)
        # print courses_json
        for course_json in courses_json:
            ''' To insert university associated with course'''
            cursor = connection.cursor()
            try:
                cursor.callproc('insert_university_sp',[0,userid,course_json['associatedWith']])
                uni_ids = cursor.fetchall()
                for ids in uni_ids:
                    uni_id = ids[0]
            except Error as e:
                print e
            finally:
                cursor.close()

            ''' To insert course details of user related with university id '''
            cursor = connection.cursor()
            try:
                cursor.callproc('insert_course_sp',[0,userid,course_json["name"],course_json["number"],uni_id])
                print "New Courses Inserted"
            except Error as e:
                print e
            finally:
                cursor.close()
        return HttpResponse("New Courses Inserted")

    def put(self,request):
        course_json = json.loads(request.body)
        index = course_json['index']
        course_info = course_json['courses']
        course_uni = course_info['associatedWith']
        courses = course_info['courseInfo']
        userid = request.session['userid']
        # print index
        # print course_info
        print courses

        ''' To get uni_id from user '''
        cursor = connection.cursor()
        try:
            cursor.callproc('get_uniIdByUniName_sp',[course_uni,userid])
            uni_id = cursor.fetchall()
            # print uni_id
        except Error as e:
            print e
        finally:
            cursor.close()

        ''' To delete older courses'''
        cursor = connection.cursor()
        try:
            cursor.callproc('delete_course_sp',[userid,uni_id])
            print "Courses Deleted"
        except Error as e:
            print e
        finally:
            cursor.close()

        ''' To Update new courses'''
        for course in courses:
            print course
            cursor = connection.cursor()
            try:
                cursor.callproc('insert_course_sp',[0,userid,course["name"],course["number"],uni_id])
                print "Courses Inserted or Updated"
            except Error as e:
                print e
            finally:
                cursor.close()
        return HttpResponse("Courses Inserted or Updated")

    def delete(self,request):
        userid = request.session['userid']
        json_index = json.loads(request.body)
        index = json_index['index']
        try:
            cursor = connection.cursor()
            cursor.callproc('delete_uniByUserId_sp',[userid,index])
            uni_ids = cursor.fetchall()
            for ids in uni_ids:
                uni_id = ids[0]
            print "User University Deleted"
        except Error as e:
            print e
        finally:
            cursor.close()

        ''' To delete all the courses'''
        cursor = connection.cursor()
        try:
            cursor.callproc('delete_course_sp',[userid,uni_id])
            print "Courses Deleted"
        except Error as e:
            print e
        finally:
            cursor.close()
        return HttpResponse("User Courses and university Deleted")

    def get(self,request):
        username = request.GET.get('emailId')
        # print username

        if username is not None:
            # print "Not None"
            cursor = connection.cursor()
            try:
                cursor.callproc('get_uniByUsername_sp',[username])
                uni = cursor.fetchall()
                for ids in uni:
                    userid = ids[0]
            except Error as e:
                print e
            finally:
                cursor.close()

        else:
            userid = request.session['userid']
            ''' To get uni_list of user'''
            cursor = connection.cursor()
            try:
                cursor.callproc('get_uniByUserId_sp',[userid])
                uni = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()

        uni_list = []
        uni_id = []
        for element in uni:
            uni_id.append(element[1])
            uni_list.append(element[2])
        # print uni_list

        ''' From university list it will provide you courses'''
        courses = []
        i = 0
        for ids in uni_id:
            cursor = connection.cursor()
            try:
                cursor.callproc('get_courseByUserId_sp', [userid,ids])
                user = cursor.fetchall()
                courses_uni = {}
                courseInfo = []
                for element in user:
                    course = {}
                    # associatedWith = element[1]
                    course["name"] = element[1]
                    course["number"] = element[2]
                    courseInfo.append(course)
                # print courses
                courses_uni["associatedWith"] = uni_list[i]
                i=i+1
                courses_uni["courseInfo"] = courseInfo
                courses.append(courses_uni)
                # print courses
            except Error as e:
                print e
            finally:
                cursor.close()

        context = {
                    "courses":courses,
        }

        return HttpResponse(json.dumps(context))


# ''' To delete uni when no courses related to uni'''
# @csrf_exempt
# def delete_uni(request):
#     if request.method == 'POST':
#         userid = request.session['userid']
#         json_index = json.loads(request.body)
#         index = json_index['index']
#         try:
#             cursor = connection.cursor()
#             cursor.callproc('delete_uniByUserId_sp',[userid,index])
#             print "User University Deleted"
#         except Error as e:
#             print e
#         finally:
#             cursor.close()
#         return HttpResponse("User University Deleted")

class project(CSRFExemptView):
    def post(self,request):
        userid = request.session['userid']
        project_json = json.loads(request.body)
        print project_json

        # ''' To get already exists Projects to count and set index accordingly'''
        # cursor = connection.cursor()
        # index = 0
        # try:
        #     cursor.callproc('get_projectsByUserId_sp', [userid])
        #     user_projects = cursor.fetchall()
        #     for project in user_projects:
        #         index=index+1
        #     print index
        # except Error as e:
        #     print e
        # finally:
        #     cursor.close()

        # ''' Insert Project with calculated Index'''
        try:
            cursor = connection.cursor()
            cursor.callproc('insert_project_sp', [0,userid,project_json['projectName'],project_json['occupation'],project_json['startTime'],
                                                    project_json['endTime'],project_json['description'],project_json['project_url']])
            project_ids = cursor.fetchall()
            print "New Project Inserted"
            for ids in project_ids:
                project_id = ids[0]
            # print user
        except Error as e:
            print e
        finally:
            cursor.close()

        ''' Insert teammember based on projectId'''
        for member in project_json['teamMembers']:
            try:
                cursor = connection.cursor()
                cursor.callproc('insert_teamMembersByProjectId_sp', [0,project_id,member['name'],member['profileUrl']])
                print "Team Members Inserted based on Project Id"
            except Error as e:
                print e
            finally:
                cursor.close()

        return HttpResponse("New Project Inserted")

    def put(self,request):
        json_projects = json.loads(request.body)
        index = json_projects['index']
        project = json_projects['updateProject']
        userid = request.session['userid']
        project_teammates = project["teamMembers"]
        print project_teammates
        print index

        ''' To get project id based on index'''
        cursor = connection.cursor()
        try:
            cursor.callproc('get_projectIdByIndexUserId_sp',[userid,index])
            projectids = cursor.fetchall()
            print projectids
            for ids in projectids:
                project_id = ids[0]
        except Error as e:
            print e
        finally:
            cursor.close()

        ''' To delete older details of Project Members'''
        cursor = connection.cursor()
        try:
            cursor.callproc('delete_teamMembersByProjectId_sp',[project_id])
            print "Project teammates Deleted"
        except Error as e:
            print e
        finally:
            cursor.close()


        ''' To insert member details based on projectId'''
        for member in project_teammates:
            cursor = connection.cursor()
            try:
                cursor.callproc('insert_teamMembersByProjectId_sp',[0,project_id,member["name"],member["profileUrl"]])
                print "Project teammates Inserted or Updated"
            except Error as e:
                print e
            finally:
                cursor.close()

        ''' To insert project details except teammember details'''
        cursor = connection.cursor()
        try:
            cursor.callproc('update_project_sp',[0,userid,project['projectName'],project['occupation'],project['startTime'],
                                                        project['endTime'],project['description'],project['project_url'],index])
            print "Project Updated"
            return HttpResponse("Project Details Updated")
        except Error as e:
            print e
        finally:
            cursor.close()


    def get(self,request):
        username = request.GET.get('emailId')
        # print username
        if username is not None:
            try:
                cursor = connection.cursor()
                cursor.callproc('get_projectsByUsername_sp', [username])
                user = cursor.fetchall()
                # print user
            except Error as e:
                print e
            finally:
                cursor.close()
        else:
            userid = request.session['userid']

            try:
                cursor = connection.cursor()
                cursor.callproc('get_projectsByUserId_sp', [userid])
                user = cursor.fetchall()
                # print user
            except Error as e:
                print e
            finally:
                cursor.close()

        projects = []
        teamMember = {}
        for element in user:
            project = {}
            teamMembers = []
            project_id = element[0]
            cursor = connection.cursor()
            try:
                cursor.callproc('get_teamMembersByProjectId_sp',[project_id])
                team_member = cursor.fetchall()
                # print team_member
                for member in team_member:
                    team_json  = {}
                    team_json["name"] = member[0]
                    team_json["profileUrl"] = ""
                    teamMembers.append(team_json)
            except Error as e:
                print e
            finally:
                cursor.close()

            # print teamMembers
            project["projectName"] = element[1]
            project["occupation"] = element[2]
            project["startTime"] = str(element[3])
            project["endTime"] = str(element[4])
            project["description"] = element[5]
            project["project_url"] = element[6]
            project["teamMembers"] = teamMembers
            # team_members = element[7]
            projects.append(project)
        # print projects
        context = {
                    "projects":projects,
        }

        return HttpResponse(json.dumps(context))

    def delete(self,request):
        userid = request.session['userid']
        json_index = json.loads(request.body)
        index = json_index['index']
        try:
            cursor = connection.cursor()
            cursor.callproc('delete_projectByUserId_sp',[userid,index])
            print "User Project Deleted"
            project_ids = cursor.fetchall()
            for element in project_ids:
                project_id = element[0]
            print project_id
        except Error as e:
            print e
        finally:
            cursor.close()

        try:
            cursor = connection.cursor()
            cursor.callproc('delete_teamMembersByProjectId_sp',[project_id])
            print "User Project's Teammembers Deleted"
        except Error as e:
            print e
        finally:
            cursor.close()
        return HttpResponse("User Project and Teammates Deleted")

class volunteer(CSRFExemptView):
    def post(self,request):
        userid = request.session['userid']
        volunteer_json = json.loads(request.body)
        # print volunteer_json

        ''' To get already exists Projects to count and set index accordingly'''
        cursor = connection.cursor()
        index = 0
        try:
            cursor.callproc('get_volunteerByUserId_sp', [userid])
            user_volunteers = cursor.fetchall()
            for volunteer in user_volunteers:
                index=index+1
            print index
        except Error as e:
            print e
        finally:
            cursor.close()

        ''' Insert Volunteer with calculated Index'''
        cursor = connection.cursor()
        try:
            cursor.callproc('insert_volunteer_sp', [0,userid,volunteer_json['organizationName'],volunteer_json['role'],
                                                    volunteer_json['cause'],volunteer_json['startTime'],volunteer_json['endTime'],
                                                    volunteer_json['description'],volunteer_json['logo_url']])
            print "New Volunteer Inserted"
        except Error as e:
            print e
        finally:
            cursor.close()
        return HttpResponse("New Volunteer Inserted ")

    def put(self,request):
        json_volunteer = json.loads(request.body)
        # print json_volunteer
        index = json_volunteer["index"]
        # print index
        volunteer = json_volunteer["volunteer"]
        # print volunteer
        userid = request.session['userid']
        cursor = connection.cursor()
        try:
            cursor.callproc('update_volunteer_sp',[0,userid,volunteer["organizationName"],volunteer["role"],
                                                        volunteer["cause"],volunteer["startTime"],
                                                        volunteer["endTime"],volunteer["description"],
                                                        volunteer["logo_url"],index])
            print "User Volunteer Inserted or Updated"
        except Error as e:
            print e
        finally:
            cursor.close()
        return HttpResponse("User Volunteer Inserted or Updated")

    def get(self,request):
        username = request.GET.get('emailId')
        # print username
        if username is not None:
            try:
                cursor = connection.cursor()
                cursor.callproc('get_volunteerByUsername_sp', [username])
                user_volunteer = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()

            try:
                cursor = connection.cursor()
                cursor.callproc('get_opportunitiesByUsername_sp',[username])
                user_opportunities = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()

            try:
                cursor = connection.cursor()
                cursor.callproc('get_causesByUsername_sp',[username])
                user_causes = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()

            try:
                cursor = connection.cursor()
                cursor.callproc('get_supprotOrganizationsByUsername_sp',[username])
                support_orgs = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()

        else:
            userid = request.session['userid']
            try:
                cursor = connection.cursor()
                cursor.callproc('get_volunteerByUserId_sp', [userid])
                user_volunteer = cursor.fetchall()

            except Error as e:
                print e
            finally:
                cursor.close()

            try:
                cursor = connection.cursor()
                cursor.callproc('get_opportunitiesByUserId_sp',[userid])
                user_opportunities = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()

            try:
                cursor = connection.cursor()
                cursor.callproc('get_causesByUserId_sp',[userid])
                user_causes = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()

            try:
                cursor = connection.cursor()
                cursor.callproc('get_supprotOrganizationsByUserId_sp',[userid])
                support_orgs = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()

        volunteer = []
        for element in user_volunteer:
            volunteer_json = {}
            volunteer_json["organizationName"] = element[1]
            volunteer_json["role"] = element[2]
            volunteer_json["cause"] = element[3]
            volunteer_json["startTime"] = str(element[4])
            volunteer_json["endTime"] = str(element[5])
            volunteer_json["description"] = element[6]
            volunteer_json["logo_url"] = element[7]
            volunteer.append(volunteer_json)
        # print volunteer

        opprtunities = []
        for element in user_opportunities:
            opportunity = {}
            opportunity['name'] = element[0]
            opprtunities.append(opportunity)
        # print opprtunities

        causes = []
        for element in user_causes:
            cause = {}
            cause['name'] = element[0]
            causes.append(cause)
        # print causes

        orgs = []
        for element in support_orgs:
            org = {}
            org['name'] = element[0]
            orgs.append(org)
        # print orgs

        context = {
                    "volunteer":volunteer,
                    "opprtunities":opprtunities,
                    "causes":causes,
                    "support_orgs":orgs,
        }

        return HttpResponse(json.dumps(context))

    def delete(self,request):
        userid = request.session['userid']
        json_index = json.loads(request.body)
        index = json_index['index']
        try:
            cursor = connection.cursor()
            cursor.callproc('delete_volunteerByUserId_sp',[userid,index])
            print "User Volunteer Deleted"
        except Error as e:
            print e
        finally:
            cursor.close()

        return HttpResponse("User Volunteer Deleted")

class opportunities(CSRFExemptView):
    def post(self,request):
        userid = request.session['userid']
        opportunities_json = json.loads(request.body)
        print opportunities_json
        for opportunity in opportunities_json:
            ''' To get publication id based on index'''
            cursor = connection.cursor()
            try:
                cursor.callproc('insert_oppotunities_sp',[0,userid,opportunity['name']])
                print "Opportunities Inserted"
            except Error as e:
                print e
            finally:
                cursor.close()
        return HttpResponse("Opportunities Inserted")

    def put(self,request):
        userid = request.session['userid']
        opportunities_json = json.loads(request.body)
        opportunities = opportunities_json['opportunities']

        ''' To delete older opportunities'''
        cursor = connection.cursor()
        try:
            cursor.callproc('delete_opportunity_sp',[userid])
            print "Opportunity Deleted"
        except Error as e:
            print e
        finally:
            cursor.close()

        ''' To Update new opportunities'''
        for opportunity in opportunities:
            cursor = connection.cursor()
            try:
                cursor.callproc('insert_oppotunities_sp',[0,userid,opportunity["name"]])
                print "Opportunities Inserted or Updated"
            except Error as e:
                print e
            finally:
                cursor.close()
            
        return HttpResponse("Opportunities Inserted or Updated")

class cause(CSRFExemptView):
    def put(self,request):
        userid = request.session['userid']
        cause_json = json.loads(request.body)
        causes = cause_json['causes']
        print causes
        # print cause_json
        ''' To delete older causes'''
        cursor = connection.cursor()
        try:
            cursor.callproc('delete_cause_sp',[userid])
            print "Causes Deleted"
        except Error as e:
            print e
        finally:
            cursor.close()

        ''' To Update new causes'''
        for cause in causes:
            cursor = connection.cursor()
            try:
                cursor.callproc('insert_cause_sp',[0,userid,cause["name"]])
                print "Causes Inserted or Updated"
            except Error as e:
                print e
            finally:
                cursor.close()
            
        return HttpResponse("Causes Inserted or Updated")

    def post(self,request):
        userid = request.session['userid']
        causes_json = json.loads(request.body)
        print causes_json
        for cause in causes_json:
            try:
                cursor = connection.cursor()
                cursor.callproc('insert_cause_sp',[0,userid,cause['name']])
                print "Causes Inserted"
            except Error as e:
                print e
            finally:
                cursor.close()
        return HttpResponse("Causes Inserted")

class volunteer_organization(CSRFExemptView):
    def put(self,request):
        userid = request.session['userid']
        organizations_json = json.loads(request.body)
        organizations = organizations_json['organizations']
        # print cause_json
        ''' To delete older Support Organizations'''
        cursor = connection.cursor()
        try:
            cursor.callproc('delete_supportOrganization_sp',[userid])
            print "Support Organizations Deleted"
        except Error as e:
            print e
        finally:
            cursor.close()

        ''' To Update Support Organizations'''
        for organization in organizations:
            cursor = connection.cursor()
            try:
                cursor.callproc('insert_supportOrganization_sp',[0,userid,organization["name"]])
                print "Support Organizations Inserted or Updated"
            except Error as e:
                print e
            finally:
                cursor.close()
            
        return HttpResponse("Support Organizations Inserted or Updated")

    def post(self,request):
        userid = request.session['userid']
        organization_json = json.loads(request.body)
        # print organization_json
        for organization in organization_json:
            cursor = connection.cursor()
            try:
                cursor.callproc('insert_supportOrganization_sp',[0,userid,organization["name"]])
                print "Support Organizations Inserted"
            except Error as e:
                print e
            finally:
                cursor.close()
        return HttpResponse("Support Organizations Inserted")

class publication(CSRFExemptView):
    def post(self,request):
        userid = request.session['userid']
        publication_json = json.loads(request.body)
        print publication_json

        # ''' To get already exists Projects to count and set index accordingly'''
        # cursor = connection.cursor()
        # index = 0
        # try:
        #     cursor.callproc('get_publicationsByUserId_sp', [userid])
        #     user_publications = cursor.fetchall()
        #     for publication in user_publications:
        #         index=index+1
        #     print index
        # except Error as e:
        #     print e
        # finally:
        #     cursor.close()

        # ''' Insert Publication with calculated Index'''
        cursor = connection.cursor()
        try:
            cursor.callproc('insert_publication_sp', [0,userid,publication_json['title'],publication_json['publication_publisher'],
                                                        publication_json['date'],publication_json['publication_url'],
                                                        publication_json['description']])
            project_ids = cursor.fetchall()
            print "New Publication Inserted"
            for ids in project_ids:
                publication_id = ids[0]
            # print user
        except Error as e:
            print e
        finally:
            cursor.close()

        ''' Insert teammember based on publicationId'''
        for author in publication_json['authors']:
            cursor = connection.cursor()
            try:
                cursor.callproc('insert_authorsByPublicationId_sp', [0,publication_id,author['name'],author['profileUrl']])
                print "Authors Inserted based on Publication Id"
            except Error as e:
                print e
            finally:
                cursor.close()

        return HttpResponse("New Publication Inserted")

    def put(self,request):
        json_publications = json.loads(request.body)
        index = json_publications['index']
        publication = json_publications['updatePublication']
        print publication
        userid = request.session['userid']
        publication_authors = publication["authors"]
        print publication_authors

        ''' To get publication id based on index'''
        cursor = connection.cursor()
        try:
            cursor.callproc('get_publicationIdByIndexUserId_sp',[userid,index])
            publicationids = cursor.fetchall()
            for ids in publicationids:
                publication_id = ids[0]
        except Error as e:
            print e
        finally:
            cursor.close()

        ''' To delete older details of Project Members'''
        cursor = connection.cursor()
        try:
            cursor.callproc('delete_authorsByPublicationId_sp',[publication_id])
            print "Publication Authors Deleted"
        except Error as e:
            print e
        finally:
            cursor.close()


        ''' To insert Author details based on publicationId'''
        for author in publication_authors:
            cursor = connection.cursor()
            try:
                cursor.callproc('insert_authorsByPublicationId_sp',[0,publication_id,author["name"],author["profileUrl"]])
                print "Publication Authors Updated"
            except Error as e:
                print e
            finally:
                cursor.close()

        ''' To Update publication details except Author details'''
        cursor = connection.cursor()
        try:
            cursor.callproc('update_publication_sp',[0,userid,publication['title'],publication['publication_publisher'],
                                                        publication['date'],publication['publication_url'],
                                                        publication['description'],index])
            print "Publication Updated"
        except Error as e:
            print e
        finally:
            cursor.close()
        return HttpResponse("Publication Details Updated")

    def get(self,request):
        username = request.GET.get('emailId')
        # print username
        if username is not None:
            try:
                cursor = connection.cursor()
                cursor.callproc('get_publicationsByUsername_sp', [username])
                user = cursor.fetchall()
                # print user
            except Error as e:
                print e
            finally:
                cursor.close()
        else:
            userid = request.session['userid']

            try:
                cursor = connection.cursor()
                cursor.callproc('get_publicationsByUserId_sp', [userid])
                user = cursor.fetchall()
                # print user
            except Error as e:
                print e
            finally:
                cursor.close()

        publications = []
        for element in user:
            publication = {}
            authors = []
            publication_id = element[0]
            cursor = connection.cursor()
            try:
                cursor.callproc('get_authorsByPublicationId_sp',[publication_id])
                group_authors = cursor.fetchall()
                # print team_member
                for author in group_authors:
                    author_json  = {}
                    author_json["name"] = author[0]
                    author_json["profileUrl"] = author[1]
                    authors.append(author_json)
                # print authors
            except Error as e:
                print e
            finally:
                cursor.close()

            publication["title"] = element[1]
            publication["publication_publisher"] = element[2]
            publication["date"] = str(element[3])
            publication["publication_url"] = element[4]
            publication["description"] = element[5]
            publication["authors"] = authors
            
            publications.append(publication)
        # print projects
        context = {
                    "publications":publications,
        }

        return HttpResponse(json.dumps(context))

    def delete(self,request):
        userid = request.session['userid']
        json_index = json.loads(request.body)
        index = json_index['index']
        try:
            cursor = connection.cursor()
            cursor.callproc('delete_publicationByUserId_sp',[userid,index])
            print "User Publication Deleted"
            publication_ids = cursor.fetchall()
            for element in publication_ids:
                publication_id = element[0]
            print publication_id
        except Error as e:
            print e
        finally:
            cursor.close()

        try:
            cursor = connection.cursor()
            cursor.callproc('delete_authorsByPublicationId_sp',[publication_id])
            print "User Publication's Authors Deleted"
        except Error as e:
            print e
        finally:
            cursor.close()

        return HttpResponse("User Publication and Authors Deleted")

class language(CSRFExemptView):
    def put(self,request):
        json_languages = json.loads(request.body)
        # print json_languages
        userid = request.session['userid']
        # languages = json_experience['languages']
        ''' To delete older languages'''
        cursor = connection.cursor()
        try:
            cursor.callproc('delete_language_sp',[userid])
            print "Languages Deleted"
        except Error as e:
            print e
        finally:
            cursor.close()

        ''' To insert new languages'''
        for language in json_languages:
            cursor = connection.cursor()
            try:
                cursor.callproc('insert_language_sp',[0,userid,language])
                print "Languages Inserted or Updated"
            except Error as e:
                print e
            finally:
                cursor.close()
        return HttpResponse("Languages Inserted or Updated")

    def post(self,request):
        userid = request.session['userid']
        language_json = json.loads(request.body)
        print language_json
        for language in language_json:
            cursor = connection.cursor()
            try:
                cursor.callproc('insert_language_sp', [0,userid,language['name']])
                print "New Language Inserted"
            except Error as e:
                print e
            finally:
                cursor.close()
        return HttpResponse("New Language Inserted")

    def get(self,request):
        username = request.GET.get('emailId')
        # print username
        if username is not None:
            try:
                cursor = connection.cursor()
                cursor.callproc('get_languagesByUsername_sp', [username])
                user_languages = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()
        else:
            userid = request.session['userid']
            try:
                cursor = connection.cursor()
                cursor.callproc('get_languagesByUserId_sp', [userid])
                user_languages = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()

        languages = []
        for element in user_languages:
            languages.append(element[1])
        # print languages
        context = {
                    "languages":languages,
        }

        return HttpResponse(json.dumps(context))

class education(CSRFExemptView):
    def post(self,request):
        userid = request.session['userid']
        education_json = json.loads(request.body)
        print education_json
        acitivity_and_society = education_json['activitiesAndSociety']

        # ''' To get already exists Education to count and set index accordingly'''
        # cursor = connection.cursor()
        # index = 0
        # try:
        #     cursor.callproc('get_educationByUserId_sp', [userid])
        #     user_education = cursor.fetchall()
        #     for education in user_education:
        #         index=index+1
        #     print index
        # except Error as e:
        #     print e
        # finally:
        #     cursor.close()

        # ''' Insert Education with calculated Index'''
        cursor = connection.cursor()
        try:
            cursor.callproc('insert_education_sp', [0,userid,education_json['schoolName'],education_json['startTime'],
                                                    education_json['endTime'],education_json['degree'],education_json['fieldOfStudy'],
                                                    education_json['grade'],education_json['school_logo'],education_json['description'],0,0])
            education_ids = cursor.fetchall()
            for ids in education_ids:
                education_id = ids[0]
            print "New Education Inserted"
        except Error as e:
            print e
        finally:
            cursor.close()

        ''' To insert New Activity and Society details based on Education Id'''
        for activity in acitivity_and_society:
            cursor = connection.cursor()
            try:
                cursor.callproc('insert_activityByEducationId_sp',[0,education_id,activity["name"]])
                print "Acitivity and Society Inserted"
            except Error as e:
                print e
            finally:
                cursor.close()
        return HttpResponse("New Education Inserted ")

    def put(self,request):
        education_json = json.loads(request.body)
        index = education_json['index']
        # print index
        education = education_json['updateEducation']
        acitivity_and_society = education["activitiesAndSociety"]
        userid = request.session['userid']

        ''' To get education id based on index'''
        cursor = connection.cursor()
        try:
            cursor.callproc('get_educationIdByIndexUserId_sp',[userid,index])
            educationids = cursor.fetchall()
            for ids in educationids:
                education_id = ids[0]
        except Error as e:
            print e
        finally:
            cursor.close()

        ''' To delete older details of Activity and Society based on education Id'''
        cursor = connection.cursor()
        try:
            cursor.callproc('delete_activityByeEducationId_sp',[education_id])
            print "Old Activity and society Deleted"
        except Error as e:
            print e
        finally:
            cursor.close()

        ''' To insert New Activity and Society details based on Education Id'''
        for activity in acitivity_and_society:
            cursor = connection.cursor()
            try:
                cursor.callproc('insert_activityByEducationId_sp',[0,education_id,activity["name"]])
                print "Acitivity and Society Inserted or Updated"
            except Error as e:
                print e
            finally:
                cursor.close()

        ''' To insert Education details except Activity and Society details'''
        cursor = connection.cursor()
        try:
            cursor.callproc('update_education_sp', [0,userid,education["schoolName"],education["startTime"],
                                                    education["endTime"],education["degree"],education["fieldOfStudy"],
                                                    education["grade"],education["school_logo"],education["description"],
                                                    education["numberOfProjects"],education["numberOfCourses"],index])
            print "Education is updated"
            return HttpResponse("Education is updated")
        except Error as e:
            print e
        finally:
            cursor.close()

    def get(self,request):
        username = request.GET.get('emailId')
        # print "Username in Education is"
        # print username

        if username is not None:
            try:
                cursor = connection.cursor()
                cursor.callproc('get_educationByUsername_sp', [username])
                user_education = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()

        else:
            userid = request.session['userid']
            try:
                cursor = connection.cursor()
                cursor.callproc('get_educationByUserId_sp', [userid])
                user_education = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()

        education = []
        ''' To get activity and society related to education Id'''
        for element in user_education:
            activity_and_society = []
            try:
                cursor = connection.cursor()
                cursor.callproc('get_activityAndSocietyByEducationId',[element[0]])
                activities_and_societies = cursor.fetchall()
                for activity in activities_and_societies:
                    activity_json  = {}
                    activity_json["name"] = activity[0]
                    activity_and_society.append(activity_json)
                # print activity_and_society
            except Error as e:
                print e
            finally:
                cursor.close()
            education_json = {}
            education_json["schoolName"] = element[1]
            education_json["startTime"] = element[2]
            education_json["endTime"] = element[3]
            education_json["degree"] = element[4]
            education_json["fieldOfStudy"] = element[5]
            education_json["grade"] = element[6]
            education_json["school_logo"] = element[7]
            education_json["activitiesAndSociety"] = activity_and_society
            education_json["description"] = element[8]
            education_json["numberOfProjects"] = element[9]
            education_json["numberOfCourses"] = element[10]
            education.append(education_json)
        # print education

        context = {
                    "education":education,
        }

        return HttpResponse(json.dumps(context))

    def delete(self,request):
        userid = request.session['userid']
        json_index = json.loads(request.body)
        index = json_index['index']
        try:
            cursor = connection.cursor()
            cursor.callproc('delete_educationByUserId_sp',[userid,index])
            print "User Education Deleted"
            education_ids = cursor.fetchall()
            for element in education_ids:
                education_id = element[0]
        except Error as e:
            print e
        finally:
            cursor.close()

        try:
            cursor = connection.cursor()
            cursor.callproc('delete_activityByeEducationId_sp',[education_id])
            print "User Education's Activity and Society Deleted"
        except Error as e:
            print e
        finally:
            cursor.close()

        return HttpResponse("User Education and Activity and Society Deleted")

class additional_info(CSRFExemptView):
    def post(self,request):
        userid = request.session['userid']
        additional_info_json = json.loads(request.body)
        print additional_info_json

        # ''' To get already exists Additional Information to count and set index accordingly'''
        # cursor = connection.cursor()
        # index = 0
        # try:
        #     cursor.callproc('get_additionalinfoByUserId_sp', [userid])
        #     user_additional_info = cursor.fetchall()
        #     for info in user_additional_info:
        #         index=index+1
        #     print index
        # except Error as e:
        #     print e
        # finally:
        #     cursor.close()

        # ''' Insert Additional Information with calculated Index'''
        try:
            cursor = connection.cursor()
            cursor.callproc('insert_additional_info_sp', [0,userid,additional_info_json['title'],additional_info_json['values']])
            print "New Additional Information Inserted"
        except Error as e:
            print e
        finally:
            cursor.close()
        return HttpResponse("New Additional Information Inserted")

    def put(self,request):
        json_additional_info = json.loads(request.body)
        # print json_additional_info
        index = json_additional_info["index"]
        # print index
        additional_info = json_additional_info["additional_info"]
        # print additional_info
        userid = request.session['userid']
        cursor = connection.cursor()
        try:
            cursor.callproc('update_additional_info_sp',[0,userid,additional_info["title"],additional_info["values"],index])
            print "User Additional Information Inserted or Updated"
            return HttpResponse("User Additional Information Inserted or Updated")
        except Error as e:
            print e
        finally:
            cursor.close()


    def get(self,request):
        username = request.GET.get('emailId')
        print username
        if username is not None:
            cursor = connection.cursor()
            try:
                cursor.callproc('get_additionalinfoByUsername_sp', [username])
                user_additional_info = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()
        else:
            userid = request.session['userid']
            cursor = connection.cursor()
            try:
                cursor.callproc('get_additionalinfoByUserId_sp', [userid])
                user_additional_info = cursor.fetchall()
            except Error as e:
                print e
            finally:
                cursor.close()

        additional_info = []
        for element in user_additional_info:
            additional_info_json = {}
            additional_info_json["title"] = element[1]
            additional_info_json["values"] = element[2]
            additional_info.append(additional_info_json)
        # print additional_info

        context = {
                    "additional_info":additional_info,
        }

        return HttpResponse(json.dumps(context))

    def delete(self,request):
        userid = request.session['userid']
        json_index = json.loads(request.body)
        index = json_index['index']
        try:
            cursor = connection.cursor()
            cursor.callproc('delete_additionalInfoByUserId_sp',[userid,index])
            print "User Additional Information Deleted"
        
        except Error as e:
            print e
        finally:
            cursor.close()

        return HttpResponse("User Additional Information Deleted")

class recommendations(CSRFExemptView):
    def get(self,request):
        userid = request.session['userid']
        cursor = connection.cursor()
        try:
            cursor.callproc('get_recommendationsByUserId_sp', [userid])
            user_recommendations = cursor.fetchall()
            recommendations = []
            for element in user_recommendations:
                recommendation = {}
                recommendation["position"] = element[1]
                recommendation["companyName"] = element[2]
                recommendation["date"] = str(element[3])+" "+str(element[4])+" "+str(element[5])
                recommendation["recommender"] = element[6]
                # recommendation["profile_url"] = element[7]
                recommendation["relation"] = element[7]
                recommendation["comments"] = element[8]
                recommendation["profile_url"] = element[9]
                recommendations.append(recommendation)
            # print recommendations
        except Error as e:
            print e
        finally:
            cursor.close()

        context = {
                    "recommendations":recommendations,
        }

        return HttpResponse(json.dumps(context))

@csrf_exempt
def linkUpload(request):
    if request.method == 'POST':
        video_json = json.loads(request.body)
        video_link = video_json['videoLink']
        print video_link          
        uploadfile = Upload()
        # video_link = "www.youtube.com/embed/bvklNSOplYc#t=1016"
        if "youtube" in video_link:
            linktype = "youtube"
            print "Youtube Link"
        elif "youtu.be" in video_link:
            linktype = "youtube"
            print "Youtube share Link"
        elif "dailymotion" in video_link:
            linktype = "dailymotion"
            print "Dailymotion Link"
        elif "vimeo" in video_link:
            print "Vimeo Link"
            linktype = "vimeo"
        elif "vine" in video_link:
            linktype = "vine"
            print "vine Link"
        else:
            return HttpResponse('Not a valid video Link!')

        username = request.session['username']
        # username = "bhavin@gmail.com"
        user = username.split("@")[0]
        # print user
        cursor = connection.cursor()
        try:
            cursor.callproc('get_linkByUsernameSourceFiletype_sp', [user,'videos',video_link])
            video_url = cursor.fetchall()
        except Error as e:
            print e
        finally:
            cursor.close()

        if not video_url:
            cursor = connection.cursor()
            try:
                cursor.callproc('insert_linkUpload_sp', [0,'videos',user,linktype,video_link])
                print "Video Link saved in DB"
            except Error as e:
                print e
            finally:
                cursor.close()

            # uploadfile.source = video_link
            # uploadfile.filetype = 'videos'
            # uploadfile.username = user
            # uploadfile.save()
            return HttpResponse('Thanks for uploading the file!')
        else:
            print "File already present in DB"
            return HttpResponse('Already uploaded this Link!')

        # documents = Upload.objects.filter(filetype = 'videos', username = user, source = video_link)
        # if not documents:
        #     uploadfile.source = video_link
        #     uploadfile.filetype = 'videos'
        #     uploadfile.username = user
        #     uploadfile.save()
        #     print "File saved in DB"
        #     return HttpResponse('Thanks for uploading the file!')
        # else:
        #     print "File already present in DB"
        #     return HttpResponse('Already uploaded this Link!')
        

''' File Upload User'''
@csrf_exempt
def fileUpload(request):
    '''Simple view method for uploading an image'''
    if request.method == 'POST':
        file = request.FILES['file']
        print file.name           # Gives name
        print file.content_type   # Gives Content type text/html etc
        print file.size    
        # print file
        username = request.session['username']
        user = username.split("@")[0]
        # print user

        # form = UploadFileForm(request.POST, request.FILES)

        # if form.is_valid() and form.is_multipart():
        pathPrefix = ''
        if file.content_type == 'image/jpeg' or file.content_type == 'image/png' :
            print 'Image File'
            pathPrefix = 'images'
        elif file.content_type == 'application/pdf':
            print 'PDF File'
            pathPrefix = 'documents'
        elif file.content_type == 'video/mp4':
            print 'Video file'
            pathPrefix = 'videos'

        if pathPrefix != '':
            save_file(file, pathPrefix, user)
            return HttpResponse('Thanks for uploading the file!')
        else:
            return HttpResponse('Invalid submission! We only support PDFs/Images/Videos')    
        # else:
        #     print "Invalid Submission"
        #     return HttpResponse('Invalid submission! We only support PDFs/Images/Videos')
    else:
        return HttpResponse('Invalid Procotol: Try POST!')

def save_file(file, path, user):
    ''' Little helper to save a file''' 
    filename = file._get_name();
    uploadfile = Upload()
    uploadAt = '%s/%s/%s/%s' % (settings.BASE_DIR + settings.MEDIA_ROOT, user, str(path), str(filename))
    # print settings.BASE_DIR
    # print settings.MEDIA_ROOT
    db_uploadAt = '%s/%s/%s' % (user, str(path), str(filename))
    print db_uploadAt


    cursor = connection.cursor()
    try:
        cursor.callproc('get_linkByUsernameSourceFiletype_sp', [user,path,db_uploadAt])
        documents = cursor.fetchall()
    except Error as e:
        print e
    finally:
        cursor.close()

    if not documents:
        cursor = connection.cursor()
        try:
            cursor.callproc('insert_documentOrImageUpload_sp', [0,path,user,db_uploadAt])
            documents = cursor.fetchall()
        except Error as e:
            print e
        finally:
            cursor.close()
        # uploadfile.source = db_uploadAt
        # uploadfile.filetype = path
        # uploadfile.username = user
        # uploadfile.save()

        print "File saved in DB"
        if not os.path.exists(os.path.dirname(uploadAt)):
            try:
                os.makedirs(os.path.dirname(uploadAt))
            except OSError as exc: # Guard against race condition
                if exc.errno != errno.EEXIST:
                    raise
        fd = open(uploadAt, 'wb')
        for chunk in file.chunks():
            fd.write(chunk)
        fd.close()
    else:
        print "File already present in DB"

    # documents = Upload.objects.filter(username = user,filetype = path,source = db_uploadAt)
    # if not documents:
    #     uploadfile.source = db_uploadAt
    #     uploadfile.filetype = path
    #     uploadfile.username = user
    #     uploadfile.save()
    #     print "File saved in DB"
    #     if not os.path.exists(os.path.dirname(uploadAt)):
    #         try:
    #             os.makedirs(os.path.dirname(uploadAt))
    #         except OSError as exc: # Guard against race condition
    #             if exc.errno != errno.EEXIST:
    #                 raise
    #     fd = open(uploadAt, 'wb')
    #     for chunk in file.chunks():
    #         fd.write(chunk)
    #     fd.close()
    # else:
    #     print "File already present in DB"
    

'''To Retrieve User's attachment (Documents)'''
@csrf_exempt
def file_retrieve_documents(request):
    if request.method == 'GET':
        username = request.GET.get('emailId')
        # print username
        if username is not None:
            print "Take username from Search"
        else:
            username = request.session['username']
        file_documents = []
        user = username.split("@")[0]

        cursor = connection.cursor()
        try:
            cursor.callproc('get_sourceByUsernameFiletype_sp', [user,'documents'])
            documents = cursor.fetchall()
        except Error as e:
            print e
        finally:
            cursor.close()


        for document in documents:
            dct_document = {}
            # print 'Media Root is:' + settings.MEDIA_ROOT
            documentSrc = '%s/%s' % ("static/media_cdn", document[0])
            dct_document['src'] = documentSrc
            # dct_document['alt'] = str(document.file)
            # print image.file
            # print image.filetype
            # print image.username
            # print image.timestamp
            file_documents.append(dct_document);

        # print file_documents

        context = json.dumps(file_documents)
        # print context
        return HttpResponse(context)

@csrf_exempt
def delete_document(request):
    if request.method == 'POST':
        username = request.session['username']
        user = username.split("@")[0]
        cursor = connection.cursor()
        json_index = json.loads(request.body)
        index = json_index['index']
        # print index
        # print user
        try:
            cursor.callproc('delete_documentByUserId_sp', [user,index])
            print "Document Deleted From DB"
            document_sources = cursor.fetchall()
        except Error as e:
            print e
        finally:
            cursor.close()
        
        for source in document_sources:
            document_source = '%s/%s' % ("myapp/static/media_cdn", source[0])
            os.remove(document_source)
            "File Deleted from folder"
        return HttpResponse("Document Deleted")

'''To Retrieve User's attachment (Images)'''
@csrf_exempt
def file_retrieve_images(request):
    if request.method == 'GET':
        username = request.GET.get('emailId')
        # print username
        if username is not None:
            print "Take username from Search"
        else:
            username = request.session['username']

        file_images = []
        user = username.split("@")[0]
        # images = Upload.objects.filter(filetype = 'images',username = user)

        cursor = connection.cursor()
        try:
            cursor.callproc('get_sourceByUsernameFiletype_sp', [user,'images'])
            images = cursor.fetchall()
        except Error as e:
            print e
        finally:
            cursor.close()

        for image in images:
            dct_image = {}
            # print 'Media Root is:' + settings.MEDIA_ROOT
            imageSrc = '%s/%s' % ("static/media_cdn", image[0])
            dct_image['src'] = imageSrc
            dct_image['alt'] = image[0]
            # print image.file
            # print image.filetype
            # print image.username
            # print image.timestamp
            file_images.append(dct_image);

        # print file_images

        context = json.dumps(file_images)
        # print context
        return HttpResponse(context)

@csrf_exempt
def delete_image(request):
    if request.method == 'POST':
        username = request.session['username']
        user = username.split("@")[0]
        cursor = connection.cursor()
        json_index = json.loads(request.body)
        index = json_index['index']
        print index
        print user
        try:
            cursor.callproc('delete_imageByUserId_sp', [user,index])
            print "Image Deleted From DB"
            image_sources = cursor.fetchall()
            # print image_sources
        except Error as e:
            print e
        finally:
            cursor.close()
        
        for source in image_sources:
            image_source = '%s/%s' % ("myapp/static/media_cdn", source[0])
            os.remove(image_source)
            print "Image Deleted from folder"
        return HttpResponse("Image Deleted")

'''To Retrieve User's attachment (Videos)'''
@csrf_exempt
def file_retrieve_videos(request):
    if request.method == 'GET':
        username = request.GET.get('emailId')
        # print username
        if username is not None:
            print "Take username from Search"
        else:
            username = request.session['username']

        file_videos = []
        user = username.split("@")[0]
        # videos = Upload.objects.filter(filetype = 'videos',username = user)

        cursor = connection.cursor()
        try:
            cursor.callproc('get_sourceByUsernameFiletype_sp', [user,'videos'])
            videos = cursor.fetchall()
        except Error as e:
            print e
        finally:
            cursor.close()

        for video in videos:
            dct_video = {}
            # print 'Media Root is:' + settings.MEDIA_ROOT
            videoSrc = '%s/%s' % ("static/media_cdn", video[0])
            dct_video['src'] = video[0]
            dct_video['alt'] = video[0]
            # print image.file
            # print image.filetype
            # print image.username
            # print image.timestamp
            file_videos.append(dct_video);
        
        context = json.dumps(file_videos)
        # print context
        return HttpResponse(context)

@csrf_exempt
def delete_video(request):
    if request.method == 'POST':
        username = request.session['username']
        user = username.split("@")[0]
        cursor = connection.cursor()
        json_index = json.loads(request.body)
        index = json_index['index']
        # print index
        # print user
        try:
            cursor.callproc('delete_videoByUserId_sp', [user,index])
            print "Video Deleted From DB"
        except Error as e:
            print e
        finally:
            cursor.close()

        return HttpResponse("Video Deleted")