# Generated by Django 5.1.4 on 2024-12-08 11:49

import django.db.models.deletion
import django.utils.timezone
import django_fsm
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('num_departments', models.IntegerField(default=0, editable=False)),
                ('num_employees', models.IntegerField(default=0, editable=False)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('role', models.CharField(choices=[('Admin', 'Admin'), ('Manager', 'Manager'), ('Employee', 'Employee')], default='Employee', max_length=20)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Department',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('num_employees', models.IntegerField(default=0, editable=False)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='departments', to='core.company')),
            ],
        ),
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', django_fsm.FSMField(choices=[('Application Received', 'Application Received'), ('Interview Scheduled', 'Interview Scheduled'), ('Hired', 'Hired'), ('Not Accepted', 'Not Accepted')], default='Application Received', max_length=50)),
                ('name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('mobile', models.CharField(max_length=15)),
                ('address', models.TextField()),
                ('designation', models.CharField(max_length=100)),
                ('hired_on', models.DateField(blank=True, null=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='employees', to='core.company')),
                ('department', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='employees', to='core.department')),
            ],
        ),
    ]
