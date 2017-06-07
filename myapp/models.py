from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager
from django.forms import ModelForm

from django.conf import settings
# from django.contrib.sessions.models import Session

# Create your models here.

''' Raise an error if email or username is not provided'''
class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **kwargs):
        if not username:
            raise ValueError('Users must have a valid email address.')

        # if not kwargs.get('username'):
        #     raise ValueError('Users must have a valid username.')

        #self.model refers to the model attribute of BaseUserManager
        user = self.model(
            username=self.normalize_email(username), #username=kwargs.get('username')
            first_name = kwargs.get('first_name'),
            last_name = kwargs.get('last_name')
        )

        user.set_password(password)
        user.save()

        return user

    #Instead of copying all of the code from create_account and pasting it in create_superuser, we simply let create_user handle the actual creation
    def create_superuser(self, username, password, **kwargs):
        user = self.create_user(username, password, **kwargs)

        user.is_admin = True
        user.save()

        return user
class User(AbstractBaseUser):
    user_id = models.AutoField(primary_key=True,default=None)
    username = models.CharField(max_length=45,unique=True)
    #password = models.CharField(max_length=32)
    gender = models.CharField(max_length=6)
    date_of_birth = models.DateField()
    #url = models.CharField(max_length=1000, blank=True, null=True)
    first_name = models.CharField(max_length=45)
    last_name = models.CharField(max_length=45, blank=True, null=True)
    #middle_name = models.CharField(max_length=45, blank=True, null=True)
    #suffix = models.CharField(max_length=10, blank=True, null=True)
    #language = models.CharField(max_length=100, blank=True, null=True)
    #bio = models.CharField(max_length=5000, blank=True, null=True)
    user_photo = models.CharField(max_length=300, blank=True, null=True)
    current_exp_id = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True)
    updated_at = models.DateTimeField(auto_now=True,null=True)

    # def __unicode__(self):  #Show in database
    #     return self.username

    # def __str__(self):      #Show in database
    #     return self.username

    # def get_absolute_url(self):
    #     return reverse ("posts:detail", kwargs={"id":self.user_id})  #namespace:urlname
    #     #return "/posts/%s/" %(self.id)

    objects = UserManager()

    USERNAME_FIELD = 'username'    #To tell Django that we want to treat the username(email) field as the username for this model
    # REQUIRED_FIELDS = ['username']

    def __unicode__(self):
        return self.username

    def get_full_name(self):
        return ' '.join([self.first_name, self.last_name])

    def get_short_name(self):
        return self.first_name

    class Meta:
        managed = True
        db_table = 'user'

''' To define stored location of file'''
class Upload(models.Model):
    """docstring for Upload"""
    # title = models.CharField(max_length = 120)
    source = models.CharField(max_length = 100, null=True, blank=True)
    filetype = models.CharField(max_length = 12, null=True, blank=True)
    username = models.CharField(max_length = 45, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now=False,auto_now_add=True)
    linktype = models.CharField(max_length = 12, null=True, blank=True)
    class Meta:
        db_table = 'upload'

class UploadFileForm(ModelForm):
    class Meta:
        model = Upload
        fields = "__all__" 

