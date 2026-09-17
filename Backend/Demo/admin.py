from django.contrib import admin

from .models import DemoSchedule, DemoCourse, DemoRequest


@admin.register(DemoSchedule)
class DemoScheduleAdmin(admin.ModelAdmin):
    list_display = ('campaign', 'instructor', 'status', 'scheduled_at', 'created_by', 'created_at')
    list_filter = ('status', 'scheduled_at', 'campaign')
    search_fields = ('campaign__name', 'instructor__full_name', 'meeting_link')


@admin.register(DemoCourse)
class DemoCourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(DemoRequest)
class DemoRequestAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone', 'course', 'created_at')
    list_filter = ('course',)
    search_fields = ('full_name', 'email', 'phone')
