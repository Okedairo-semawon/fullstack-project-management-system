from django.contrib import admin
from .models import Project, Task, Milestone, Document

# Register your models here.
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'status', 'priority', 'manager', 'start_date', 'end_date', 'budget']
    search_fields = ['name', 'location', 'contractor_name', 'site_engineer_name']
    list_filter = ['status', 'priority']
    
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'assigned_to', 'status', 'priority', 'due_date']
    search_fields = ['title']
    list_filter = ['status', 'priority']

@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'due_date', 'is_completed']
    list_filter = ['is_completed']

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['file_name', 'project', 'uploaded_by', 'uploaded_at']