from django.conf.urls import patterns, include, url
from django.contrib import admin

from django.conf import settings
from django.conf.urls.static import static

from rest_framework_nested import routers

from myapp.views import (
	UserViewSet,
	LoginView,
	LogoutView,
	linkedin_login,	
	google_login,
	home,
	login,
	#insert_user,
	logout,
	get_cover_images,
	)

from search.views import (
	advance_search,
	search,
	overview,
	)

from friendship.views import (
	friendship,
	)

from usercalendar.views import (
	calender,
	)

from userprofile.views import (
	fileUpload,
	file_retrieve_documents,
	file_retrieve_images,
	file_retrieve_videos,
	linkUpload,
	summary,
	organization,
	experience,
	course,
	project,
	volunteer,
	opportunities,
	cause,
	volunteer_organization,
	publication,
	language,
	education,
	additional_info,
	recommendations,
	delete_document,
	delete_image,
	delete_video,
	)
# Routers provide an easy way of automatically determining the URL conf.
router = routers.SimpleRouter()
router.register(r'accounts', UserViewSet)            #/api/v1/accounts/

urlpatterns = [
	url(r'^api/v1/auth/logout/$', LogoutView.as_view()),
	url(r'^api/v1/auth/login/$', LoginView.as_view()),
	url(r'^api/v1/', include(router.urls)),
	url(r'^admin/', admin.site.urls),
	url(r'^linkedin_login$', linkedin_login.as_view()),
    url(r'^google_login$', google_login.as_view()),
    # url(r'^login$',login.as_view()),
    #url(r'^insert_user$',insert_user),
    url(r'^logout$',logout),
    url(r'^fileUpload$',fileUpload),
    url(r'^file_retrieve_documents$',file_retrieve_documents),
    url(r'^file_retrieve_images$',file_retrieve_images),
    url(r'^file_retrieve_videos$',file_retrieve_videos),
    url(r'^linkUpload$',linkUpload),
    url(r'^get_cover_images$',get_cover_images),
    url(r'^experience$',experience.as_view()),
    url(r'^summary$',summary.as_view()),
    url(r'^organization$',organization.as_view()),
    url(r'^course$',course.as_view()),
    url(r'^project$',project.as_view()),
    url(r'^volunteer$',volunteer.as_view()),
    url(r'^publication$',publication.as_view()),
    url(r'^language$',language.as_view()),
    url(r'^education$',education.as_view()),
    url(r'^opportunities$',opportunities.as_view()),
    url(r'^cause$',cause.as_view()),
    url(r'^volunteer_organization$',volunteer_organization.as_view()),
    url(r'^additional_info$',additional_info.as_view()),
    url(r'^recommendations$',recommendations.as_view()),
    url(r'^overview$',overview.as_view()),
    url(r'^calender$',calender.as_view()),
    url(r'^calender$',calender.as_view()),
    url(r'^delete_document$',delete_document),
    url(r'^delete_image$',delete_image),
    url(r'^advance_search$',advance_search.as_view()),
    url(r'^search$',search),
    url(r'^friendship$',friendship),
    url(r'^.*$', home),
]