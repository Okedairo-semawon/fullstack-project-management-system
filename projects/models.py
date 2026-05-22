from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Project(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('on_hold', 'On Hold'),
        ('completed', 'Completed'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    name =  models.CharField(max_length=255)
    description =  models.TextField(blank=True)
    location =  models.CharField(max_length=255)
    manager =  models.ForeignKey(User, on_delete= models.SET_NULL, null= True, related_name='managed_projects')
    status =  models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    priority =  models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    start_date =  models.DateField()
    end_date =  models.DateField()
    budget =  models.DecimalField(max_digits=12, decimal_places=2, default=0)
    spent =  models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # site engineer
    site_engineer_name =  models.CharField(max_length=255, blank=True)
    site_engineer_phone =  models.CharField(max_length=20, blank=True)

    # contractor
    contractor_name = models.CharField(max_length=255, blank=True)
    contractor_phone = models.CharField(max_length=20, blank=True)
    contractor_company = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.name
    
    @property
    def budget_remaining(self) :
        return float(self.budget) - float(self.spent)

    @property
    def completion_percentage(self): 
        total =self.tasks.count()
        if total == 0:
            return 0
        done = self.tasks.filter(status='done').count()
        return round((done/total) * 100)
    
class Task(models.Model):
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    project = models.ForeignKey('Project', on_delete= models.CASCADE, related_name= 'tasks')
    assigned_to = models.ForeignKey(User, on_delete= models.SET_NULL, null =True, blank=True, related_name='tasks')
    title = models.CharField(max_length=255)
    description = models.TextField(blank =True)
    due_date = models.DateField()
    status = models.CharField(max_length = 20, choices= STATUS_CHOICES, default= 'todo')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class Milestone(models.Model):

    project = models.ForeignKey(Project, on_delete = models.CASCADE, related_name= 'milestones')
    due_date = models.DateField()
    is_completed = models.BooleanField(default = False)
    title = models.CharField(max_length = 255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) :
        return self.title


class Document(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='documents')
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    file_name = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.file_name




