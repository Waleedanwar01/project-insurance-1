from django.urls import path, include
from rest_framework import routers
from .views import BlogPostViewSet, CategoryViewSet
from .api_views import states_list

router = routers.DefaultRouter()
router.register(r'posts', BlogPostViewSet, basename='post')
router.register(r'categories', CategoryViewSet, basename='category')
from .views import BlogPostsByCategory

urlpatterns = [
    path('', include(router.urls)),
    path('api/states/', states_list, name='states-list'),
     path('api/blog/posts/', BlogPostsByCategory.as_view(), name='blog-posts-by-category'),
]
