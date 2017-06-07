from django.contrib.auth import update_session_auth_hash

from rest_framework import serializers

from .models import User #Account

'''The reason we do this is so we can pass the required=False argument. Each field in fields is required, 
but we don't want to update the user's password unless they provide a new one. 
Also note the use of the write_only=True argument. The user's password, even in it's hashed and salted form, 
should not be visible to the client in the AJAX responseself.'''

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)
 
    class Meta:
        model = User
        #The fields attribute of the Meta class is where we specify which attributes of the Account model should be serialized. 
        #We must be careful when specifying which fields to serialize because some fields, like is_superuser, should not be available to the client for security reasons.
        fields = ('user_id', 'username', 'created_at', 'updated_at', 'first_name', 'last_name', 'password','confirm_password')
        read_only_fields = ('created_at', 'updated_at',)

        #to turn JSON into a Python object. This is called deserialization and it is handled by the .create() and .update() methods.
        def create(self, validated_data):
            return User.objects.create(**validated_data)

        def update(self, instance, validated_data):
            # instance.username = validated_data.get('username', instance.username)
            # instance.tagline = validated_data.get('tagline', instance.tagline)

            #instance.save()

            password = validated_data.get('password', None)
            confirm_password = validated_data.get('confirm_password', None)

            #This is a naive implementation of how to validate a password. I would not recommend using this in a real-world system, 
            #but for our purposes this does nicely.
            if password and confirm_password and password == confirm_password:
                instance.set_password(password)
                instance.save()

            update_session_auth_hash(self.context.get('request'), instance)

            return instance




