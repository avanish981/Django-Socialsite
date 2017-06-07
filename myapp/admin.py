# from django.contrib import admin
# from .models import User, Upload
# # Register your models here.

# class UserAdmin(admin.ModelAdmin):
# 	list_display = ["user_id","username","password","gender","date_of_birth","url","first_name","last_name","middle_name","suffix","language","bio","image"]
# 	search_fields = ["username","first_name","last_name"]
# 	class Meta:
# 		model = User

# admin.site.register(User,UserAdmin)

# class UploadAdmin(admin.ModelAdmin):
# 	list_display = ["id","source","filetype","username","timestamp","linktype"]
# 	class Meta:
# 		model = Upload

# admin.site.register(Upload,UploadAdmin)