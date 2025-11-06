from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FAQViewSet, 
    FAQCategoryViewSet, 
    FAQSearchView, 
    RecentContentView
)

router = DefaultRouter()
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'categories', FAQCategoryViewSet, basename='faq-category')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/search/', FAQSearchView.as_view(), name='faq-search'),
    path('api/recent-content/', RecentContentView.as_view(), name='recent-content'),
]