# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-23 18:10
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0024_auto_20160723_1106'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='id',
        ),
        migrations.AddField(
            model_name='user',
            name='user_id',
            field=models.AutoField(default=None, primary_key=True, serialize=False),
        ),
    ]