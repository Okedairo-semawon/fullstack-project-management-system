from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Project, Task, Milestone, Document

class UserSerializer (serializers.ModelSerializer):
    class Meta:
        model = User
        field = ['id', 'username', 'first_name', 'last_name', 'email']

class TaskSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.SerializerMethodField()
    class Meta:
        model = Task
        fields = '__all__'

    def get_assigned_to_name (self, obj):
        if obj.assigned_to:
            return f"{obj.assigned_to.first_name} {obj.assigned_to.last_name}"
        return None
    
class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'

    def get_uploaded_by_name(self, obj):
        if obj.uploaded_by:
            return f"{obj.uploaded_by.first_name} {obj.uploaded_by.last_name}"
        return None
    
class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    milestones = MilestoneSerializer(many=True, read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    manager_name = serializers.SerializerMethodField()
    completion_percentage = serializers.ReadOnlyField()
    budget_remaining = serializers.ReadOnlyField()    

    class Meta:
        model = Project
        fields = '__all__'

    def get_manager_name(self, obj):
        if obj.manager:
            return f"{obj.manager.first_name} {obj.manager.last_name}"
        return None

class ProjectListSerializer(serializers.ModelSerializer):
    manager_name = serializers.SerializerMethodField()
    completion_percentage = serializers.ReadOnlyField()
    budget_remaining = serializers.ReadOnlyField()
    task_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'location', 'status', 'priority',
            'start_date', 'end_date', 'budget', 'spent',
            'budget_remaining', 'completion_percentage',
            'manager_name', 'task_count', 'created_at'
        ]

    def get_manager_name(self, obj):
        if obj.manager:
            return f"{obj.manager.first_name} {obj.manager.last_name}"
        return None

    def get_task_count(self, obj):
        return obj.tasks.count()    
    