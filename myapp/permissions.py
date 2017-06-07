from rest_framework import permissions

class IsAccountOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, account):
        if request.user:	#The request.user property will typically be set to an instance of the contrib.auth package's User class.The request.auth property is used for any additional authentication information, for example, it may be used to represent an authentication token that the request was signed with.
            return account == request.user	#If account is related to particular user then and only user can have http request methods
        return False